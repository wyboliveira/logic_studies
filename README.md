# Logic Studies

Plataforma educativa interativa para aprendizado de **Lógica e Raciocínio** voltada a concursos públicos e exames técnicos. O site apresenta 40 problemas com soluções animadas passo a passo, simulando o processo de raciocínio que o estudante precisa desenvolver.

**Site ao vivo:** [https://logic-studies-app.web.app](https://logic-studies-app.web.app)

---

## Propósito

Existe escassez de conteúdo organizado, lúdico e explicativo sobre lógica para concursos. Este projeto preenche essa lacuna com:

- **40 problemas** cobrindo 6 tipos: tabelas lógicas, sequências, ordenação, proposições lógicas, diagramas de Venn e verdadeiro/falso
- Solução guiada passo a passo com explicação de cada etapa
- **Dicas progressivas** — a explicação e a dica de cada passo são reveladas sob demanda, encorajando o raciocínio independente antes de pedir ajuda
- **Filtros** por tipo e dificuldade na tela inicial
- Animações (Anime.js) que representam visualmente o raciocínio de eliminação e confirmação
- Níveis de dificuldade progressivos (fácil → médio → difícil)
- Progresso salvo localmente — checkmarks nos problemas concluídos
- **Modal de dúvidas** — botão "Dúvidas?" abre formulário com título, mensagem e suporte a anexos
- Acessibilidade: `aria-live`, `aria-label`, `:focus-visible`, suporte a teclado completo
- Suíte de testes automatizados (Vitest) — **108 testes**, todos validados

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | Vanilla JavaScript (ES6+, globals de browser) |
| Estilo | CSS3 com Custom Properties |
| Fonte | Google Fonts — Inter |
| Animações | [Anime.js v3.2.2](https://animejs.com/) via CDN |
| Testes | [Vitest](https://vitest.dev/) + Node.js `vm` para sandbox de browser globals |
| Deploy | [Firebase Hosting](https://firebase.google.com/products/hosting) |
| CI/CD | GitHub Actions (testa → deploya em push para `main`) |
| Build | Nenhum — site estático puro |

---

## Estrutura do Projeto

```
logic_studies/
├── index.html                        # Entrada da aplicação + containers de tela
├── css/
│   ├── main.css                      # Design system (tokens, reset, tipografia)
│   ├── components.css                # UI: cards, filtros, botões, modais, visualizadores
│   └── animations.css                # Keyframes: solution-flash, fade, slide
├── js/
│   ├── app.js                        # Orquestrador — inicialização e eventos globais
│   ├── problems/
│   │   ├── problemData.js            # Base de dados dos 40 problemas
│   │   └── problemEngine.js          # Engine de estado: carrega, avança e reverte steps
│   ├── ui/
│   │   ├── uiManager.js              # Telas, filtros, dicas progressivas, visualizadores
│   │   ├── stepController.js         # Controle de botões e indicadores de passo
│   │   ├── feedbackModal.js          # Modal "Envie Sua Dúvida" com suporte a anexos
│   │   └── toast.js                  # Sistema de notificações (erro, sucesso, info)
│   ├── progress/
│   │   └── progressManager.js        # Persistência de progresso via localStorage
│   └── visualizers/
│       ├── tableVisualizer.js        # Renderer/animações de tabelas lógicas
│       ├── sequenceVisualizer.js     # Renderer/animações de sequências numéricas
│       ├── listVisualizer.js         # Renderer/animações de problemas de ordenação
│       ├── propositionVisualizer.js  # Renderer/animações de proposições lógicas
│       ├── vennVisualizer.js         # Renderer/animações de diagramas de Venn
│       └── truthVisualizer.js        # Renderer/animações de verdadeiro/falso
├── tests/
│   ├── engine.test.js                # 15 testes do ProblemEngine
│   ├── problems.test.js              # 84 testes de validação dos 40 problemas
│   ├── progressManager.test.js       # 9 testes de persistência (localStorage mock)
│   └── helpers/
│       └── testContext.js            # Sandbox vm para carregar globals de browser no Node
├── firebase.json                     # Configuração do Firebase Hosting
├── .firebaserc                       # Alias de projeto Firebase
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions: test → deploy
├── package.json                      # Dependências de desenvolvimento (Vitest)
└── vitest.config.js                  # Configuração do Vitest
```

---

## Fluxo de Dados

```
problemData.js  ──►  ProblemEngine  ──►  StepController
                          │                    │
                     onStepChange         onStateChange
                          ▼                    ▼
                      UIManager  ◄────►  [table|sequence|list|proposition|venn|truth]Visualizer
                          │
                     progressManager  ──►  localStorage
```

1. O usuário filtra e seleciona um problema no card grid
2. `ProblemEngine.loadProblem(id)` inicializa o estado e o histórico
3. A cada `nextStep()`, a engine aplica a `action` ao estado e dispara `onStepChange`
4. `UIManager` mostra apenas a instrução do passo — o usuário clica em "Ver Dica" para revelar progressivamente a explicação e a dica
5. O visualizador do tipo do problema aplica animações Anime.js no DOM
6. `prevStep()` restaura o estado do histórico (undo real, sem re-calcular)
7. Ao concluir o problema, `progressManager.markCompleted(id)` persiste no `localStorage`

---

## Problemas Disponíveis

### Tabelas Lógicas (16 problemas)

| # | Título | Tamanho | Dificuldade |
|---|--------|---------|-------------|
| 1 | Quem ocupa cada cargo? | 3×3 | Fácil |
| 4 | Moradores e apartamentos | 3×3 | Médio |
| 6 | Frutas e cores | 3×3 | Fácil |
| 7 | Esportes da semana | 3×3 | Fácil |
| 8 | Amigos e profissões | 4×4 | Médio |
| 10 | O jantar dos cinco amigos | 5×5 | Difícil |
| 11 | Quem tem qual animal? | 3×3 | Fácil |
| 13 | Quando cada um estuda? | 3×3 | Fácil |
| 16 | Funcionários e departamentos | 4×4 | Médio |
| 18 | Como cada um vai ao trabalho? | 3×3 | Fácil |
| 20 | Quem fala qual idioma? | 4×4 | Médio |
| 22 | Qual cor cada um usa? | 3×3 | Fácil |
| 24 | Servidores e seus cargos | 5×5 | Difícil |
| 26 | Destinos de viagem | 4×4 | Médio |
| 28 | Flores e suas cores | 3×3 | Fácil |
| 30 | Professores e suas disciplinas | 5×5 | Difícil |

### Sequências Numéricas (9 problemas)

| # | Título | Padrão | Dificuldade |
|---|--------|--------|-------------|
| 2 | Complete a sequência | PG ×2 | Fácil |
| 5 | Sequência alternada | Dois intercalados | Médio |
| 9 | Sequência de Fibonacci | Soma dos dois anteriores | Médio |
| 12 | Sequência dos quadrados | n² | Fácil |
| 14 | Progressão aritmética | PA r=3 | Fácil |
| 17 | Diferença que cresce | 2ª ordem | Médio |
| 21 | Números triangulares | n(n+1)/2 | Médio |
| 25 | Progressão geométrica | PG r=3 | Fácil |
| 29 | Tabuada do 7 como sequência | PA r=7 | Fácil |

### Ordenação / Posição (5 problemas)

| # | Título | Pessoas | Dificuldade |
|---|--------|---------|-------------|
| 3 | Quem está em qual posição? | 4 | Médio |
| 15 | Fila do banco | 4 | Médio |
| 19 | Chegada na prova de natação | 5 | Médio |
| 23 | Ordem das entrevistas | 4 | Médio |
| 27 | Corrida de bicicleta | 5 | Difícil |

### Proposições Lógicas (4 problemas) — novo

| # | Título | Conceito | Dificuldade |
|---|--------|----------|-------------|
| 31 | Modus Ponens | Se P→Q e P, então Q | Fácil |
| 32 | Modus Tollens | Se P→Q e ¬Q, então ¬P | Médio |
| 33 | Silogismo Hipotético | P→Q, Q→R, logo P→R | Médio |
| 34 | Falácia do Consequente | Afirmar Q não implica P | Difícil |

### Diagramas de Venn (3 problemas) — novo

| # | Título | Conceito | Dificuldade |
|---|--------|----------|-------------|
| 35 | Esportes na turma | Inclusão-exclusão básica | Fácil |
| 36 | Idiomas no curso | Isolando a interseção | Médio |
| 37 | Aprovação em provas | Exclusiva de cada conjunto | Médio |

### Verdadeiro / Falso (3 problemas) — novo

| # | Título | Restrição | Dificuldade |
|---|--------|-----------|-------------|
| 38 | Ana e Beto mentem? | Exatamente 1 mentiroso | Fácil |
| 39 | Três Suspeitos | Exatamente 1 verdadeiro | Médio |
| 40 | Quem roubou o troféu? | Exatamente 2 verdadeiros | Médio |

---

## Funcionalidades de UX

### Filtros na tela inicial

Dois grupos de chips acima dos cards permitem filtrar a lista simultaneamente por **tipo** e **dificuldade**. Os filtros são cumulativos (AND) e um contador indica quantos problemas estão visíveis.

### Dicas progressivas

Cada passo exibe apenas a instrução por padrão. O botão **"💡 Ver Dica"** na área de explicação:
- Primeiro clique → revela a explicação detalhada
- Segundo clique → revela a dica adicional (quando existe)
- Desabilitado quando todas as dicas já foram exibidas
- Atalho de teclado: `H`

Ao usar "Ver Solução Completa", todas as dicas do último passo são exibidas de uma vez.

### Modal de dúvidas

O botão flutuante **"✉️ Dúvidas?"** (canto inferior direito) abre um modal com:
- Campo de título e campo de descrição
- Zona de drop de arquivos (imagens, PDF) com lista de arquivos e botão de remoção
- Estado de carregamento durante o envio
- Tela de confirmação "Mensagem enviada com sucesso!"
- Fecha com Cancelar, botão ×, ou Escape

---

## Navegação por Teclado

| Tecla | Ação |
|-------|------|
| `→` ou `Space` | Próximo passo |
| `←` | Passo anterior |
| `H` | Revelar próxima dica |
| `R` | Reiniciar o problema |
| `Escape` | Voltar para o menu / fechar modal |

---

## Como Rodar Localmente

O projeto não tem build step — basta servir os arquivos estáticos:

```bash
# Com Node.js (npx sem instalar nada)
npx serve .

# Com Python
python -m http.server 8080

# Com VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

Acesse `http://localhost:3000` (ou a porta que o servidor indicar).

---

## Testes

```bash
# Instalar dependências de desenvolvimento
npm install

# Rodar todos os testes (108 testes)
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com relatório de cobertura HTML
npm run test:coverage
```

### Cobertura dos testes

| Arquivo | Testes | O que valida |
|---------|--------|-------------|
| `engine.test.js` | 15 | `loadProblem`, `nextStep`, `prevStep`, `reset`, `showSolution`, imutabilidade de estado |
| `problems.test.js` | 84 | Todos os 40 problemas carregam e resolvem; bijeção em tabelas; valor final em sequências; slots preenchidos em ordenação; conclusão válida em proposições; regiões preenchidas em Venn; papéis revelados em verdadeiro/falso |
| `progressManager.test.js` | 9 | Estado inicial, `markCompleted`, deduplicação, múltiplos IDs, `reset`, isolamento entre instâncias |

### Por que `vm` do Node.js?

Os arquivos source usam globals de browser (sem `export`). O helper `testContext.js` usa o módulo `vm` do Node.js para carregar os arquivos num mesmo sandbox, replicando o ambiente do browser:

```js
const vmCtx = vm.createContext({ structuredClone });
vm.runInContext(`(function(){ ${dataSrc}\n this.PROBLEMS = PROBLEMS; }).call(this)`, vmCtx);
vm.runInContext(`(function(){ ${engineSrc}\n this.ProblemEngine = ProblemEngine; }).call(this)`, vmCtx);
```

O mesmo padrão é usado nos testes do `progressManager`, injetando um mock de `localStorage` no contexto vm para isolamento total entre testes.

---

## Deploy

O site é hospedado no Firebase Hosting.

### Deploy manual

```bash
# Requer Firebase CLI instalado e login feito
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

### CI/CD automático

Qualquer push na branch `main` dispara o workflow `.github/workflows/deploy.yml`:

1. Instala dependências
2. Roda `npm test` (108 testes) — se falhar, o deploy não acontece
3. Faz deploy para `https://logic-studies-app.web.app`

**Pré-requisito:** o secret `FIREBASE_SERVICE_ACCOUNT_LOGIC_STUDIES_APP` deve estar configurado no repositório GitHub (Settings → Secrets → Actions). Veja [como gerar a chave de service account](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments).

---

## Branches

| Branch | Propósito |
|--------|-----------|
| `main` | Produção — deploya automaticamente |
| `develop` | Desenvolvimento ativo — PRs e commits diários |

---

## Roadmap

### Concluído

- [x] **Fase 1** — Correções críticas: `showSolution()`, error handling, `getState()` imutável com `structuredClone`
- [x] **Fase 2** — Animações Anime.js: timelines, raciocínio visual, candidatos flutuantes
- [x] **Fase 3** — Persistência: progresso em `localStorage`, checkmarks nos cards, barra de progresso
- [x] **Fase 4** — Testes: Vitest, 108 testes, validação de todos os problemas
- [x] **Fase 5** — Deploy: Firebase Hosting + GitHub Actions CI/CD
- [x] **Fase 6** — Acessibilidade: `aria-live`, `aria-label`, `:focus-visible`, registry de visualizadores, botões semânticos
- [x] **Expansão de tipos** — Proposições Lógicas, Diagramas de Venn, Verdadeiro/Falso
- [x] **Expansão de conteúdo** — 10 → 40 problemas
- [x] **UX** — Filtros por tipo e dificuldade, dicas progressivas, modal de dúvidas

### Próximas fases

- [ ] **Email** — Conectar modal de dúvidas ao EmailJS para envio real
- [ ] **Busca textual** — Filtrar problemas por palavra-chave no título/descrição
- [ ] **Modo estudo** — Agrupamento por tema (concursos específicos, bancas)
- [ ] **Estatísticas** — Percentual de conclusão por tipo e dificuldade

---

## Contribuindo

Este projeto é desenvolvido como estudo pessoal. Issues e sugestões são bem-vindos.

---

## Licença

MIT
