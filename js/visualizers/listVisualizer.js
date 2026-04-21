/**
 * Logic Studies - List/Order Visualizer
 * Renders and animates order/position problems
 */

class ListVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * Render order slots
     */
    render(state) {
        if (!this.container) return;

        const { positions, slots, infos = [] } = state;

        let html = '<div class="order-container">';
        
        // Position slots
        html += '<div class="order-slots">';
        positions.forEach((position, index) => {
            const person = slots[index];
            const isConfirmed = person !== null;
            
            let boxClasses = 'order-box';
            if (isConfirmed) boxClasses += ' confirmed';

            html += `
                <div class="order-slot">
                    <div class="order-position">${position}</div>
                    <div id="order-box-${index}" class="${boxClasses}">
                        ${person || '?'}
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // Info box
        if (infos && infos.length > 0) {
            html += '<div class="sequence-pattern" style="margin-top: var(--space-6);">';
            html += '<div class="sequence-pattern-label">Deduções:</div>';
            infos.forEach(info => {
                html += `<div class="sequence-pattern-formula">${info}</div>`;
            });
            html += '</div>';
        }

        html += '</div>';

        this.container.innerHTML = html;
    }

    /**
     * Animate placing a person in a slot
     */
    animatePlace(position) {
        const box = document.getElementById(`order-box-${position}`);
        if (box) {
            box.classList.add('slot-fill');
            box.classList.add('confirmed');
            setTimeout(() => {
                box.classList.remove('slot-fill');
            }, 500);
        }
    }

    /**
     * Animate highlighting a slot
     */
    animateHighlight(position) {
        const box = document.getElementById(`order-box-${position}`);
        if (box) {
            box.classList.add('highlighted');
            setTimeout(() => {
                box.classList.remove('highlighted');
            }, 800);
        }
    }

    /**
     * Apply animation based on action
     */
    applyAnimation(action) {
        if (!action) return;

        switch (action.type) {
            case 'place':
                this.animatePlace(action.position);
                break;
            case 'highlight':
                if (typeof action.position !== 'undefined') {
                    this.animateHighlight(action.position);
                }
                break;
        }
    }
}

// Create global instance
const listVisualizer = new ListVisualizer('visualizationArea');
