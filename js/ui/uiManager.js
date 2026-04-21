/**
 * Logic Studies - UI Manager
 * Manages UI updates and screen transitions
 */

class UIManager {
    constructor() {
        this.screens = { list: null, problem: null };
        this.elements = {};
    }

    init() {
        this.screens.list = document.getElementById('problem-list-screen');
        this.screens.problem = document.getElementById('problem-screen');

        this.elements = {
            problemCards:      document.getElementById('problemCards'),
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
    }

    showListScreen() {
        this.screens.list.classList.add('active');
        this.screens.problem.classList.remove('active');
    }

    showProblemScreen() {
        this.screens.list.classList.remove('active');
        this.screens.problem.classList.add('active');
    }

    renderProblemCards(problems, onSelect) {
        if (!this.elements.problemCards) return;

        let html = '';
        problems.forEach(problem => {
            const difficultyClass = this.getDifficultyClass(problem.difficulty);
            html += `
                <div class="problem-card" data-problem-id="${problem.id}">
                    <div class="problem-card-header">
                        <div class="problem-card-icon">${problem.icon}</div>
                        <div>
                            <div class="problem-card-title">${problem.title}</div>
                            <div class="problem-card-type">${this.getTypeLabel(problem.type)}</div>
                        </div>
                    </div>
                    <div class="problem-card-description">${problem.description}</div>
                    <div class="problem-card-footer">
                        <span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span>
                        <span class="problem-card-steps">${problem.steps.length} passos</span>
                    </div>
                </div>
            `;
        });

        this.elements.problemCards.innerHTML = html;

        this.elements.problemCards.querySelectorAll('.problem-card').forEach(card => {
            card.addEventListener('click', () => {
                const problemId = parseInt(card.dataset.problemId);
                if (onSelect) onSelect(problemId);
            });
        });
    }

    getDifficultyClass(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'fácil':  return 'easy';
            case 'médio':  return 'medium';
            case 'difícil': return 'hard';
            default:       return 'easy';
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
        switch (type) {
            case 'table':    return tableVisualizer;
            case 'sequence': return sequenceVisualizer;
            case 'order':    return listVisualizer;
            default:         return null;
        }
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

    // Plays a fast-forward flash then a staggered reveal of the final state cells
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
