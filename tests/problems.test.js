/**
 * Problem data validation — verifies that each problem reaches its correct
 * final state when solved step-by-step via showSolution().
 *
 * Strategy:
 *  - table:       every row and column must have exactly one '✓' (bijection).
 *  - sequence:    last element must be revealed and match the numeric answer.
 *  - order:       all slots filled, no nulls.
 *  - proposition: all statements active; conclusion has valid !== null.
 *  - venn:        all four regions (only_A, both, only_B, neither) are numbers.
 *  - truthfalse:  all people have role !== null.
 */

import { describe, it, expect } from 'vitest';
import { createEngine, PROBLEMS } from './helpers/testContext.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function solvedState(problemId) {
    const engine = createEngine();
    engine.loadProblem(problemId);
    engine.showSolution();
    return engine.getState();
}

function confirmedCountPerRow(cells) {
    return cells.map(row => row.filter(c => c === '✓').length);
}

function confirmedCountPerCol(cells) {
    const colCount = cells[0].length;
    return Array.from({ length: colCount }, (_, c) =>
        cells.reduce((acc, row) => acc + (row[c] === '✓' ? 1 : 0), 0)
    );
}

// ─── Generic sanity checks — all 10 problems ──────────────────────────────────

describe('All problems — load and solve without errors', () => {
    PROBLEMS.forEach(problem => {
        it(`problem ${problem.id}: "${problem.title}"`, () => {
            const engine = createEngine();
            expect(() => engine.loadProblem(problem.id)).not.toThrow();
            expect(() => engine.showSolution()).not.toThrow();
            expect(engine.isAtEnd()).toBe(true);
        });
    });
});

describe('Table problems — bijection invariant (exactly one ✓ per row and column)', () => {
    const tableProblems = PROBLEMS.filter(p => p.type === 'table');

    tableProblems.forEach(problem => {
        it(`problem ${problem.id}: "${problem.title}"`, () => {
            const state = solvedState(problem.id);
            const { rows, cells } = state;

            const rowCounts = confirmedCountPerRow(cells);
            const colCounts = confirmedCountPerCol(cells);

            // Every person has exactly one confirmed attribute
            rowCounts.forEach((count, r) => {
                expect(count, `row ${r} (${rows[r]}) should have exactly 1 ✓`).toBe(1);
            });

            // Every attribute belongs to exactly one person
            colCounts.forEach((count, c) => {
                expect(count, `col ${c} should have exactly 1 ✓`).toBe(1);
            });
        });
    });
});

describe('Sequence problems — answer revealed correctly', () => {
    it('problem 2 — geometric ×2 (answer: 32)', () => {
        const state = solvedState(2);
        expect(state.revealed).toBe(true);
        expect(state.numbers[state.numbers.length - 1]).toBe(32);
    });

    it('problem 5 — alternating sequences (answer: 4)', () => {
        const state = solvedState(5);
        expect(state.revealed).toBe(true);
        expect(state.numbers[state.numbers.length - 1]).toBe(4);
    });

    it('problem 9 — Fibonacci (answer: 13)', () => {
        const state = solvedState(9);
        expect(state.revealed).toBe(true);
        expect(state.numbers[state.numbers.length - 1]).toBe(13);
    });
});

describe('Order problem — correct slot assignment', () => {
    it('problem 3 — race order: Diana, Gabi, Fábio, Eduardo', () => {
        const state = solvedState(3);

        // All positions must be filled
        state.slots.forEach((person, i) => {
            expect(person, `slot ${i} should not be null`).not.toBeNull();
        });

        expect(state.slots[0]).toBe('Diana');
        expect(state.slots[1]).toBe('Gabi');
        expect(state.slots[2]).toBe('Fábio');
        expect(state.slots[3]).toBe('Eduardo');
    });
});

// ─── Specific cell checks for each table problem ────────────────────────────

describe('Problem 1 — Ana/Bruno/Carla — cargos', () => {
    it('confirms Ana=Médica, Bruno=Advogado, Carla=Engenheira', () => {
        const { cells } = solvedState(1);
        expect(cells[0][0]).toBe('✓'); // Ana  — Médica
        expect(cells[1][1]).toBe('✓'); // Bruno — Advogado
        expect(cells[2][2]).toBe('✓'); // Carla — Engenheira
    });
});

describe('Problem 4 — Pedro/Renata/Sérgio — apartamentos', () => {
    it('confirms Sérgio=1º, Renata=2º, Pedro=3º', () => {
        const { cells } = solvedState(4);
        expect(cells[0][2]).toBe('✓'); // Pedro   — 3º andar
        expect(cells[1][1]).toBe('✓'); // Renata  — 2º andar
        expect(cells[2][0]).toBe('✓'); // Sérgio  — 1º andar
    });
});

describe('Problem 6 — Frutas e cores', () => {
    it('confirms Maçã=Vermelha, Banana=Amarela, Uva=Roxa', () => {
        const { cells } = solvedState(6);
        expect(cells[0][0]).toBe('✓'); // Maçã   — Vermelha
        expect(cells[1][1]).toBe('✓'); // Banana — Amarela
        expect(cells[2][2]).toBe('✓'); // Uva    — Roxa
    });
});

describe('Problem 7 — Esportes da semana', () => {
    it('confirms Lucas=Tênis, Marcos=Futebol, Nina=Natação', () => {
        const { cells } = solvedState(7);
        expect(cells[0][2]).toBe('✓'); // Lucas  — Tênis
        expect(cells[1][0]).toBe('✓'); // Marcos — Futebol
        expect(cells[2][1]).toBe('✓'); // Nina   — Natação
    });
});

describe('Problem 8 — Amigos e profissões (4×4)', () => {
    it('confirms Alice=Médica, Beto=Professor, Cléo=Arquiteta, Davi=Chef', () => {
        const { cells } = solvedState(8);
        expect(cells[0][1]).toBe('✓'); // Alice — Médico
        expect(cells[1][0]).toBe('✓'); // Beto  — Professor
        expect(cells[2][2]).toBe('✓'); // Cléo  — Arquiteto
        expect(cells[3][3]).toBe('✓'); // Davi  — Chef
    });
});

describe('Problem 10 — Jantar dos cinco amigos (5×5)', () => {
    it('confirms Ana=Norte, Bruno=Oeste, Carlos=Leste, Diana=Sul, Eduardo=Centro', () => {
        const { cells } = solvedState(10);
        expect(cells[0][0]).toBe('✓'); // Ana     — Norte
        expect(cells[1][3]).toBe('✓'); // Bruno   — Oeste
        expect(cells[2][2]).toBe('✓'); // Carlos  — Leste
        expect(cells[3][1]).toBe('✓'); // Diana   — Sul
        expect(cells[4][4]).toBe('✓'); // Eduardo — Centro
    });
});

// ─── Proposition problems ────────────────────────────────────────────────────

describe('Proposition problems — all statements activated, conclusion validated', () => {
    const propProblems = PROBLEMS.filter(p => p.type === 'proposition');

    propProblems.forEach(problem => {
        it(`problem ${problem.id}: "${problem.title}"`, () => {
            const state = solvedState(problem.id);

            state.statements.forEach((s, i) => {
                if (s.type === 'conclusion') {
                    expect(s.valid, `conclusion should have valid !== null`).not.toBeNull();
                }
            });
        });
    });
});

describe('Problem 31 — Modus Ponens (valid)', () => {
    it('conclusion is valid', () => {
        const state = solvedState(31);
        const conclusion = state.statements.find(s => s.type === 'conclusion');
        expect(conclusion.valid).toBe(true);
    });
});

describe('Problem 34 — Falácia do Consequente (invalid)', () => {
    it('conclusion is invalid', () => {
        const state = solvedState(34);
        const conclusion = state.statements.find(s => s.type === 'conclusion');
        expect(conclusion.valid).toBe(false);
    });
});

// ─── Venn diagram problems ───────────────────────────────────────────────────

describe('Venn problems — all four regions filled with numbers', () => {
    const vennProblems = PROBLEMS.filter(p => p.type === 'venn');

    vennProblems.forEach(problem => {
        it(`problem ${problem.id}: "${problem.title}"`, () => {
            const state = solvedState(problem.id);
            expect(state.only_A,  'only_A should be a number').not.toBeNull();
            expect(state.both,    'both should be a number').not.toBeNull();
            expect(state.only_B,  'only_B should be a number').not.toBeNull();
            expect(state.neither, 'neither should be a number').not.toBeNull();
        });
    });
});

describe('Problem 35 — Esportes (neither=5)', () => {
    it('confirms only_A=13, both=5, only_B=7, neither=5', () => {
        const s = solvedState(35);
        expect(s.only_A).toBe(13);
        expect(s.both).toBe(5);
        expect(s.only_B).toBe(7);
        expect(s.neither).toBe(5);
    });
});

describe('Problem 36 — Idiomas (both=13)', () => {
    it('confirms both=13', () => {
        const s = solvedState(36);
        expect(s.both).toBe(13);
        expect(s.neither).toBe(8);
    });
});

describe('Problem 37 — Aprovação em provas (only_A+only_B=34)', () => {
    it('confirms only_A=20, only_B=14', () => {
        const s = solvedState(37);
        expect(s.only_A).toBe(20);
        expect(s.only_B).toBe(14);
        expect(s.both).toBe(10);
    });
});

// ─── Truth/False problems ─────────────────────────────────────────────────────

describe('Truth/False problems — all people have role revealed', () => {
    const tfProblems = PROBLEMS.filter(p => p.type === 'truthfalse');

    tfProblems.forEach(problem => {
        it(`problem ${problem.id}: "${problem.title}"`, () => {
            const state = solvedState(problem.id);
            state.people.forEach(p => {
                expect(p.role, `${p.name} should have a role`).not.toBeNull();
            });
        });
    });
});

describe('Problem 38 — Ana e Beto: Beto é mentiroso', () => {
    it('Ana=truth, Beto=liar', () => {
        const s = solvedState(38);
        expect(s.people.find(p => p.name === 'Ana').role).toBe('truth');
        expect(s.people.find(p => p.name === 'Beto').role).toBe('liar');
    });
});

describe('Problem 39 — Três Suspeitos: Carlos verdadeiro, Denise culpada', () => {
    it('Carlos=truth, Denise=liar, Eduardo=liar', () => {
        const s = solvedState(39);
        expect(s.people.find(p => p.name === 'Carlos').role).toBe('truth');
        expect(s.people.find(p => p.name === 'Denise').role).toBe('liar');
        expect(s.people.find(p => p.name === 'Eduardo').role).toBe('liar');
    });
});

describe('Problem 40 — Quem roubou o troféu: Gustavo=liar', () => {
    it('Fátima=truth, Gustavo=liar, Helo=truth', () => {
        const s = solvedState(40);
        expect(s.people.find(p => p.name === 'Fátima').role).toBe('truth');
        expect(s.people.find(p => p.name === 'Gustavo').role).toBe('liar');
        expect(s.people.find(p => p.name === 'Helo').role).toBe('truth');
    });
});
