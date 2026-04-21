/**
 * Logic Studies - Table Visualizer
 * Renders and animates logic tables
 */

class TableVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        if (!this.container) return;

        const { rows, cols, cells, confirmed = [], eliminated = [], highlighted = [], infos = [] } = state;

        let html = '<table class="logic-table">';

        html += '<thead><tr><th></th>';
        cols.forEach(col => { html += `<th>${col}</th>`; });
        html += '</tr></thead><tbody>';

        rows.forEach((rowLabel, rowIndex) => {
            html += '<tr>';
            html += `<td class="row-header">${rowLabel}</td>`;
            cells[rowIndex].forEach((cell, colIndex) => {
                const cls = this._cellClasses(rowIndex, colIndex, confirmed, eliminated, highlighted);
                html += `<td id="cell-${rowIndex}-${colIndex}" class="${cls}">${cell}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';

        if (infos.length > 0) {
            html += '<div class="info-box">';
            infos.forEach(info => { html += `<div class="info-item">📌 ${info}</div>`; });
            html += '</div>';
        }

        this.container.innerHTML = html;
    }

    _cellClasses(row, col, confirmed, eliminated, highlighted) {
        const classes = [];
        if (confirmed.some(c => c.row === row && c.col === col))   classes.push('confirmed');
        if (eliminated.some(c => c.row === row && c.col === col))  classes.push('eliminated');
        if (highlighted.some(c => c.row === row && c.col === col)) classes.push('highlighted');
        return classes.join(' ');
    }

    // ─── Anime.js animations ───────────────────────────────────────────────

    animateConfirm(row, col) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (!cell) return;

        if (typeof anime === 'undefined') {
            cell.classList.add('cell-confirm');
            setTimeout(() => cell.classList.remove('cell-confirm'), 600);
            return;
        }

        // Scale bounce on the confirmed cell
        anime.timeline({ targets: cell, easing: 'easeOutBack' })
            .add({ scale: [0.8, 1.2], duration: 200 })
            .add({ scale: 1,          duration: 150 });

        // After the bounce, scan the row and column to hint at further deductions
        setTimeout(() => this._reasoningHints(row, col), 350);
    }

    animateEliminate(row, col) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (!cell) return;

        if (typeof anime === 'undefined') {
            cell.classList.add('cell-eliminate');
            setTimeout(() => cell.classList.remove('cell-eliminate'), 500);
            return;
        }

        // Brief shrink before the CSS eliminateFade takes over
        anime({
            targets: cell,
            scale: [1, 0.88, 1],
            duration: 350,
            easing: 'easeOutQuart'
        });

        cell.classList.add('cell-eliminate');
        setTimeout(() => cell.classList.remove('cell-eliminate'), 500);
    }

    animateHighlight(row, col) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (!cell) return;

        if (typeof anime === 'undefined') {
            cell.classList.add('cell-highlight');
            setTimeout(() => cell.classList.remove('cell-highlight'), 800);
            return;
        }

        anime({
            targets: cell,
            scale: [1, 1.08, 1],
            duration: 600,
            easing: 'easeInOutSine'
        });

        cell.classList.add('cell-highlight');
        setTimeout(() => cell.classList.remove('cell-highlight'), 800);
    }

    // Briefly pulse the rest of the row then the column — visual reasoning hint
    _reasoningHints(row, col) {
        if (typeof anime === 'undefined') return;

        const table = this.container.querySelector('.logic-table');
        if (!table) return;

        const rowCells = [];
        const colCells = [];

        table.querySelectorAll('tbody tr').forEach((tr, r) => {
            tr.querySelectorAll('td:not(.row-header)').forEach((cell, c) => {
                if (r === row && c !== col) rowCells.push(cell);
                if (c === col && r !== row) colCells.push(cell);
            });
        });

        // Row scan (blue border pulse)
        anime({
            targets: rowCells,
            boxShadow: [
                'inset 0 0 0 0px transparent',
                'inset 0 0 0 2px rgba(59, 130, 246, 0.5)',
                'inset 0 0 0 0px transparent'
            ],
            duration: 550,
            delay: anime.stagger(45),
            easing: 'easeInOutSine'
        });

        // Column scan (slightly delayed)
        setTimeout(() => {
            anime({
                targets: colCells,
                boxShadow: [
                    'inset 0 0 0 0px transparent',
                    'inset 0 0 0 2px rgba(59, 130, 246, 0.5)',
                    'inset 0 0 0 0px transparent'
                ],
                duration: 550,
                delay: anime.stagger(45),
                easing: 'easeInOutSine'
            });
        }, 280);
    }

    // Staggered reveal of all confirmed/eliminated cells — used by showSolution
    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;

        const { confirmed = [], eliminated = [] } = state;

        eliminated.forEach(({ row, col }, i) => {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (!cell) return;
            anime({
                targets: cell,
                scale: [0.85, 1],
                opacity: [0.4, 0.7],
                duration: 300,
                delay: i * 40,
                easing: 'easeOutQuart'
            });
        });

        const offset = eliminated.length * 40;
        confirmed.forEach(({ row, col }, i) => {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (!cell) return;
            anime({
                targets: cell,
                scale: [0.7, 1.1, 1],
                duration: 400,
                delay: offset + i * 80,
                easing: 'easeOutBack'
            });
        });
    }

    applyAnimation(action, state, prevState) {
        if (!action) return;

        switch (action.type) {
            case 'confirm':   this.animateConfirm(action.row, action.col);   break;
            case 'eliminate': this.animateEliminate(action.row, action.col); break;
            case 'highlight': this.animateHighlight(action.row, action.col); break;
        }
    }
}

const tableVisualizer = new TableVisualizer('visualizationArea');
