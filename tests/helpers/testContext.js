/**
 * Test helper: loads browser scripts into a Node.js vm context.
 *
 * The source files use implicit globals (no export/import) which is fine for
 * browsers but incompatible with ESM. The vm module solves this by evaluating
 * both scripts in a shared sandbox — PROBLEMS is visible to ProblemEngine
 * through the same context object, matching the browser's global scope model.
 */

import { readFileSync }              from 'node:fs';
import vm                            from 'node:vm';
import { resolve, dirname }          from 'node:path';
import { fileURLToPath }             from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '../..');

const dataSrc   = readFileSync(resolve(root, 'js/problems/problemData.js'),   'utf-8');
const engineSrc = readFileSync(resolve(root, 'js/problems/problemEngine.js'), 'utf-8');

// Shared vm context — PROBLEMS must be defined before the engine script runs.
// `const` and `class` declarations are block-scoped inside vm.runInContext and
// do NOT become properties of the context object, so we wrap each source in an
// IIFE that runs with the context as `this` and explicitly hoists the exports.
// Node.js globals (structuredClone) must be injected explicitly — the vm
// sandbox does not inherit the outer process globals.
const vmCtx = vm.createContext({ structuredClone });
vm.runInContext(`(function(){ ${dataSrc}\n this.PROBLEMS = PROBLEMS; }).call(this)`,      vmCtx);
vm.runInContext(`(function(){ ${engineSrc}\n this.ProblemEngine = ProblemEngine; }).call(this)`, vmCtx);

/** All 10 problem definitions */
export const PROBLEMS = vmCtx.PROBLEMS;

/** Creates a fresh ProblemEngine instance for each test (no shared state) */
export function createEngine() {
    return new vmCtx.ProblemEngine();
}
