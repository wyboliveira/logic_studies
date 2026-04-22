/**
 * Logic Studies - Proposition Visualizer
 * Renders logical arguments: premises → conclusion, with validity indicator
 */

class PropositionVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        if (!this.container) return;
        const { statements = [], infos = [] } = state;

        let html = '<div class="prop-container">';

        statements.forEach((s, i) => {
            const typeClass  = s.type === 'conclusion' ? ' prop-conclusion' : ' prop-premise';
            const activeClass = s.active ? ' active' : '';
            const label      = s.label || (s.type === 'conclusion' ? 'Conclusão' : `Premissa ${i + 1}`);

            let badge = '';
            if (s.type === 'conclusion' && s.valid !== null) {
                badge = s.valid
                    ? '<span class="prop-valid-badge">✓ Argumento Válido</span>'
                    : '<span class="prop-invalid-badge">✗ Falácia Lógica</span>';
            }

            html += `
                <div id="prop-stmt-${i}" class="prop-statement${typeClass}${activeClass}">
                    <span class="prop-label">${label}</span>
                    <p class="prop-text">${s.text}</p>
                    ${badge}
                </div>
            `;

            // Connector arrow between premises and before conclusion
            if (s.type === 'premise' && i < statements.length - 2) {
                html += '<div class="prop-connector" aria-hidden="true">↓</div>';
            }
            if (s.type === 'premise' && statements[i + 1]?.type === 'conclusion') {
                html += '<div class="prop-therefore" aria-hidden="true">∴</div>';
            }
        });

        if (infos.length > 0) {
            html += '<div class="prop-infos">';
            infos.forEach(info => { html += `<div class="prop-info-item">${info}</div>`; });
            html += '</div>';
        }

        html += '</div>';
        this.container.innerHTML = html;
    }

    applyAnimation(action, state, _prevState) {
        if (typeof anime === 'undefined') return;

        if (action.type === 'activate') {
            const idx = state.statements.findIndex(s => s.id === action.id);
            const el  = document.getElementById(`prop-stmt-${idx}`);
            if (!el) return;
            anime({ targets: el, translateX: [-8, 0], opacity: [0.4, 1], duration: 400, easing: 'easeOutQuart' });
        }

        if (action.type === 'validate') {
            const idx = state.statements.findIndex(s => s.id === action.id);
            const el  = document.getElementById(`prop-stmt-${idx}`);
            if (!el) return;
            anime({ targets: el, scale: [0.95, 1.04, 1], duration: 600, easing: 'easeOutBack' });
        }
    }

    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;
        const targets = state.statements
            .map((_, i) => document.getElementById(`prop-stmt-${i}`))
            .filter(Boolean);
        anime({ targets, translateY: [12, 0], opacity: [0, 1], delay: anime.stagger(120), duration: 380, easing: 'easeOutQuart' });
    }
}

const propositionVisualizer = new PropositionVisualizer('visualizationArea');
