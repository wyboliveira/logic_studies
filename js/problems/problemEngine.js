/**
 * Logic Studies - Problem Engine
 * Manages problem state and step navigation
 */

class ProblemEngine {
    constructor() {
        this.currentProblem = null;
        this.currentStep = 0;
        this.state = null;
        this.history = [];
        this.onStateChange = null;
        this.onStepChange = null;
    }

    /**
     * Load a problem by ID
     */
    loadProblem(problemId) {
        const problem = PROBLEMS.find(p => p.id === problemId);
        if (!problem) {
            console.error(`Problem ${problemId} not found`);
            return false;
        }

        this.currentProblem = problem;
        this.currentStep = 0;
        this.history = [];
        
        // Deep clone the initial state
        this.state = JSON.parse(JSON.stringify(problem.initialState));
        
        return true;
    }

    /**
     * Get current problem
     */
    getProblem() {
        return this.currentProblem;
    }

    /**
     * Get current step (0-indexed)
     */
    getCurrentStep() {
        return this.currentStep;
    }

    /**
     * Get total steps
     */
    getTotalSteps() {
        return this.currentProblem ? this.currentProblem.steps.length : 0;
    }

    /**
     * Get current state
     */
    getState() {
        return this.state;
    }

    /**
     * Check if at first step
     */
    isAtStart() {
        return this.currentStep === 0;
    }

    /**
     * Check if at last step
     */
    isAtEnd() {
        return this.currentStep >= this.getTotalSteps();
    }

    /**
     * Get current step data
     */
    getCurrentStepData() {
        if (!this.currentProblem || this.currentStep === 0) {
            return null;
        }
        return this.currentProblem.steps[this.currentStep - 1];
    }

    /**
     * Advance to next step
     */
    nextStep() {
        if (this.isAtEnd()) {
            return { success: false, reason: 'already at end' };
        }

        // Save current state to history
        this.history.push(JSON.parse(JSON.stringify(this.state)));

        // Get step data
        const stepData = this.currentProblem.steps[this.currentStep];
        
        // Apply action to state
        this.applyAction(stepData.action);

        this.currentStep++;

        // Notify listeners
        if (this.onStepChange) {
            this.onStepChange(this.currentStep, stepData);
        }

        return { 
            success: true, 
            stepData: stepData,
            isComplete: this.isAtEnd()
        };
    }

    /**
     * Go back one step
     */
    prevStep() {
        if (this.isAtStart()) {
            return { success: false, reason: 'already at start' };
        }

        // Restore previous state
        if (this.history.length > 0) {
            this.state = this.history.pop();
        }

        this.currentStep--;

        // Notify listeners
        if (this.onStepChange) {
            const stepData = this.currentStep > 0 
                ? this.currentProblem.steps[this.currentStep - 1] 
                : null;
            this.onStepChange(this.currentStep, stepData);
        }

        return { 
            success: true,
            stepData: this.getCurrentStepData()
        };
    }

    /**
     * Jump to end (show complete solution)
     */
    showSolution() {
        while (!this.isAtEnd()) {
            this.nextStep();
        }
        return { success: true };
    }

    /**
     * Reset to beginning
     */
    reset() {
        this.currentStep = 0;
        this.history = [];
        this.state = JSON.parse(JSON.stringify(this.currentProblem.initialState));
        
        if (this.onStepChange) {
            this.onStepChange(0, null);
        }

        return { success: true };
    }

    /**
     * Apply an action to the current state
     */
    applyAction(action) {
        if (!action) return;

        const type = this.currentProblem.type;

        switch (type) {
            case 'table':
                this.applyTableAction(action);
                break;
            case 'sequence':
                this.applySequenceAction(action);
                break;
            case 'order':
                this.applyOrderAction(action);
                break;
        }

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }

    /**
     * Apply action to table state
     */
    applyTableAction(action) {
        switch (action.type) {
            case 'init':
                // State already initialized
                break;
            case 'confirm':
                this.state.cells[action.row][action.col] = '✓';
                // Mark cell as confirmed (for styling)
                if (!this.state.confirmed) this.state.confirmed = [];
                this.state.confirmed.push({ row: action.row, col: action.col });
                break;
            case 'eliminate':
                this.state.cells[action.row][action.col] = '✗';
                // Mark cell as eliminated (for styling)
                if (!this.state.eliminated) this.state.eliminated = [];
                this.state.eliminated.push({ row: action.row, col: action.col });
                break;
            case 'highlight':
                if (!this.state.highlighted) this.state.highlighted = [];
                this.state.highlighted.push({ row: action.row, col: action.col });
                break;
            case 'info':
                // Just informational, no state change
                if (!this.state.infos) this.state.infos = [];
                this.state.infos.push(action.text);
                break;
        }
    }

    /**
     * Apply action to sequence state
     */
    applySequenceAction(action) {
        switch (action.type) {
            case 'init':
                this.state.highlighted = [];
                break;
            case 'highlight':
                if (typeof action.index !== 'undefined') {
                    if (!this.state.highlighted) this.state.highlighted = [];
                    this.state.highlighted.push(action.index);
                } else if (action.indices) {
                    this.state.highlighted = action.indices;
                }
                break;
            case 'reveal':
                const lastIndex = this.state.numbers.length - 1;
                this.state.numbers[lastIndex] = action.value;
                this.state.revealed = true;
                break;
            case 'info':
                if (!this.state.infos) this.state.infos = [];
                this.state.infos.push(action.text);
                break;
        }
    }

    /**
     * Apply action to order state
     */
    applyOrderAction(action) {
        switch (action.type) {
            case 'init':
                // State already initialized
                break;
            case 'place':
                this.state.slots[action.position] = action.person;
                break;
            case 'eliminate':
                if (action.person && action.positions) {
                    action.positions.forEach(pos => {
                        if (!this.state.eliminated[action.person]) {
                            this.state.eliminated[action.person] = [];
                        }
                        this.state.eliminated[action.person].push(pos);
                    });
                }
                break;
            case 'info':
                if (!this.state.infos) this.state.infos = [];
                this.state.infos.push(action.text);
                break;
        }
    }

    /**
     * Get answer for current problem
     */
    getAnswer() {
        return this.currentProblem ? this.currentProblem.answer : null;
    }

    /**
     * Get summary for current problem
     */
    getSummary() {
        return this.currentProblem ? this.currentProblem.summary : null;
    }
}

// Create global instance
const problemEngine = new ProblemEngine();
