/**
 * Logic Studies - Progress Manager
 * Persists completed problems in localStorage
 */

class ProgressManager {
    constructor() {
        this._key = 'logic_studies_progress';
    }

    markCompleted(problemId) {
        const ids = this.getCompletedIds();
        if (!ids.includes(problemId)) {
            ids.push(problemId);
            try {
                localStorage.setItem(this._key, JSON.stringify(ids));
            } catch {
                // localStorage unavailable (private mode, storage full) — silent no-op
            }
        }
    }

    isCompleted(problemId) {
        return this.getCompletedIds().includes(problemId);
    }

    getCompletedIds() {
        try {
            return JSON.parse(localStorage.getItem(this._key)) ?? [];
        } catch {
            return [];
        }
    }

    getCount() {
        return this.getCompletedIds().length;
    }

    reset() {
        try {
            localStorage.removeItem(this._key);
        } catch {
            // silent no-op
        }
    }
}

const progressManager = new ProgressManager();
