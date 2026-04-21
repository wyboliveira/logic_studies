/**
 * Logic Studies - Sequence Visualizer
 * Renders and animates numeric sequences
 */

class SequenceVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        if (!this.container) return;

        const { numbers, highlighted = [], revealed = false, infos = [] } = state;

        let html = '<div class="sequence-container"><div class="sequence-boxes">';

        numbers.forEach((num, index) => {
            const isHighlighted = highlighted.includes(index);
            const isLast        = index === numbers.length - 1;
            const isUnknown     = num === '?';
            const isAnswer      = isLast && revealed;

            let boxClasses = 'sequence-box';
            if (isHighlighted) boxClasses += ' highlighted';
            if (isAnswer)      boxClasses += ' answer';
            if (isUnknown && !revealed) boxClasses += ' unknown';

            html += `<div id="seq-box-${index}" class="${boxClasses}">${num}</div>`;

            if (index < numbers.length - 1) {
                // .seq-gap wraps the arrow and hosts the operation label above it
                html += `
                    <div class="seq-gap" id="seq-gap-${index}">
                        <span class="seq-operation" id="seq-op-${index}"></span>
                        <span class="sequence-arrow">→</span>
                    </div>
                `;
            }
        });

        html += '</div>';

        if (infos.length > 0) {
            html += '<div class="sequence-pattern"><div class="sequence-pattern-label">Análise:</div>';
            infos.forEach(info => {
                html += `<div class="sequence-pattern-formula">${info}</div>`;
            });
            html += '</div>';
        }

        html += '</div>';
        this.container.innerHTML = html;
    }

    // ─── Anime.js animations ───────────────────────────────────────────────

    animateHighlight(index, operation) {
        const box = document.getElementById(`seq-box-${index}`);
        if (!box) return;

        if (typeof anime === 'undefined') {
            box.classList.add('sequence-box-highlight');
            setTimeout(() => box.classList.remove('sequence-box-highlight'), 600);
            return;
        }

        anime({
            targets: box,
            scale: [1, 1.15, 1.05],
            duration: 550,
            easing: 'easeOutBack'
        });

        // Show operation label on the arrow leading INTO this box (gap before this index)
        if (operation && index > 0) {
            const opEl = document.getElementById(`seq-op-${index - 1}`);
            if (opEl) {
                opEl.textContent = operation;
                anime({
                    targets: opEl,
                    opacity: [0, 1],
                    translateY: [-8, 0],
                    duration: 350,
                    delay: 150,
                    easing: 'easeOutQuart'
                });
            }
        }
    }

    animateReveal(index) {
        const box = document.getElementById(`seq-box-${index}`);
        if (!box) return;

        box.classList.add('answer');

        if (typeof anime === 'undefined') {
            box.classList.add('sequence-box-reveal');
            return;
        }

        anime.timeline({ targets: box, easing: 'easeOutBack' })
            .add({ rotateY: [90, 0], opacity: [0, 1], duration: 500 })
            .add({ scale: [1.2, 1],                   duration: 300 }, '-=150');
    }

    animateMultipleHighlights(indices, operations = []) {
        indices.forEach((index, i) => {
            setTimeout(() => {
                this.animateHighlight(index, operations[i]);
            }, i * 150);
        });
    }

    // Staggered reveal of all boxes — used by showSolution
    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;

        const lastIndex = state.numbers.length - 1;

        state.numbers.forEach((_, i) => {
            const box = document.getElementById(`seq-box-${i}`);
            if (!box) return;

            const isAnswer = (i === lastIndex) && state.revealed;
            anime({
                targets: box,
                scale:   isAnswer ? [0.5, 1.2, 1] : [0.8, 1],
                opacity: [0, 1],
                duration: isAnswer ? 600 : 300,
                delay:    i * 80,
                easing:   'easeOutBack'
            });
        });
    }

    applyAnimation(action, state, _prevState) {
        if (!action) return;

        switch (action.type) {
            case 'highlight':
                if (typeof action.index !== 'undefined') {
                    this.animateHighlight(action.index, action.operation);
                } else if (action.indices) {
                    this.animateMultipleHighlights(action.indices, action.operations);
                }
                break;
            case 'reveal':
                this.animateReveal(state.numbers.length - 1);
                break;
        }
    }
}

const sequenceVisualizer = new SequenceVisualizer('visualizationArea');
