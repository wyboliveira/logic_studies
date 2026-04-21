/**
 * Logic Studies - Sequence Visualizer
 * Renders and animates numeric sequences
 */

class SequenceVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * Render sequence
     */
    render(state) {
        if (!this.container) return;

        const { numbers, highlighted = [], revealed = false, infos = [] } = state;

        let html = '<div class="sequence-container">';
        
        // Sequence boxes
        html += '<div class="sequence-boxes">';
        numbers.forEach((num, index) => {
            const isHighlighted = highlighted.includes(index);
            const isLast = index === numbers.length - 1;
            const isUnknown = num === '?';
            const isAnswer = isLast && revealed;

            let boxClasses = 'sequence-box';
            if (isHighlighted) boxClasses += ' highlighted';
            if (isAnswer) boxClasses += ' answer';
            if (isUnknown && !revealed) boxClasses += ' unknown';

            html += `<div id="seq-box-${index}" class="${boxClasses}">${num}</div>`;
            
            // Add arrow between numbers (except after last)
            if (index < numbers.length - 1) {
                html += '<span class="sequence-arrow">→</span>';
            }
        });
        html += '</div>';

        // Info/pattern box
        if (infos && infos.length > 0) {
            html += '<div class="sequence-pattern">';
            html += '<div class="sequence-pattern-label">Análise:</div>';
            infos.forEach(info => {
                html += `<div class="sequence-pattern-formula">${info}</div>`;
            });
            html += '</div>';
        }

        html += '</div>';

        this.container.innerHTML = html;
    }

    /**
     * Animate highlight of a box
     */
    animateHighlight(index) {
        const box = document.getElementById(`seq-box-${index}`);
        if (box) {
            box.classList.add('sequence-box-highlight');
            setTimeout(() => {
                box.classList.remove('sequence-box-highlight');
            }, 600);
        }
    }

    /**
     * Animate reveal of answer
     */
    animateReveal(index) {
        const box = document.getElementById(`seq-box-${index}`);
        if (box) {
            box.classList.add('sequence-box-reveal');
            box.classList.add('answer');
        }
    }

    /**
     * Animate multiple highlights
     */
    animateMultipleHighlights(indices) {
        indices.forEach((index, i) => {
            setTimeout(() => {
                this.animateHighlight(index);
            }, i * 150);
        });
    }

    /**
     * Apply animation based on action
     */
    applyAnimation(action, state) {
        if (!action) return;

        switch (action.type) {
            case 'highlight':
                if (typeof action.index !== 'undefined') {
                    this.animateHighlight(action.index);
                } else if (action.indices) {
                    this.animateMultipleHighlights(action.indices);
                }
                break;
            case 'reveal':
                const lastIndex = state.numbers.length - 1;
                this.animateReveal(lastIndex);
                break;
        }
    }
}

// Create global instance
const sequenceVisualizer = new SequenceVisualizer('visualizationArea');
