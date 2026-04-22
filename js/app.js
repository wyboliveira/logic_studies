/**
 * Logic Studies - Main Application
 * Entry point and integration layer
 */

document.addEventListener('DOMContentLoaded', () => {
    toast.init();
    uiManager.init();
    stepController.init();
    feedbackModal.init();

    uiManager.renderProblemCards(PROBLEMS, handleProblemSelect);
    stepController.setOnStepChange(handleStepChange);
});

function handleProblemSelect(problemId) {
    try {
        problemEngine.loadProblem(problemId);
    } catch (err) {
        toast.error('Não foi possível carregar o problema. Tente novamente.');
        console.error(err);
        return;
    }

    const problem = problemEngine.getProblem();
    const state   = problemEngine.getState();

    uiManager.showProblemScreen();
    uiManager.displayProblem(problem);
    uiManager.renderVisualization(problem.type, state);
    stepController.updateDisplay(0, problemEngine.getTotalSteps());
}

function handleStepChange(action, stepData, isComplete) {
    const problem     = problemEngine.getProblem();
    const state       = problemEngine.getState();
    const currentStep = problemEngine.getCurrentStep();
    const totalSteps  = problemEngine.getTotalSteps();

    stepController.updateDisplay(currentStep, totalSteps);
    uiManager.renderVisualization(problem.type, state);

    if (action === 'next' && stepData && stepData.action) {
        const prevState = problemEngine.getPrevState();
        setTimeout(() => {
            uiManager.applyVisualizationAnimation(problem.type, stepData.action, state, prevState);
        }, 100);
    }

    if (action === 'reset') {
        uiManager.updateExplanation(null);
        uiManager.hideSummary();
    } else if (action === 'solution') {
        const lastStep = problem.steps[totalSteps - 1];
        uiManager.updateExplanation(lastStep, { revealAll: true });
        uiManager.animateSolutionReveal(problem.type, state);
        uiManager.showSummary(problemEngine.getAnswer(), problemEngine.getSummary());
    } else if (stepData) {
        uiManager.updateExplanation(stepData);
    }

    if (isComplete && action !== 'solution') {
        uiManager.showSummary(problemEngine.getAnswer(), problemEngine.getSummary());
    }

    if (isComplete) {
        progressManager.markCompleted(problem.id);
    }
}

document.addEventListener('keydown', (e) => {
    const problemScreen = document.getElementById('problem-screen');
    if (!problemScreen || !problemScreen.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            document.getElementById('nextBtn')?.click();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            document.getElementById('prevBtn')?.click();
            break;
        case 'Escape':
            document.getElementById('backBtn')?.click();
            break;
        case 'r':
        case 'R':
            document.getElementById('resetBtn')?.click();
            break;
        case 'h':
        case 'H':
            document.getElementById('hintBtn')?.click();
            break;
    }
});
