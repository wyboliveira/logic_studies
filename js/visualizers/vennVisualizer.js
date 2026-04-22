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

        const hlClass = (region) => highlighted.includes(region) ? ' venn-highlighted' : '';
        const fmt = (v) => v === null ? '?' : v;

        const html = `
            <div class="venn-container">
                <div class="venn-diagram">
                    <div class="venn-circle venn-circle-a${hlClass('only_A')}">
                        <span class="venn-label-inside">${labelA}</span>
                        <span class="venn-region-value" data-region="only_A">${fmt(only_A)}</span>
                    </div>
                    <div class="venn-overlap${hlClass('both')}">
                        <span class="venn-region-value" data-region="both">${fmt(both)}</span>
                    </div>
                    <div class="venn-circle venn-circle-b${hlClass('only_B')}">
                        <span class="venn-label-inside">${labelB}</span>
                        <span class="venn-region-value" data-region="only_B">${fmt(only_B)}</span>
                    </div>
                </div>
                <div class="venn-neither${hlClass('neither')}">
                    <span class="venn-neither-label">Nenhum dos dois</span>
                    <span class="venn-region-value" data-region="neither">${fmt(neither)}</span>
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
            anime({ targets: el, scale: [0.5, 1.15, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack' });
        }

        if (action.type === 'highlight') {
            const regionMap = { only_A: '.venn-circle-a', both: '.venn-overlap', only_B: '.venn-circle-b', neither: '.venn-neither' };
            const sel = regionMap[action.region];
            if (!sel) return;
            const el = this.container.querySelector(sel);
            if (!el) return;
            anime({ targets: el, scale: [1, 1.05, 1], duration: 400, easing: 'easeOutQuart' });
        }
    }

    animateSolutionReveal(state) {
        if (typeof anime === 'undefined') return;
        const targets = this.container.querySelectorAll('.venn-region-value');
        anime({ targets, scale: [0, 1], opacity: [0, 1], delay: anime.stagger(100), duration: 400, easing: 'easeOutBack' });
    }
}

const vennVisualizer = new VennVisualizer('visualizationArea');
