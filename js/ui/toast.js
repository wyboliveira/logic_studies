/**
 * Logic Studies - Toast Notifications
 * Lightweight user-facing error and info messages
 */

class Toast {
    constructor() {
        this.container = null;
    }

    init() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info', duration = 4000) {
        if (!this.container) return;

        const icons = { error: '⚠️', success: '✅', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] ?? icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Fechar">×</button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => this._dismiss(toast));
        this.container.appendChild(toast);

        if (typeof anime !== 'undefined') {
            anime({ targets: toast, translateX: [80, 0], opacity: [0, 1], duration: 350, easing: 'easeOutQuart' });
        } else {
            toast.style.opacity = '1';
        }

        if (duration > 0) setTimeout(() => this._dismiss(toast), duration);
    }

    _dismiss(toast) {
        if (!toast.parentElement) return;
        if (typeof anime !== 'undefined') {
            anime({
                targets: toast,
                translateX: [0, 80],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => toast.remove()
            });
        } else {
            toast.remove();
        }
    }

    error(msg, duration) { this.show(msg, 'error', duration); }
    success(msg, duration) { this.show(msg, 'success', duration); }
    info(msg, duration) { this.show(msg, 'info', duration); }
}

const toast = new Toast();
