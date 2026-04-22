/**
 * Logic Studies - UI Manager
 * Manages UI updates and screen transitions
 */

class UIManager {
    constructor() {
        this.screens = { list: null, problem: null };
        this.elements = {};
        this._problems = null;
        this._onSelect = null;
        this._visualizers = {};
        // Filter state
        this._filterType = 'all';
        this._filterDiff = 'all';
        // Hint state: 0=hidden, 1=explanation shown, 2=tip shown
        this._hintLevel = 0;
        this._currentStepData = null;
    }

    init() {
        this.screens.list = document.getElementById('problem-list-screen');
        this.screens.problem = document.getElementById('problem-screen');

        this.elements = {
            problemCards:      document.getElementById('problemCards'),
            progressSummary:   document.getElementById('progressSummary'),
            filterBar:         document.getElementById('filterBar'),
            problemTitle:      document.getElementById('problemTitle'),
            problemStatement:  document.getElementById('problemStatement'),
            difficultyBadge:   document.getElementById('difficultyBadge'),
            visualizationArea: document.getElementById('visualizationArea'),
            instruction:       document.getElementById('instruction'),
            explanation:       document.getElementById('explanation'),
            tip:               document.getElementById('tip'),
            hintBtn:           document.getElementById('hintBtn'),
            summaryContainer:  document.getElementById('summaryContainer'),
            answerText:        document.getElementById('answerText'),
            reasoningText:     document.getElementById('reasoningText'),
            backBtn:           document.getElementById('backBtn')
        };

        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', () => this.showListScreen());
        }
        if (this.elements.hintBtn) {
            this.elements.hintBtn.addEventListener('click', () => this._revealNextHint());
        }

        this._visualizers = {
            table:       tableVisualizer,
            sequence:    sequenceVisualizer,
            order:       listVisualizer,
            proposition: propositionVisualizer,
            venn:        vennVisualizer,
            truthfalse:  truthVisualizer,
        };
    }

    registerVisualizer(type, visualizer) {
        this._visualizers[type] = visualizer;
    }

    // ── Filters ────────────────────────────────────────────────────────────────

    renderFilterBar(problems) {
        const bar = this.elements.filterBar;
        if (!bar) return;

        const types = ['all', ...new Set(problems.map(p => p.type))];
        const diffs = ['all', 'fácil', 'médio', 'difícil'];

        const typeLabel = t => t === 'all' ? 'Todos os tipos' : this.getTypeLabel(t);
        const diffLabel = d => d === 'all' ? 'Todas' : d.charAt(0).toUpperCase() + d.slice(1);

        bar.innerHTML = `
            <div class="filter-row" role="group" aria-label="Filtrar por tipo">
                ${types.map(t => `
                    <button class="filter-chip${this._filterType === t ? ' active' : ''}"
                            data-filter-type="${t}"
                            aria-pressed="${this._filterType === t}">
                        ${typeLabel(t)}
                    </button>`).join('')}
            </div>
            <div class="filter-row" role="group" aria-label="Filtrar por dificuldade">
                ${diffs.map(d => `
                    <button class="filter-chip${this._filterDiff === d ? ' active' : ''}"
                            data-filter-diff="${d}"
                            aria-pressed="${this._filterDiff === d}">
                        ${diffLabel(d)}
                    </button>`).join('')}
            </div>
        `;

        bar.querySelectorAll('[data-filter-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                this._filterType = btn.dataset.filterType;
                this._applyFilters();
            });
        });
        bar.querySelectorAll('[data-filter-diff]').forEach(btn => {
            btn.addEventListener('click', () => {
                this._filterDiff = btn.dataset.filterDiff;
                this._applyFilters();
            });
        });
    }

    _applyFilters() {
        if (!this._problems) return;
        const filtered = this._problems.filter(p =>
            (this._filterType === 'all' || p.type === this._filterType) &&
            (this._filterDiff === 'all' || p.difficulty === this._filterDiff)
        );
        this.renderFilterBar(this._problems);
        this._renderCards(filtered);
        this._updateFilterCount(filtered.length, this._problems.length);
    }

    _updateFilterCount(shown, total) {
        const el = document.getElementById('filterCount');
        if (!el) return;
        el.textContent = shown === total ? '' : `${shown} de ${total} problemas`;
    }

    // ── Screens ────────────────────────────────────────────────────────────────

    showListScreen() {
        this.screens.list.classList.add('active');
        this.screens.problem.classList.remove('active');
        if (this._problems && this._onSelect) {
            this.renderProblemCards(this._problems, this._onSelect);
        }
    }

    showProblemScreen() {
        this.screens.list.classList.remove('active');
        this.screens.problem.classList.add('active');
    }

    renderProblemCards(problems, onSelect) {
        if (!this.elements.problemCards) return;
        this._problems = problems;
        this._onSelect = onSelect;
        this.renderFilterBar(problems);
        this._renderCards(problems);
        this.updateProgressSummary(problems.length);
    }

    _renderCards(problems) {
        if (!this.elements.problemCards) return;
        const completedIds = progressManager.getCompletedIds();

        if (problems.length === 0) {
            this.elements.problemCards.innerHTML =
                '<p class="filter-empty">Nenhum problema corresponde aos filtros selecionados.</p>';
            return;
        }

        let html = '';
        problems.forEach(problem => {
            const difficultyClass = this.getDifficultyClass(problem.difficulty);
            const isCompleted     = completedIds.includes(problem.id);
            const stepsLabel      = isCompleted ? 'Concluído' : `${problem.steps.length} passos`;
            const ariaLabel       = `${problem.title} — ${this.getTypeLabel(problem.type)}, ${problem.difficulty}. ${stepsLabel}.`;

            html += `
                <div class="problem-card${isCompleted ? ' completed' : ''}"
                     data-problem-id="${problem.id}"
                     role="listitem">
                  <button class="problem-card-btn"
                          aria-label="${ariaLabel}"
                          data-problem-id="${problem.id}">
                    <div class="problem-card-header">
                        <div class="problem-card-icon" aria-hidden="true">${problem.icon}</div>
                        <div>
                            <div class="problem-card-title">${problem.title}</div>
                            <div class="problem-card-type">${this.getTypeLabel(problem.type)}</div>
                        </div>
                    </div>
                    <div class="problem-card-description">${problem.description}</div>
                    <div class="problem-card-footer">
                        <span class="difficulty-badge ${difficultyClass}" aria-hidden="true">${problem.difficulty}</span>
                        ${isCompleted
                            ? '<span class="completed-indicator" aria-hidden="true">✓ Concluído</span>'
                            : `<span class="problem-card-steps" aria-hidden="true">${problem.steps.length} passos</span>`
                        }
                    </div>
                  </button>
                </div>
            `;
        });

        this.elements.problemCards.innerHTML = html;

        this.elements.problemCards.querySelectorAll('.problem-card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const problemId = parseInt(btn.dataset.problemId);
                if (this._onSelect) this._onSelect(problemId);
            });
        });
    }

    updateProgressSummary(total) {
        const el = this.elements.progressSummary;
        if (!el) return;

        const count = progressManager.getCount();

        if (count === 0) {
            el.innerHTML = '';
            return;
        }

        const pct = Math.round((count / total) * 100);

        if (count === total) {
            el.innerHTML = `
                <div class="progress-all-done">
                    🎉 Todos os ${total} problemas concluídos!
                </div>
            `;
        } else {
            el.innerHTML = `
                <div class="progress-info">
                    <span class="progress-text">${count} de ${total} concluídos</span>
                    <div class="progress-bar" role="progressbar" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${total}">
                        <div class="progress-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }

        if (typeof anime !== 'undefined') {
            anime({ targets: el, opacity: [0, 1], translateY: [-6, 0], duration: 400, easing: 'easeOutQuart' });
        }
    }

    getDifficultyClass(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'fácil':   return 'easy';
            case 'médio':   return 'medium';
            case 'difícil': return 'hard';
            default:        return 'easy';
        }
    }

    getTypeLabel(type) {
        switch (type) {
            case 'table':       return 'Tabela Lógica';
            case 'sequence':    return 'Sequência';
            case 'order':       return 'Ordem/Posição';
            case 'proposition': return 'Proposição Lógica';
            case 'venn':        return 'Diagrama de Venn';
            case 'truthfalse':  return 'Verdadeiro/Falso';
            default:            return type;
        }
    }

    displayProblem(problem) {
        if (this.elements.problemTitle) {
            this.elements.problemTitle.textContent = problem.title;
        }
        if (this.elements.problemStatement) {
            this.elements.problemStatement.innerHTML = problem.statement;
        }
        if (this.elements.difficultyBadge) {
            this.elements.difficultyBadge.textContent = problem.difficulty;
            this.elements.difficultyBadge.className = `difficulty-badge ${this.getDifficultyClass(problem.difficulty)}`;
        }
        this.hideSummary();
        this.updateExplanation(null);
    }

    updateExplanation(stepData, { revealAll = false } = {}) {
        this._hintLevel = revealAll ? 2 : 0;
        this._currentStepData = stepData;

        if (!stepData) {
            if (this.elements.instruction) {
                this.elements.instruction.textContent = "Clique em 'Próximo Passo' para começar!";
            }
            if (this.elements.explanation) {
                this.elements.explanation.textContent = "";
                this.elements.explanation.classList.remove('visible');
            }
            if (this.elements.tip) {
                this.elements.tip.textContent = "";
                this.elements.tip.classList.remove('visible');
            }
            this._updateHintBtn();
            return;
        }

        if (this.elements.instruction) {
            this.elements.instruction.textContent = stepData.instruction || "";
            this.elements.instruction.classList.add('explanation-animate');
            setTimeout(() => this.elements.instruction.classList.remove('explanation-animate'), 400);
        }

        if (this.elements.explanation) {
            if (revealAll || this._hintLevel >= 1) {
                this.elements.explanation.textContent = stepData.explanation || "";
                this.elements.explanation.classList.toggle('visible', !!stepData.explanation);
            } else {
                this.elements.explanation.textContent = "";
                this.elements.explanation.classList.remove('visible');
            }
        }

        if (this.elements.tip) {
            if ((revealAll || this._hintLevel >= 2) && stepData.tip) {
                this.elements.tip.textContent = "💡 " + stepData.tip;
                this.elements.tip.classList.add('visible');
            } else {
                this.elements.tip.textContent = "";
                this.elements.tip.classList.remove('visible');
            }
        }

        this._updateHintBtn();
    }

    _revealNextHint() {
        if (!this._currentStepData) return;
        const sd = this._currentStepData;
        if (this._hintLevel === 0 && sd.explanation) {
            this._hintLevel = 1;
            if (this.elements.explanation) {
                this.elements.explanation.textContent = sd.explanation;
                this.elements.explanation.classList.add('visible', 'explanation-animate');
                setTimeout(() => this.elements.explanation.classList.remove('explanation-animate'), 400);
            }
        } else if (this._hintLevel <= 1 && sd.tip) {
            this._hintLevel = 2;
            if (this.elements.tip) {
                this.elements.tip.textContent = "💡 " + sd.tip;
                this.elements.tip.classList.add('visible', 'tip-animate');
                setTimeout(() => this.elements.tip.classList.remove('tip-animate'), 400);
            }
        }
        this._updateHintBtn();
    }

    _updateHintBtn() {
        const btn = this.elements.hintBtn;
        if (!btn) return;
        const sd = this._currentStepData;
        if (!sd) { btn.disabled = true; btn.textContent = '💡 Ver Dica'; return; }

        const hasExpl  = !!sd.explanation;
        const hasTip   = !!sd.tip;
        const maxLevel = hasExpl && hasTip ? 2 : hasExpl || hasTip ? 1 : 0;

        btn.disabled = (this._hintLevel >= maxLevel) || maxLevel === 0;

        if (this._hintLevel === 0 && hasExpl) btn.textContent = '💡 Ver Dica';
        else if (this._hintLevel === 1 && hasTip) btn.textContent = '💡 Mais uma dica';
        else btn.textContent = '💡 Ver Dica';
    }

    showSummary(answer, reasoning) {
        if (this.elements.summaryContainer) {
            this.elements.summaryContainer.classList.remove('hidden');
            this.elements.summaryContainer.classList.add('summary-animate');
        }
        if (this.elements.answerText)    this.elements.answerText.textContent    = answer;
        if (this.elements.reasoningText) this.elements.reasoningText.textContent = reasoning;
    }

    hideSummary() {
        if (this.elements.summaryContainer) {
            this.elements.summaryContainer.classList.add('hidden');
            this.elements.summaryContainer.classList.remove('summary-animate');
        }
    }

    getVisualizer(type) {
        return this._visualizers[type] ?? null;
    }

    renderVisualization(type, state) {
        const visualizer = this.getVisualizer(type);
        if (visualizer) visualizer.render(state);
    }

    applyVisualizationAnimation(type, action, state, prevState) {
        const visualizer = this.getVisualizer(type);
        if (visualizer?.applyAnimation) {
            visualizer.applyAnimation(action, state, prevState);
        }
    }

    animateSolutionReveal(type, state) {
        const area = this.elements.visualizationArea;
        if (area) {
            area.classList.add('solution-flash');
            area.addEventListener('animationend', () => area.classList.remove('solution-flash'), { once: true });
        }

        const visualizer = this.getVisualizer(type);
        if (visualizer?.animateSolutionReveal) {
            setTimeout(() => visualizer.animateSolutionReveal(state), 450);
        }
    }
}

const uiManager = new UIManager();
