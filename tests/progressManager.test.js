/**
 * ProgressManager — unit tests
 *
 * Loads the source via Node.js vm (same pattern as testContext.js) with a
 * fresh in-memory localStorage mock per test so tests are fully isolated.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import vm   from 'vm';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '../js/progress/progressManager.js'), 'utf8');

function createProgressManager() {
    const store = {};
    const localStorageMock = {
        getItem:    key       => store[key] ?? null,
        setItem:    (key, v)  => { store[key] = String(v); },
        removeItem: key       => { delete store[key]; },
    };

    const ctx = vm.createContext({ localStorage: localStorageMock });
    vm.runInContext(
        `(function(){ ${src}\n this.progressManager = progressManager; }).call(this)`,
        ctx
    );
    return ctx.progressManager;
}

// ── Basic state ───────────────────────────────────────────────────────────────

describe('ProgressManager — initial state', () => {
    it('starts empty', () => {
        const pm = createProgressManager();
        expect(pm.getCount()).toBe(0);
        expect(pm.getCompletedIds()).toEqual([]);
    });

    it('isCompleted returns false for unknown problems', () => {
        const pm = createProgressManager();
        expect(pm.isCompleted(1)).toBe(false);
        expect(pm.isCompleted(99)).toBe(false);
    });
});

// ── markCompleted ─────────────────────────────────────────────────────────────

describe('ProgressManager — markCompleted', () => {
    it('marks a single problem completed', () => {
        const pm = createProgressManager();
        pm.markCompleted(1);
        expect(pm.isCompleted(1)).toBe(true);
        expect(pm.getCount()).toBe(1);
    });

    it('does not create duplicates', () => {
        const pm = createProgressManager();
        pm.markCompleted(5);
        pm.markCompleted(5);
        pm.markCompleted(5);
        expect(pm.getCount()).toBe(1);
        expect(pm.getCompletedIds()).toEqual([5]);
    });

    it('tracks multiple distinct problems', () => {
        const pm = createProgressManager();
        [1, 3, 7, 12].forEach(id => pm.markCompleted(id));
        expect(pm.getCount()).toBe(4);
        expect(pm.getCompletedIds()).toEqual([1, 3, 7, 12]);
    });

    it('persists across separate getCompletedIds calls', () => {
        const pm = createProgressManager();
        pm.markCompleted(2);
        pm.markCompleted(4);
        expect(pm.getCompletedIds()).toContain(2);
        expect(pm.getCompletedIds()).toContain(4);
    });
});

// ── reset ─────────────────────────────────────────────────────────────────────

describe('ProgressManager — reset', () => {
    it('clears all completed ids', () => {
        const pm = createProgressManager();
        pm.markCompleted(1);
        pm.markCompleted(2);
        pm.reset();
        expect(pm.getCount()).toBe(0);
        expect(pm.getCompletedIds()).toEqual([]);
    });

    it('allows re-marking after reset', () => {
        const pm = createProgressManager();
        pm.markCompleted(1);
        pm.reset();
        pm.markCompleted(1);
        expect(pm.isCompleted(1)).toBe(true);
        expect(pm.getCount()).toBe(1);
    });
});

// ── Isolation between instances ───────────────────────────────────────────────

describe('ProgressManager — storage isolation per instance', () => {
    it('two instances with separate stores are independent', () => {
        const pm1 = createProgressManager();
        const pm2 = createProgressManager();

        pm1.markCompleted(10);
        // pm2 has its own in-memory store, so it should be empty
        expect(pm2.getCount()).toBe(0);
        expect(pm1.getCount()).toBe(1);
    });
});
