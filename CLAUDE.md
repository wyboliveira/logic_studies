# CLAUDE.md — Guia do Projeto Logic Studies

Este arquivo orienta agentes de IA (Claude e outros) que trabalham neste repositório. Leia antes de propor ou implementar qualquer mudança.

---

## Visão Geral

**Logic Studies** é uma plataforma educativa de Lógica e Raciocínio para concursos públicos brasileiros. É um site estático puro: HTML + CSS + Vanilla JavaScript. Não há bundler, não há framework, não há transpilação.

- **Site ao vivo:** https://logic-studies-app.web.app
- **Repositório:** https://github.com/wyboliveira/logic_studies
- **Branch de produção:** `main` (deploya automaticamente via GitHub Actions)
- **Branch de desenvolvimento:** `develop`

---

## Arquitetura

### Padrão de globals de browser

**Os arquivos JS usam globals implícitas — não há `export` nem `import`.** Cada arquivo declara uma `class` ou `const` no escopo global, como se estivesse num `<script>` do browser. A ordem dos `<script>` no `index.html` define as dependências.

Ordem de carregamento no `index.html`:
```
progressManager.js → anime.min.js (CDN) → problemData.js → problemEngine.js
→ tableVisualizer.js → sequenceVisualizer.js → listVisualizer.js
→ toast.js → stepController.js → uiManager.js → app.js
```

**Nunca adicione `export` ou `import` aos arquivos source.** Os testes lidam com isso via `vm` do Node.js (veja seção de testes).

### Fluxo de dados

```
problemData.js  ──►  ProblemEngine  ──►  StepController
                          │
                     onStepChange / onStateChange
                          ▼
                      UIManager  ──►  getVisualizer(type)  ──►  [table|sequence|list]Visualizer
                          │
                     progressManager  ──►  localStorage
```

### Roteamento de visualizadores (`uiManager.js`)

```js
getVisualizer(type) {
    switch (type) {
        case 'table':    return tableVisualizer;
        case 'sequence': return sequenceVisualizer;
        case 'order':    return listVisualizer;
    }
}
```

Para adicionar um novo tipo de problema, é necessário: (1) criar um novo visualizador, (2) registrá-lo aqui, (3) adicionar o `<script>` no `index.html`.

---

## ProblemEngine — API

```js
const engine = new ProblemEngine();

engine.loadProblem(id)        // Carrega problema por ID; throws se não existir
engine.nextStep()             // → { success, stepData?, reason? }
engine.prevStep()             // → { success, reason? }
engine.reset()                // Volta ao step 0
engine.showSolution()         // Avança todos os steps silenciosamente (sem onStepChange)
engine.getState()             // → structuredClone do estado atual
engine.getPrevState()         // → structuredClone do estado anterior (ou null)
engine.getCurrentStep()       // → número do step atual
engine.getTotalSteps()        // → total de steps do problema
engine.isAtStart()            // → boolean
engine.isAtEnd()              // → boolean
engine.getAnswer()            // → string com a resposta
engine.getSummary()           // → string com o resumo pedagógico

engine.onStepChange = (stepData, state, prevState) => { ... }  // Callback por step
engine.onStateChange = (state) => { ... }                       // Callback ao final do showSolution
```

**`showSolution()` não dispara `onStepChange`** — apenas `onStateChange` no final. Isso é intencional para evitar que a animação rode 20 vezes.

**`getState()` sempre retorna um clone** via `structuredClone()`. Nunca mute o retorno para alterar o estado interno — não vai funcionar.

---

## Estrutura de um Problema (`problemData.js`)

Cada problema é um objeto no array `PROBLEMS`. Campos obrigatórios:

```js
{
  id: Number,           // Único, crescente
  title: String,        // Título curto para o card
  type: 'table' | 'sequence' | 'order',
  difficulty: 'fácil' | 'médio' | 'difícil',
  icon: String,         // Emoji
  description: String,  // Subtítulo do card
  statement: String,    // HTML do enunciado (use <span class="clue"> para cada pista)
  initialState: Object, // Depende do tipo — veja abaixo
  steps: Array,         // Lista de steps — veja abaixo
  answer: String,       // Texto da resposta final
  summary: String,      // Resumo pedagógico exibido ao concluir
}
```

### `initialState` por tipo

**`table`:**
```js
{
  rows: ["Ana", "Bruno", "Carla"],          // Pessoas/entidades nas linhas
  cols: ["Médica", "Advogado", "Engenheira"], // Atributos nas colunas
  cells: [["?","?","?"], ["?","?","?"], ["?","?","?"]], // Sempre "?" no início
}
```

**`sequence`:**
```js
{
  numbers: [1, 4, 9, 16, 25, "?"],  // Último elemento sempre "?"
  highlighted: [],
  revealed: false,
}
```

**`order`:**
```js
{
  positions: ["1º", "2º", "3º", "4º"],                    // Rótulos das posições
  slots: [null, null, null, null],                          // null = vazio
  people: ["Ana", "Bruno", "Carlos", "Dora"],               // Todos os participantes
  eliminated: { Ana: [], Bruno: [], Carlos: [], Dora: [] }, // Posições eliminadas por pessoa
}
```

> **Atenção:** O campo `eliminated` no `initialState` do tipo `order` **deve** ser declarado com arrays vazios para cada pessoa. O engine inicializa defensivamente, mas omitir o campo causa falha nos testes.

### Tipos de `action` por tipo de problema

**`table` — `applyTableAction`:**
```js
{ type: "init" }                        // Primeiro step — sem mudança de estado
{ type: "eliminate", row: 0, col: 1 }   // Marca célula como '✗'
{ type: "confirm",   row: 0, col: 0 }   // Marca célula como '✓'
{ type: "info",      text: "..." }      // Adiciona nota ao array state.infos
```

**`sequence` — `applySequenceAction`:**
```js
{ type: "init" }
{ type: "highlight", index: 2, operation: "+3" }  // Destaca box e label de operação
{ type: "reveal", value: 14 }                      // Substitui "?" pelo valor e marca revealed=true
{ type: "info", text: "..." }
```

**`order` — `applyOrderAction`:**
```js
{ type: "init" }
{ type: "place",    person: "Ana", position: 0 }          // Coloca pessoa no slot
{ type: "eliminate", person: "Bruno", positions: [0, 2] } // Adiciona posições ao eliminated
{ type: "info", text: "..." }
```

---

## Invariantes dos Dados

Para que os **testes passem**, cada problema deve satisfazer:

- **Tabela:** após `showSolution()`, cada linha e cada coluna tem exatamente 1 célula `'✓'` (bijeção perfeita).
- **Sequência:** após `showSolution()`, `state.revealed === true` e `state.numbers[state.numbers.length - 1]` é o valor numérico esperado (não `"?"`).
- **Ordenação:** após `showSolution()`, `state.slots` não contém `null` — todos os slots estão preenchidos.

---

## Testes

```bash
npm install        # Instala Vitest
npm test           # Roda 71 testes
npm run test:watch # Modo watch
npm run test:coverage # Cobertura HTML em coverage/
```

### Como os testes funcionam

Os arquivos source usam globals de browser (sem `export`). O helper `tests/helpers/testContext.js` usa o módulo `vm` do Node.js para avaliar ambos os arquivos num mesmo sandbox:

```js
const vmCtx = vm.createContext({ structuredClone }); // Injeta structuredClone no sandbox
vm.runInContext(`(function(){ ${dataSrc}\n this.PROBLEMS = PROBLEMS; }).call(this)`, vmCtx);
vm.runInContext(`(function(){ ${engineSrc}\n this.ProblemEngine = ProblemEngine; }).call(this)`, vmCtx);
```

**Por que IIFE?** — `const` e `class` em `vm.runInContext` são block-scoped e não viram propriedades do contexto. O IIFE com `this` (que é o contexto) resolve isso sem modificar os arquivos source.

**Por que injetar `structuredClone`?** — O sandbox `vm` é isolado e não herda globals do Node.js.

### Adicionando testes para novos problemas

Ao adicionar um novo problema, adicione ao `tests/problems.test.js`:

1. O problema passará automaticamente nos testes genéricos (load/solve, bijeção para tabelas).
2. Para sequências, adicione um teste específico verificando o valor final.
3. Para ordenação, adicione um teste verificando os slots.
4. Para tabelas, opcionalmente adicione um teste de células específicas.

---

## Como Adicionar um Novo Problema (Checklist)

### Para tipos existentes (`table`, `sequence`, `order`)

1. Abra `js/problems/problemData.js`
2. Adicione o objeto do problema no final do array `PROBLEMS`, com um `id` incrementado
3. Siga a estrutura `initialState` e `action` do tipo escolhido (veja acima)
4. Verifique os invariantes: tabela deve ter bijeção perfeita no último step
5. Rode `npm test` — todos os 71+ testes devem passar
6. Abra o site localmente e teste o visual do problema novo

### Para um novo tipo de problema

1. Crie `js/visualizers/[tipo]Visualizer.js` com os métodos:
   - `render(state)` — renderiza o estado atual no DOM
   - `applyAnimation(action, state, prevState)` — anima a transição
   - `animateSolutionReveal(state)` — animação de "ver solução"
2. Adicione o `<script>` no `index.html` (antes de `uiManager.js`)
3. Registre no `uiManager.js` em `getVisualizer(type)`
4. Adicione o handler no `problemEngine.js` em `applyAction()`
5. Documente o `initialState` e os tipos de `action` no `CLAUDE.md`
6. Adicione o novo tipo à string de rótulo em `uiManager.js` → `getTypeLabel()`
7. Atualize `tests/problems.test.js` com validações do novo tipo

---

## Deploy e CI/CD

- **Produção:** https://logic-studies-app.web.app (Firebase Hosting, projeto `logic-studies-app`)
- **Deploy manual:** `firebase deploy --only hosting`
- **Deploy automático:** push para `main` → GitHub Actions testa → deploya

O workflow em `.github/workflows/deploy.yml` exige o secret `FIREBASE_SERVICE_ACCOUNT_LOGIC_STUDIES_APP` configurado no GitHub (Settings → Secrets → Actions).

**Regra:** nunca faça push direto para `main` sem passar pelos testes. O CI garante isso automaticamente, mas mantenha a disciplina localmente também.

---

## Decisões de Design Relevantes

### Por que Vanilla JS sem bundler?

O projeto é educativo e deve ser o mais simples possível de rodar (abrir `index.html` no browser). Bundlers adicionariam complexidade sem benefício real para o tamanho atual.

### Por que `structuredClone` em vez de `JSON.parse/stringify`?

`structuredClone` é nativo, mais rápido, suporta tipos não-JSON (Map, Set, Date) e tem melhor semântica. Disponível em Chrome 98+, Firefox 94+, Safari 15.4+, Node.js 17+.

### Por que Anime.js?

API de timeline fluida, `spring()` easing nativo, `stagger()` para animações em série. CDN com SRI hash para segurança. Todos os usos de Anime.js são guardados por `typeof anime === 'undefined'` para que o site funcione sem a lib em caso de falha de rede.

### Por que o `showSolution()` não dispara `onStepChange`?

Disparar callbacks por step durante o loop causava condições de corrida com as animações Anime.js e deixava a UI num estado inconsistente. A solução é avançar silenciosamente e disparar apenas `onStateChange` ao final.

### Por que `eliminated` no `initialState` de `order`?

O visualizador `listVisualizer.js` lê `state.eliminated` para renderizar as chips de candidatos com marcações visuais. Embora o engine inicialize defensivamente, declarar o campo no `initialState` deixa a estrutura de dados explícita e os testes mais rápidos.

---

## O que NÃO fazer

- Não adicione `export`/`import` nos arquivos source — quebrará o browser
- Não use `JSON.parse(JSON.stringify(...))` — use `structuredClone()`
- Não modifique `main` diretamente — use `develop` e faça merge
- Não salte steps de ação no engine para "economizar" — cada eliminação deve ser um step separado para o usuário acompanhar
- Não crie testes que dependem de implementação interna do engine (use apenas a API pública)
