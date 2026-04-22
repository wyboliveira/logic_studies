/**
 * Logic Studies - Venn Diagram Visualizer
 * Renders two-set Venn diagrams with region counts and highlights
 */

class VennVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        if (!this.container) return;
        const { labelA = 'A', labelB = 'B', only_A = null, both = null, only_B = null, neither = null, infos = [], highlighted = [] } = state;

        const hlClass = (region) => highlighted.includes(region) ? ' venn-hl' : '';
        const fmt = (v) => v === null ? '?' : v;

        const html = `
            <div class="venn-container">
                <div class="venn-stage">
                    <!-- Circle backgrounds (visual only) -->
                    <div class="venn-circle-bg venn-bg-a${hlClass('only_A')}"></div>
                    <div class="venn-circle-bg venn-bg-b${hlClass('only_B')}"></div>

                    <!-- Labels: diagonal from center toward each circle's edge -->
                    <span class="venn-label venn-label-a">${labelA}</span>
                    <span class="venn-label venn-label-b">${labelB}</span>

                    <!-- Region values: explicitly positioned in their region -->
                    <span class="venn-val venn-val-a${hlClass('only_A')}" data-region="only_A">${fmt(only_A)}</span>
                    <span class="venn-val venn-val-both${hlClass('both')}" data-region="both">${fmt(both)}</span>
                    <span class="venn-val venn-val-b${hlClass('only_B')}" data-region="only_B">${fmt(only_B)}</span>
                </div>
                <div class="venn-neither${hlClass('neither')}">
                    <span class="venn-neither-label">Nenhum dos dois</span>
                    <span class="venn-val" data-region="neither">${fmt(neither)}</span>
                </div>
                ${infos.length > 0 ? `<div class="venn-infos">${infos.map(i => `<div class="venn-info-item">${i}</div>`).join('')}</div>` : ''}
            </div>
        `;

        this.container.innerHTML = html;
    }

    applyAnimation(action, state, _prevState) {
        if (typeof anime === 'undefined') return;

        if (action.type === 'fill') {
            const el = this.container.querySelector(`[data-region="${action.region}"]`);
            if (!el) return;
            anime({ targets: el, scale: [0.4, 1.2, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack' });
        }

        if (action.type === 'highlight') {
            const regionMap = { only_A: '.venn-bg-a', both: '.venn-val-both', only_B: '.venn-bg-b', neither: '.venn-neither' };
            const sel = regionMap[action.region];
            if (!sel) return;
            const el = this.container.querySelector(sel);
            if (!el) return;
            anime({ targets: el, scale: [1, 1.08, 1], duration: 400, easing: 'easeOutQuart' });
        }
    }

    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;
        const targets = this.container.querySelectorAll('.venn-region-value');
        anime({ targets, scale: [0, 1], opacity: [0, 1], delay: anime.stagger(100), duration: 400, easing: 'easeOutBack' });
    }
}

const vennVisualizer = new VennVisualizer('visualizationArea');
