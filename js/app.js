/**
 * Logic Studies - Main Application
 * Entry point and integration layer
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    uiManager.init();
    stepController.init();

    // Render problem cards
    uiManager.renderProblemCards(PROBLEMS, handleProblemSelect);

    // Set up step change callback
    stepController.setOnStepChange(handleStepChange);
});

/**
 * Handle problem selection
 */
function handleProblemSelect(problemId) {
    // Load problem
    const loaded = problemEngine.loadProblem(problemId);
    if (!loaded) {
        console.error('Failed to load problem');
        return;
    }

    const problem = problemEngine.getProblem();
    const state = problemEngine.getState();

    // Switch to problem screen
    uiManager.showProblemScreen();

    // Display problem details
    uiManager.displayProblem(problem);

    // Render initial visualization
    uiManager.renderVisualization(problem.type, state);

    // Update step display
    stepController.updateDisplay(0, problemEngine.getTotalSteps());
}

/**
 * Handle step change (from step controller)
 */
function handleStepChange(action, stepData, isComplete) {
    const problem = problemEngine.getProblem();
    const state = problemEngine.getState();
    const currentStep = problemEngine.getCurrentStep();
    const totalSteps = problemEngine.getTotalSteps();

    // Update step display
    stepController.updateDisplay(currentStep, totalSteps);

    // Re-render visualization
    uiManager.renderVisualization(problem.type, state);

    // Apply animation if going forward
    if (action === 'next' && stepData && stepData.action) {
        setTimeout(() => {
            uiManager.applyVisualizationAnimation(problem.type, stepData.action, state);
        }, 100);
    }

    // Update explanation
    if (action === 'reset') {
        uiManager.updateExplanation(null);
        uiManager.hideSummary();
    } else if (action === 'solution') {
        // Show final step explanation and summary
        const lastStep = problem.steps[totalSteps - 1];
        uiManager.updateExplanation(lastStep);
        uiManager.showSummary(problemEngine.getAnswer(), problemEngine.getSummary());
    } else if (stepData) {
        uiManager.updateExplanation(stepData);
    }

    // Show summary if complete
    if (isComplete && action !== 'solution') {
        uiManager.showSummary(problemEngine.getAnswer(), problemEngine.getSummary());
    }
}

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Only if on problem screen
    const problemScreen = document.getElementById('problem-screen');
    if (!problemScreen || !problemScreen.classList.contains('active')) {
        return;
    }

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
    }
});
