/**
 * Logic Studies - UI Manager
 * Manages UI updates and screen transitions
 */

class UIManager {
    constructor() {
        this.screens = {
            list: null,
            problem: null
        };
        this.elements = {};
    }

    /**
     * Initialize with DOM elements
     */
    init() {
        // Screens
        this.screens.list = document.getElementById('problem-list-screen');
        this.screens.problem = document.getElementById('problem-screen');

        // Elements
        this.elements = {
            problemCards: document.getElementById('problemCards'),
            problemTitle: document.getElementById('problemTitle'),
            problemStatement: document.getElementById('problemStatement'),
            difficultyBadge: document.getElementById('difficultyBadge'),
            visualizationArea: document.getElementById('visualizationArea'),
            instruction: document.getElementById('instruction'),
            explanation: document.getElementById('explanation'),
            tip: document.getElementById('tip'),
            summaryContainer: document.getElementById('summaryContainer'),
            answerText: document.getElementById('answerText'),
            reasoningText: document.getElementById('reasoningText'),
            backBtn: document.getElementById('backBtn')
        };

        // Bind back button
        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', () => this.showListScreen());
        }
    }

    /**
     * Show problem list screen
     */
    showListScreen() {
        this.screens.list.classList.add('active');
        this.screens.problem.classList.remove('active');
    }

    /**
     * Show problem solving screen
     */
    showProblemScreen() {
        this.screens.list.classList.remove('active');
        this.screens.problem.classList.add('active');
    }

    /**
     * Render problem cards
     */
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

        // Add click listeners
        const cards = this.elements.problemCards.querySelectorAll('.problem-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const problemId = parseInt(card.dataset.problemId);
                if (onSelect) onSelect(problemId);
            });
        });
    }

    /**
     * Get difficulty CSS class
     */
    getDifficultyClass(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'fácil': return 'easy';
            case 'médio': return 'medium';
            case 'difícil': return 'hard';
            default: return 'easy';
        }
    }

    /**
     * Get type label in Portuguese
     */
    getTypeLabel(type) {
        switch (type) {
            case 'table': return 'Tabela Lógica';
            case 'sequence': return 'Sequência';
            case 'order': return 'Ordem/Posição';
            default: return type;
        }
    }

    /**
     * Display problem details
     */
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

        // Hide summary
        this.hideSummary();

        // Reset explanation
        this.updateExplanation({
            instruction: "Clique em 'Próximo Passo' para começar!",
            explanation: "",
            tip: null
        });
    }

    /**
     * Update explanation area
     */
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
            setTimeout(() => {
                this.elements.instruction.classList.remove('explanation-animate');
            }, 400);
        }

        if (this.elements.explanation) {
            this.elements.explanation.textContent = stepData.explanation || "";
        }

        if (this.elements.tip) {
            if (stepData.tip) {
                this.elements.tip.textContent = "💡 Dica: " + stepData.tip;
                this.elements.tip.classList.add('visible');
                this.elements.tip.classList.add('tip-animate');
                setTimeout(() => {
                    this.elements.tip.classList.remove('tip-animate');
                }, 400);
            } else {
                this.elements.tip.textContent = "";
                this.elements.tip.classList.remove('visible');
            }
        }
    }

    /**
     * Show summary (problem solved)
     */
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

    /**
     * Hide summary
     */
    hideSummary() {
        if (this.elements.summaryContainer) {
            this.elements.summaryContainer.classList.add('hidden');
            this.elements.summaryContainer.classList.remove('summary-animate');
        }
    }

    /**
     * Get visualizer for problem type
     */
    getVisualizer(type) {
        switch (type) {
            case 'table': return tableVisualizer;
            case 'sequence': return sequenceVisualizer;
            case 'order': return listVisualizer;
            default: return null;
        }
    }

    /**
     * Render visualization
     */
    renderVisualization(type, state) {
        const visualizer = this.getVisualizer(type);
        if (visualizer) {
            visualizer.render(state);
        }
    }

    /**
     * Apply visualization animation
     */
    applyVisualizationAnimation(type, action, state) {
        const visualizer = this.getVisualizer(type);
        if (visualizer && visualizer.applyAnimation) {
            visualizer.applyAnimation(action, state);
        }
    }
}

// Create global instance
const uiManager = new UIManager();
