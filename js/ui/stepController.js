/**
 * Logic Studies - Step Controller
 * Controls navigation between problem steps
 */

class StepController {
    constructor() {
        this.prevBtn = null;
        this.nextBtn = null;
        this.solutionBtn = null;
        this.resetBtn = null;
        this.stepCurrent = null;
        this.stepTotal = null;
        this.onStepChange = null;
    }

    /**
     * Initialize with DOM elements
     */
    init() {
        this.prevBtn       = document.getElementById('prevBtn');
        this.nextBtn       = document.getElementById('nextBtn');
        this.solutionBtn   = document.getElementById('solutionBtn');
        this.resetBtn      = document.getElementById('resetBtn');
        this.stepCurrent   = document.getElementById('stepCurrent');
        this.stepTotal     = document.getElementById('stepTotal');
        this.stepIndicator = document.getElementById('stepIndicator');

        this.bindEvents();
    }

    /**
     * Bind button event listeners
     */
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.handlePrev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.handleNext());
        }
        if (this.solutionBtn) {
            this.solutionBtn.addEventListener('click', () => this.handleShowSolution());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.handleReset());
        }
    }

    /**
     * Update step display
     */
    updateDisplay(current, total) {
        if (this.stepCurrent) this.stepCurrent.textContent = current;
        if (this.stepTotal)   this.stepTotal.textContent   = total;
        if (this.stepIndicator) {
            this.stepIndicator.setAttribute('aria-label', `Passo ${current} de ${total}`);
        }
        this.updateButtonStates(current, total);
    }

    /**
     * Update button enabled/disabled states
     */
    updateButtonStates(current, total) {
        // Prev button: disabled if at start
        if (this.prevBtn) {
            this.prevBtn.disabled = current === 0;
        }

        // Next button: disabled if at end
        if (this.nextBtn) {
            const isAtEnd = current >= total;
            this.nextBtn.disabled   = isAtEnd;
            this.nextBtn.textContent = isAtEnd ? 'Concluído ✓' : 'Próximo Passo →';
            this.nextBtn.setAttribute('aria-label', isAtEnd ? 'Problema concluído' : 'Próximo passo');
        }

        // Solution button: disabled if at end
        if (this.solutionBtn) {
            this.solutionBtn.disabled = current >= total;
        }
    }

    /**
     * Handle previous button click
     */
    handlePrev() {
        const result = problemEngine.prevStep();
        if (result.success && this.onStepChange) {
            this.onStepChange('prev', result.stepData);
        }
    }

    /**
     * Handle next button click
     */
    handleNext() {
        const result = problemEngine.nextStep();
        if (result.success && this.onStepChange) {
            this.onStepChange('next', result.stepData, result.isComplete);
        }
    }

    /**
     * Handle show solution button click
     */
    handleShowSolution() {
        problemEngine.showSolution();
        if (this.onStepChange) {
            this.onStepChange('solution', null, true);
        }
    }

    /**
     * Handle reset button click
     */
    handleReset() {
        problemEngine.reset();
        if (this.onStepChange) {
            this.onStepChange('reset', null, false);
        }
    }

    /**
     * Set callback for step changes
     */
    setOnStepChange(callback) {
        this.onStepChange = callback;
    }
}

// Create global instance
const stepController = new StepController();
