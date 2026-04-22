/**
 * Logic Studies - Truth/False Visualizer
 * Renders a set of people, each with a statement and a role (truth-teller / liar / unknown)
 */

class TruthVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        if (!this.container) return;
        const { people = [], infos = [] } = state;

        let html = '<div class="truth-container">';

        people.forEach((p, i) => {
            const roleClass = p.role === 'truth' ? ' truth-role-truth'
                            : p.role === 'liar'  ? ' truth-role-liar'
                            : '';
            const activeClass = p.active ? ' active' : '';
            const roleBadge = p.role === 'truth'
                ? '<span class="truth-badge truth-badge-truth">✓ Verdadeiro</span>'
                : p.role === 'liar'
                ? '<span class="truth-badge truth-badge-liar">✗ Mentiroso</span>'
                : '';

            html += `
                <div id="truth-person-${i}" class="truth-card${roleClass}${activeClass}">
                    <div class="truth-card-header">
                        <span class="truth-name">${p.name}</span>
                        ${roleBadge}
                    </div>
                    <p class="truth-statement">"${p.statement}"</p>
                </div>
            `;
        });

        if (infos.length > 0) {
            html += '<div class="truth-infos">';
            infos.forEach(info => { html += `<div class="truth-info-item">${info}</div>`; });
            html += '</div>';
        }

        html += '</div>';
        this.container.innerHTML = html;
    }

    applyAnimation(action, state, _prevState) {
        if (typeof anime === 'undefined') return;

        if (action.type === 'activate') {
            const idx = state.people.findIndex(p => p.name === action.name);
            const el  = document.getElementById(`truth-person-${idx}`);
            if (!el) return;
            anime({ targets: el, translateX: [-8, 0], opacity: [0.4, 1], duration: 400, easing: 'easeOutQuart' });
        }

        if (action.type === 'reveal') {
            const idx = state.people.findIndex(p => p.name === action.name);
            const el  = document.getElementById(`truth-person-${idx}`);
            if (!el) return;
            anime({ targets: el, scale: [0.95, 1.06, 1], duration: 600, easing: 'easeOutBack' });
        }
    }

    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;
        const targets = state.people
            .map((_, i) => document.getElementById(`truth-person-${i}`))
            .filter(Boolean);
        anime({ targets, translateY: [12, 0], opacity: [0, 1], delay: anime.stagger(120), duration: 380, easing: 'easeOutQuart' });
    }
}

const truthVisualizer = new TruthVisualizer('visualizationArea');
