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
        // Visualizer registry — populated in init() after all globals are defined
        this._visualizers = {};
    }

    init() {
        this.screens.list = document.getElementById('problem-list-screen');
        this.screens.problem = document.getElementById('problem-screen');

        this.elements = {
            problemCards:      document.getElementById('problemCards'),
            progressSummary:   document.getElementById('progressSummary'),
            problemTitle:      document.getElementById('problemTitle'),
            problemStatement:  document.getElementById('problemStatement'),
            difficultyBadge:   document.getElementById('difficultyBadge'),
            visualizationArea: document.getElementById('visualizationArea'),
            instruction:       document.getElementById('instruction'),
            explanation:       document.getElementById('explanation'),
            tip:               document.getElementById('tip'),
            summaryContainer:  document.getElementById('summaryContainer'),
            answerText:        document.getElementById('answerText'),
            reasoningText:     document.getElementById('reasoningText'),
            backBtn:           document.getElementById('backBtn')
        };

        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', () => this.showListScreen());
        }

        this._visualizers = {
            table:    tableVisualizer,
            sequence: sequenceVisualizer,
            order:    listVisualizer,
        };
    }

    registerVisualizer(type, visualizer) {
        this._visualizers[type] = visualizer;
    }

    showListScreen() {
        this.screens.list.classList.add('active');
        this.screens.problem.classList.remove('active');
        // Re-render cards to reflect any newly completed problems
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

        const completedIds = progressManager.getCompletedIds();

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
                if (onSelect) onSelect(problemId);
            });
        });

        this.updateProgressSummary(problems.length);
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
            case 'table':    return 'Tabela Lógica';
            case 'sequence': return 'Sequência';
            case 'order':    return 'Ordem/Posição';
            default:         return type;
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
        this.updateExplanation({
            instruction: "Clique em 'Próximo Passo' para começar!",
            explanation: "",
            tip: null
        });
    }

    updateExplanation(stepData) {
        if (!stepData) {
            if (this.elements.instruction) {
                this.elements.instruction.textContent = "Clique em 'Próximo Passo' para começar!";
            }
            if (this.elements.explanation) {
                this.elements.explanation.textContent = "";
            }
            if (this.elements.tip) {
                this.elements.tip.textContent = "";
                this.elements.tip.classList.remove('visible');
            }
            return;
        }

        if (this.elements.instruction) {
            this.elements.instruction.textContent = stepData.instruction || "";
            this.elements.instruction.classList.add('explanation-animate');
            setTimeout(() => this.elements.instruction.classList.remove('explanation-animate'), 400);
        }

        if (this.elements.explanation) {
            this.elements.explanation.textContent = stepData.explanation || "";
        }

        if (this.elements.tip) {
            if (stepData.tip) {
                this.elements.tip.textContent = "💡 Dica: " + stepData.tip;
                this.elements.tip.classList.add('visible', 'tip-animate');
                setTimeout(() => this.elements.tip.classList.remove('tip-animate'), 400);
            } else {
                this.elements.tip.textContent = "";
                this.elements.tip.classList.remove('visible');
            }
        }
    }

    showSummary(answer, reasoning) {
        if (this.elements.summaryContainer) {
            this.elements.summaryContainer.classList.remove('hidden');
            this.elements.summaryContainer.classList.add('summary-animate');
        }
        if (this.elements.answerText) {
            this.elements.answerText.textContent = answer;
        }
        if (this.elements.reasoningText) {
            this.elements.reasoningText.textContent = reasoning;
        }
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
