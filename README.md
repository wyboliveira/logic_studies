# Logic Studies

Plataforma educativa interativa para aprendizado de **Lógica e Raciocínio** voltada a concursos públicos e exames técnicos. O site apresenta problemas com soluções animadas passo a passo, simulando o processo de raciocínio que o estudante precisa desenvolver.

> **Projeto em desenvolvimento ativo.** A arquitetura atual está sendo refatorada — veja o [roadmap](#roadmap) abaixo.

---

## Propósito

Existe escassez de conteúdo organizado, lúdico e explicativo sobre lógica para concursos. Este projeto preenche essa lacuna com:

- Problemas de múltiplos tipos (tabelas lógicas, sequências, ordenação)
- Solução guiada passo a passo com explicação de cada etapa
- Animações que representam o raciocínio visual que o estudante deve construir
- Níveis de dificuldade progressivos (fácil → difícil)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | Vanilla JavaScript (ES6+) |
| Estilo | CSS3 com Custom Properties |
| Fonte | Google Fonts — Inter |
| Animações | CSS Keyframes (migração para Anime.js planejada) |
| Testes | — (Vitest planejado) |
| Deploy | Firebase Hosting (planejado) |
| Build | Nenhum (site estático puro) |
| Dependências externas | Nenhuma |

---

## Estrutura do Projeto

```
logic_studies/
├── index.html                  # Entrada da aplicação
├── css/
│   ├── main.css                # Design system (tokens, reset, tipografia)
│   ├── components.css          # Componentes de UI (cards, botões, tabelas)
│   └── animations.css          # Keyframes e utilitários de animação
└── js/
    ├── app.js                  # Orquestrador — inicialização e eventos globais
    ├── problems/
    │   ├── problemData.js      # Base de dados dos 10 problemas
    │   └── problemEngine.js    # Engine de estado — carrega, avança e reverte steps
    ├── ui/
    │   ├── uiManager.js        # Renderização de telas e transições
    │   └── stepController.js   # Controle dos botões e indicadores de passo
    └── visualizers/
        ├── tableVisualizer.js  # Renderer de tabelas lógicas
        ├── sequenceVisualizer.js # Renderer de sequências numéricas
        └── listVisualizer.js   # Renderer de problemas de ordenação
```

### Fluxo de dados

```
problemData.js  →  ProblemEngine  →  StepController
                        ↓                  ↓
                   UIManager  ←→  [table|sequence|list]Visualizer
```

1. O usuário seleciona um problema no card grid
2. `ProblemEngine.loadProblem(id)` inicializa o estado e o histórico
3. A cada `nextStep()`, a engine aplica a action ao estado e dispara `onStepChange`
4. `StepController` recebe o evento e atualiza explicações e indicadores
5. O visualizador correspondente ao tipo do problema aplica as animações no DOM
6. `prevStep()` restaura o estado do histórico (undo real)

---

## Problemas Disponíveis

| # | Título | Tipo | Dificuldade | Steps |
|---|--------|------|-------------|-------|
| 1 | Quem ocupa cada cargo? | Tabela | Fácil | 10 |
| 2 | Qual é o próximo número? | Sequência | Fácil | 5 |
| 3 | Qual foi a ordem de chegada? | Ordenação | Médio | 8 |
| 4 | Quem mora em qual apartamento? | Tabela | Médio | 15 |
| 5 | Sequência Alternada | Sequência | Médio | 4 |
| 6 | Quem comprou qual fruta? | Tabela | Fácil | 10 |
| 7 | Quem pratica qual esporte? | Tabela | Fácil | 10 |
| 8 | Qual é a profissão de cada um? | Tabela | Médio | 16 |
| 9 | Sequência de Fibonacci | Sequência | Médio | 6 |
| 10 | Quem sentou onde no jantar? | Tabela | Difícil | 20 |

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

## Navegação por Teclado

| Tecla | Ação |
|-------|------|
| `→` ou `Space` | Próximo passo |
| `←` | Passo anterior |
| `Escape` | Voltar para o menu |
| `R` | Reiniciar o problema |

---

## Roadmap

O projeto está sendo desenvolvido em fases com apoio de IA (Claude). O objetivo é documentar como IA pode acelerar o aprendizado e a melhoria de projetos reais.

### Fase 1 — Correções Críticas
- [ ] Corrigir `showSolution()` para manter consistência visual
- [ ] Error handling visível ao usuário
- [ ] `getState()` retornando cópia imutável (substituir `JSON.parse/stringify` por `structuredClone`)

### Fase 2 — Animações Ricas
- [ ] Integrar Anime.js (timeline de animações por step)
- [ ] Animação de "movimento" para problemas de ordenação
- [ ] Indicadores visuais de raciocínio (setas, conexões, pulsos)

### Fase 3 — Persistência e Usabilidade
- [ ] Progresso salvo em `localStorage`
- [ ] Checkmarks nos cards de problemas concluídos
- [ ] Refatorar "Ver Solução" para modo preview não destrutivo
- [ ] Indicador de dificuldade visível dentro do problema

### Fase 4 — Testes
- [ ] Setup Vitest
- [ ] Testes unitários para todos os 10 problemas (validar estado final)
- [ ] Testes do ProblemEngine (nextStep, prevStep, reset, showSolution)

### Fase 5 — Deploy Firebase
- [ ] Configurar Firebase Hosting (`firebase.json`, `.firebaserc`)
- [ ] GitHub Actions para deploy automático no push para `main`

### Fase 6 — Qualidade e Acessibilidade
- [ ] Registry de visualizadores (eliminar if/else por tipo)
- [ ] `aria-live`, `aria-label`, `:focus-visible`
- [ ] Internacionalização básica (labels centralizados)

---

## Contribuindo

Este projeto é desenvolvido como estudo pessoal. Issues e sugestões são bem-vindos.

---

## Licença

MIT
