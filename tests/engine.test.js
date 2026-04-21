/**
 * Tests for ProblemEngine — state management, step navigation, immutability
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createEngine, PROBLEMS } from './helpers/testContext.js';

// Use problem 1 (table, 10 steps) as a stable test subject
const PROBLEM_ID = 1;

describe('ProblemEngine — loadProblem', () => {
    it('loads a valid problem and resets state', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        expect(engine.getCurrentStep()).toBe(0);
        expect(engine.getTotalSteps()).toBe(PROBLEMS.find(p => p.id === PROBLEM_ID).steps.length);
        expect(engine.isAtStart()).toBe(true);
        expect(engine.isAtEnd()).toBe(false);
    });

    it('throws for an unknown problem ID', () => {
        const engine = createEngine();
        expect(() => engine.loadProblem(9999)).toThrow();
    });

    it('returns a clone from getState (mutation does not corrupt engine)', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        const state = engine.getState();
        state.cells[0][0] = 'CORRUPTED';

        // Internal state should be unchanged
        expect(engine.getState().cells[0][0]).toBe('?');
    });
});

describe('ProblemEngine — nextStep / prevStep', () => {
    let engine;

    beforeEach(() => {
        engine = createEngine();
        engine.loadProblem(PROBLEM_ID);
    });

    it('advances one step and returns stepData', () => {
        const result = engine.nextStep();

        expect(result.success).toBe(true);
        expect(engine.getCurrentStep()).toBe(1);
        expect(result.stepData).toBeDefined();
    });

    it('returns success:false at the end', () => {
        while (!engine.isAtEnd()) engine.nextStep();

        const result = engine.nextStep();
        expect(result.success).toBe(false);
        expect(result.reason).toBe('already at end');
    });

    it('prevStep restores state from history', () => {
        engine.nextStep(); // step 1 (init)
        engine.nextStep(); // step 2 (eliminate Ana-Advogado → cell[0][1] = ✗)

        const stateAfterStep2 = engine.getState();
        expect(stateAfterStep2.cells[0][1]).toBe('✗');

        engine.prevStep(); // back to step 1
        const restored = engine.getState();
        expect(restored.cells[0][1]).toBe('?');
    });

    it('prevStep returns success:false at the start', () => {
        const result = engine.prevStep();
        expect(result.success).toBe(false);
        expect(result.reason).toBe('already at start');
    });

    it('getPrevState returns the state before the last step', () => {
        engine.nextStep();
        const prev = engine.getPrevState();

        // Before step 1 (init), all cells are '?'
        expect(prev.cells[0][0]).toBe('?');
    });

    it('getPrevState returns null at the very beginning', () => {
        expect(engine.getPrevState()).toBeNull();
    });
});

describe('ProblemEngine — reset', () => {
    it('returns to step 0 with the original initial state', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        engine.nextStep();
        engine.nextStep();
        engine.reset();

        expect(engine.getCurrentStep()).toBe(0);
        expect(engine.isAtStart()).toBe(true);
        expect(engine.getState().cells[0][1]).toBe('?');
    });

    it('clears the history so prevStep is unavailable after reset', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        engine.nextStep();
        engine.reset();

        expect(engine.prevStep().success).toBe(false);
    });
});

describe('ProblemEngine — showSolution', () => {
    it('advances to the last step in one call', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        engine.showSolution();

        expect(engine.isAtEnd()).toBe(true);
        expect(engine.getCurrentStep()).toBe(engine.getTotalSteps());
    });

    it('populates history so prevStep works after showSolution', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        engine.showSolution();

        const result = engine.prevStep();
        expect(result.success).toBe(true);
        expect(engine.getCurrentStep()).toBe(engine.getTotalSteps() - 1);
    });

    it('does NOT fire onStepChange on intermediate steps', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        let callCount = 0;
        engine.onStepChange = () => { callCount++; };

        engine.showSolution();

        // showSolution fires onStateChange once at the end, but onStepChange
        // should remain silent during the loop
        expect(callCount).toBe(0);
    });
});

describe('ProblemEngine — state immutability across steps', () => {
    it('each getState() call returns a fresh independent clone', () => {
        const engine = createEngine();
        engine.loadProblem(PROBLEM_ID);

        const s1 = engine.getState();
        engine.nextStep();
        const s2 = engine.getState();

        // s1 should still reflect step 0 (all '?')
        expect(s1.cells[0][0]).toBe('?');
        // s2 may differ after step 1 (init action — no cell change in this step)
        expect(s2).not.toBe(s1); // different references
    });
});
