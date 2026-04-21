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

    loadProblem(problemId) {
        const problem = PROBLEMS.find(p => p.id === problemId);
        if (!problem) {
            throw new Error(`Problema ${problemId} não encontrado.`);
        }

        this.currentProblem = problem;
        this.currentStep = 0;
        this.history = [];
        this.state = structuredClone(problem.initialState);

        return true;
    }

    getProblem() {
        return this.currentProblem;
    }

    getCurrentStep() {
        return this.currentStep;
    }

    getTotalSteps() {
        return this.currentProblem ? this.currentProblem.steps.length : 0;
    }

    // Returns a deep clone — callers cannot corrupt internal state
    getState() {
        return structuredClone(this.state);
    }

    // Returns the state before the last step, or null at the beginning
    getPrevState() {
        if (this.history.length === 0) return null;
        return structuredClone(this.history[this.history.length - 1]);
    }

    isAtStart() {
        return this.currentStep === 0;
    }

    isAtEnd() {
        return this.currentStep >= this.getTotalSteps();
    }

    getCurrentStepData() {
        if (!this.currentProblem || this.currentStep === 0) {
            return null;
        }
        return this.currentProblem.steps[this.currentStep - 1];
    }

    nextStep() {
        if (this.isAtEnd()) {
            return { success: false, reason: 'already at end' };
        }

        this.history.push(structuredClone(this.state));

        const stepData = this.currentProblem.steps[this.currentStep];
        this.applyAction(stepData.action);
        this.currentStep++;

        if (this.onStepChange) {
            this.onStepChange(this.currentStep, stepData);
        }

        return {
            success: true,
            stepData: stepData,
            isComplete: this.isAtEnd()
        };
    }

    prevStep() {
        if (this.isAtStart()) {
            return { success: false, reason: 'already at start' };
        }

        if (this.history.length > 0) {
            this.state = this.history.pop();
        }

        this.currentStep--;

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

    // Advances all steps silently (no per-step callbacks) then fires one final notification
    showSolution() {
        while (!this.isAtEnd()) {
            this.history.push(structuredClone(this.state));
            const stepData = this.currentProblem.steps[this.currentStep];
            this.applyAction(stepData.action);
            this.currentStep++;
        }

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }

        return { success: true };
    }

    reset() {
        this.currentStep = 0;
        this.history = [];
        this.state = structuredClone(this.currentProblem.initialState);

        if (this.onStepChange) {
            this.onStepChange(0, null);
        }

        return { success: true };
    }

    applyAction(action) {
        if (!action) return;

        const type = this.currentProblem.type;

        switch (type) {
            case 'table':    this.applyTableAction(action);    break;
            case 'sequence': this.applySequenceAction(action); break;
            case 'order':    this.applyOrderAction(action);    break;
        }

        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }

    applyTableAction(action) {
        switch (action.type) {
            case 'init':
                break;
            case 'confirm':
                this.state.cells[action.row][action.col] = '✓';
                if (!this.state.confirmed) this.state.confirmed = [];
                this.state.confirmed.push({ row: action.row, col: action.col });
                break;
            case 'eliminate':
                this.state.cells[action.row][action.col] = '✗';
                if (!this.state.eliminated) this.state.eliminated = [];
                this.state.eliminated.push({ row: action.row, col: action.col });
                break;
            case 'highlight':
                if (!this.state.highlighted) this.state.highlighted = [];
                this.state.highlighted.push({ row: action.row, col: action.col });
                break;
            case 'info':
                if (!this.state.infos) this.state.infos = [];
                this.state.infos.push(action.text);
                break;
        }
    }

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

    applyOrderAction(action) {
        switch (action.type) {
            case 'init':
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

    getAnswer() {
        return this.currentProblem ? this.currentProblem.answer : null;
    }

    getSummary() {
        return this.currentProblem ? this.currentProblem.summary : null;
    }
}

const problemEngine = new ProblemEngine();
