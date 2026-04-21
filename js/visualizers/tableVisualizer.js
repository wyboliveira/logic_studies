/**
 * Logic Studies - Table Visualizer
 * Renders and animates logic tables
 */

class TableVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * Render initial table
     */
    render(state) {
        if (!this.container) return;

        const { rows, cols, cells, confirmed = [], eliminated = [], highlighted = [], infos = [] } = state;

        let html = '<table class="logic-table">';
        
        // Header row
        html += '<thead><tr><th></th>';
        cols.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead>';

        // Body rows
        html += '<tbody>';
        rows.forEach((rowLabel, rowIndex) => {
            html += '<tr>';
            html += `<td class="row-header">${rowLabel}</td>`;
            cells[rowIndex].forEach((cell, colIndex) => {
                const cellClasses = this.getCellClasses(rowIndex, colIndex, confirmed, eliminated, highlighted);
                const cellId = `cell-${rowIndex}-${colIndex}`;
                html += `<td id="${cellId}" class="${cellClasses}">${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        // Info box
        if (infos && infos.length > 0) {
            html += '<div class="info-box">';
            infos.forEach(info => {
                html += `<div class="info-item">📌 ${info}</div>`;
            });
            html += '</div>';
        }

        this.container.innerHTML = html;
    }

    /**
     * Get CSS classes for a cell
     */
    getCellClasses(row, col, confirmed, eliminated, highlighted) {
        const classes = [];

        if (confirmed.some(c => c.row === row && c.col === col)) {
            classes.push('confirmed');
        }
        if (eliminated.some(c => c.row === row && c.col === col)) {
            classes.push('eliminated');
        }
        if (highlighted.some(c => c.row === row && c.col === col)) {
            classes.push('highlighted');
        }

        return classes.join(' ');
    }

    /**
     * Animate confirmation of a cell
     */
    animateConfirm(row, col) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
            cell.classList.add('cell-confirm');
            cell.classList.add('confirmed');
            setTimeout(() => {
                cell.classList.remove('cell-confirm');
            }, 600);
        }
    }

    /**
     * Animate elimination of a cell
     */
    animateEliminate(row, col) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
            cell.classList.add('cell-eliminate');
            cell.classList.add('eliminated');
            setTimeout(() => {
                cell.classList.remove('cell-eliminate');
            }, 500);
        }
    }

    /**
     * Animate highlight of a cell
     */
    animateHighlight(row, col) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
            cell.classList.add('cell-highlight');
            cell.classList.add('highlighted');
            setTimeout(() => {
                cell.classList.remove('cell-highlight');
            }, 800);
        }
    }

    /**
     * Apply animation based on action
     */
    applyAnimation(action) {
        if (!action) return;

        switch (action.type) {
            case 'confirm':
                this.animateConfirm(action.row, action.col);
                break;
            case 'eliminate':
                this.animateEliminate(action.row, action.col);
                break;
            case 'highlight':
                this.animateHighlight(action.row, action.col);
                break;
        }
    }
}

// Create global instance
const tableVisualizer = new TableVisualizer('visualizationArea');
