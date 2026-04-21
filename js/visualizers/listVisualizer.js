/**
 * Logic Studies - List/Order Visualizer
 * Renders and animates order/position problems
 */

class ListVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        if (!this.container) return;

        const { positions, slots, infos = [] } = state;

        // Candidates zone — people not yet placed
        const placed = new Set(slots.filter(s => s !== null));
        const candidates = (state.people || []).filter(p => !placed.has(p));

        let html = '<div class="order-container">';

        // Candidates zone (only show when there are still unplaced people)
        if (candidates.length > 0) {
            html += '<div class="candidates-zone"><div class="candidates-label">Aguardando posição:</div><div class="candidates-list">';
            candidates.forEach(person => {
                html += `<div class="candidate-chip" id="candidate-${person}">${person}</div>`;
            });
            html += '</div></div>';
        }

        // Slots
        html += '<div class="order-slots">';
        positions.forEach((position, index) => {
            const person      = slots[index];
            const isConfirmed = person !== null;

            html += `
                <div class="order-slot">
                    <div class="order-position">${position}</div>
                    <div id="order-box-${index}" class="order-box${isConfirmed ? ' confirmed' : ''}">
                        ${person || '?'}
                    </div>
                </div>
            `;
        });
        html += '</div>';

        if (infos.length > 0) {
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

    // ─── Anime.js animations ───────────────────────────────────────────────

    // Person drops in from above with a spring bounce
    animatePlace(position) {
        const box = document.getElementById(`order-box-${position}`);
        if (!box) return;

        if (typeof anime === 'undefined') {
            box.classList.add('slot-fill');
            setTimeout(() => box.classList.remove('slot-fill'), 500);
            return;
        }

        anime({
            targets: box,
            translateY: [-45, 0],
            opacity:    [0, 1],
            scale:      [0.8, 1],
            duration:   650,
            easing:     'spring(1, 80, 10, 0)'
        });

        // Remaining candidate chips subtly re-settle after a placement
        const chips = this.container?.querySelectorAll('.candidate-chip');
        if (chips?.length) {
            anime({
                targets: Array.from(chips),
                scale:   [0.92, 1],
                opacity: [0.6, 1],
                duration: 300,
                delay:    anime.stagger(50, { start: 200 }),
                easing:   'easeOutBack'
            });
        }
    }

    animateHighlight(position) {
        const box = document.getElementById(`order-box-${position}`);
        if (!box) return;

        if (typeof anime === 'undefined') {
            box.classList.add('highlighted');
            setTimeout(() => box.classList.remove('highlighted'), 800);
            return;
        }

        anime({
            targets:  box,
            scale:    [1, 1.08, 1],
            duration: 600,
            easing:   'easeInOutSine'
        });

        box.classList.add('highlighted');
        setTimeout(() => box.classList.remove('highlighted'), 800);
    }

    // Staggered drop-in of all placed people — used by showSolution
    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;

        state.slots.forEach((person, index) => {
            if (person === null) return;
            const box = document.getElementById(`order-box-${index}`);
            if (!box) return;

            anime({
                targets:  box,
                translateY: [-30, 0],
                opacity:    [0, 1],
                duration:   400,
                delay:      index * 110,
                easing:     'easeOutBack'
            });
        });
    }

    applyAnimation(action, _state, _prevState) {
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

const listVisualizer = new ListVisualizer('visualizationArea');
