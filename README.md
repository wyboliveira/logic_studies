# Logic Studies

Plataforma educativa interativa para aprendizado de **Lógica e Raciocínio** voltada a concursos públicos e exames técnicos. O site apresenta 30 problemas com soluções animadas passo a passo, simulando o processo de raciocínio que o estudante precisa desenvolver.

**Site ao vivo:** [https://logic-studies-app.web.app](https://logic-studies-app.web.app)

---

## Propósito

Existe escassez de conteúdo organizado, lúdico e explicativo sobre lógica para concursos. Este projeto preenche essa lacuna com:

- **30 problemas** de múltiplos tipos (tabelas lógicas, sequências numéricas, ordenação)
- Solução guiada passo a passo com explicação de cada etapa
- Animações (Anime.js) que representam visualmente o raciocínio de eliminação e confirmação
- Níveis de dificuldade progressivos (fácil → médio → difícil)
- Progresso salvo localmente — checkmarks nos problemas concluídos
- Suíte de testes automatizados (Vitest) — 71 testes, todos validados

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
│   ├── components.css                # UI: cards, botões, tabelas, toasts, progresso
│   └── animations.css                # Keyframes: solution-flash, fade, slide
├── js/
│   ├── app.js                        # Orquestrador — inicialização e eventos globais
│   ├── problems/
│   │   ├── problemData.js            # Base de dados dos 30 problemas
│   │   └── problemEngine.js          # Engine de estado: carrega, avança e reverte steps
│   ├── ui/
│   │   ├── uiManager.js              # Renderização de telas, roteamento de visualizadores
│   │   ├── stepController.js         # Controle de botões e indicadores de passo
│   │   └── toast.js                  # Sistema de notificações (erro, sucesso, info)
│   ├── progress/
│   │   └── progressManager.js        # Persistência de progresso via localStorage
│   └── visualizers/
│       ├── tableVisualizer.js        # Renderer/animações de tabelas lógicas
│       ├── sequenceVisualizer.js     # Renderer/animações de sequências numéricas
│       └── listVisualizer.js         # Renderer/animações de problemas de ordenação
├── tests/
│   ├── engine.test.js                # 15 testes do ProblemEngine
│   ├── problems.test.js              # 56 testes de validação dos 30 problemas
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
                      UIManager  ◄────►  [table|sequence|list]Visualizer
                          │
                     progressManager  ──►  localStorage
```

1. O usuário seleciona um problema no card grid
2. `ProblemEngine.loadProblem(id)` inicializa o estado e o histórico
3. A cada `nextStep()`, a engine aplica a `action` ao estado e dispara `onStepChange`
4. `StepController` recebe o evento e atualiza explicações e indicadores de passo
5. O visualizador do tipo do problema aplica animações Anime.js no DOM
6. `prevStep()` restaura o estado do histórico (undo real, sem re-calcular)
7. Ao concluir o problema, `progressManager.markCompleted(id)` persiste no `localStorage`

---

## Problemas Disponíveis

### Tabelas Lógicas (18 problemas)

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

# Rodar todos os testes (71 testes)
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com relatório de cobertura HTML
npm run test:coverage
```

### Estrutura dos testes

- **`tests/engine.test.js`** — 15 testes do `ProblemEngine`: `loadProblem`, `nextStep`, `prevStep`, `reset`, `showSolution`, imutabilidade de estado
- **`tests/problems.test.js`** — 56 testes de dados: todos os 30 problemas carregam e resolvem sem erro; invariante de bijeção (exatamente 1 `✓` por linha e coluna) em todos os problemas de tabela; verificação do valor final em todos os problemas de sequência; verificação de slots em todos os problemas de ordenação

### Por que `vm` do Node.js?

Os arquivos source usam globals de browser (sem `export`). O helper `testContext.js` usa o módulo `vm` do Node.js para carregar os dois arquivos num mesmo sandbox, replicando o ambiente do browser:

```js
const vmCtx = vm.createContext({ structuredClone });
vm.runInContext(`(function(){ ${dataSrc}\n this.PROBLEMS = PROBLEMS; }).call(this)`, vmCtx);
vm.runInContext(`(function(){ ${engineSrc}\n this.ProblemEngine = ProblemEngine; }).call(this)`, vmCtx);
```

---

## Navegação por Teclado

| Tecla | Ação |
|-------|------|
| `→` ou `Space` | Próximo passo |
| `←` | Passo anterior |
| `Escape` | Voltar para o menu |
| `R` | Reiniciar o problema |

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
2. Roda `npm test` — se falhar, o deploy não acontece
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
- [x] **Fase 2** — Animações Anime.js: timelines, raciocínio visual (pulso de linha/coluna), candidatos flutuantes em ordenação
- [x] **Fase 3** — Persistência: progresso em `localStorage`, checkmarks nos cards, barra de progresso
- [x] **Fase 4** — Testes: Vitest, 71 testes, validação de todos os 30 problemas
- [x] **Fase 5** — Deploy: Firebase Hosting + GitHub Actions CI/CD
- [x] **Expansão** — 10 → 30 problemas (tabelas 3×3/4×4/5×5, sequências, ordenação)

### Próximas fases

- [ ] **Fase 6** — Qualidade e acessibilidade: `aria-live`, `aria-label`, `:focus-visible`, registry de visualizadores
- [ ] **Expansão** — Novos tipos de problema: Proposições Lógicas, Diagramas de Venn, Verdadeiro/Falso
- [ ] **Expansão** — Aumentar para 40+ problemas com os novos tipos
- [ ] **UX** — Filtro por tipo e dificuldade na tela inicial, tempo de resolução, dicas progressivas

---

## Contribuindo

Este projeto é desenvolvido como estudo pessoal. Issues e sugestões são bem-vindos.

---

## Licença

MIT
