/**
 * Logic Studies - Feedback Modal
 * "Envie Sua Dúvida" — title + message + optional attachments
 *
 * To wire up real email delivery, integrate EmailJS:
 *   1. Create a free account at https://www.emailjs.com
 *   2. Add a Gmail service and create a template
 *   3. Replace the _send() stub below with an emailjs.send() call
 */

class FeedbackModal {
    constructor() {
        this._modal      = null;
        this._form       = null;
        this._files      = [];
    }

    init() {
        this._modal = document.getElementById('feedbackModal');
        this._form  = document.getElementById('feedbackForm');

        // Open triggers
        document.querySelectorAll('[data-open-feedback]').forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });

        // Close on backdrop click
        if (this._modal) {
            this._modal.addEventListener('click', (e) => {
                if (e.target === this._modal) this.close();
            });
        }

        // Close button (×)
        document.getElementById('feedbackCloseBtn')
            ?.addEventListener('click', () => this.close());

        // Cancel button
        document.getElementById('feedbackCancelBtn')
            ?.addEventListener('click', () => this.close());

        // Success close
        document.getElementById('feedbackSuccessClose')
            ?.addEventListener('click', () => this.close());

        // File input
        const fileInput   = document.getElementById('feedbackAttachments');
        const dropZone    = document.getElementById('fileDropZone');

        if (fileInput) {
            fileInput.addEventListener('change', () => {
                this._addFiles(Array.from(fileInput.files));
                fileInput.value = '';
            });
        }

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                this._addFiles(Array.from(e.dataTransfer.files));
            });
        }

        // Form submit
        if (this._form) {
            this._form.addEventListener('submit', (e) => {
                e.preventDefault();
                this._submit();
            });
        }

        // Escape key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._modal && !this._modal.classList.contains('hidden')) {
                this.close();
            }
        });
    }

    open() {
        if (!this._modal) return;
        this._reset();
        this._modal.classList.remove('hidden');
        this._modal.setAttribute('aria-hidden', 'false');
        // Focus first input
        setTimeout(() => document.getElementById('feedbackTitle')?.focus(), 50);
    }

    close() {
        if (!this._modal) return;
        this._modal.classList.add('hidden');
        this._modal.setAttribute('aria-hidden', 'true');
        this._reset();
    }

    _reset() {
        if (this._form) this._form.reset();
        this._files = [];
        this._renderFileList();
        document.getElementById('feedbackForm')?.classList.remove('hidden');
        document.getElementById('feedbackSuccess')?.classList.add('hidden');
        document.getElementById('feedbackSendBtn')
            && (document.getElementById('feedbackSendBtn').disabled = false);
        document.getElementById('feedbackSendBtn')
            && (document.getElementById('feedbackSendBtn').textContent = 'Enviar Mensagem ✉️');
    }

    _addFiles(newFiles) {
        newFiles.forEach(f => {
            // Avoid duplicates by name+size
            const exists = this._files.some(x => x.name === f.name && x.size === f.size);
            if (!exists) this._files.push(f);
        });
        this._renderFileList();
    }

    _renderFileList() {
        const list = document.getElementById('fileList');
        if (!list) return;

        if (this._files.length === 0) {
            list.innerHTML = '';
            return;
        }

        list.innerHTML = this._files.map((f, i) => `
            <div class="file-item">
                <span class="file-icon" aria-hidden="true">${this._fileIcon(f)}</span>
                <span class="file-name">${this._escapeHtml(f.name)}</span>
                <span class="file-size">${this._formatSize(f.size)}</span>
                <button type="button" class="file-remove" aria-label="Remover ${this._escapeHtml(f.name)}" data-index="${i}">×</button>
            </div>
        `).join('');

        list.querySelectorAll('.file-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this._files.splice(parseInt(btn.dataset.index), 1);
                this._renderFileList();
            });
        });
    }

    _fileIcon(file) {
        if (file.type.startsWith('image/')) return '🖼️';
        if (file.type === 'application/pdf') return '📄';
        return '📎';
    }

    _formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    _escapeHtml(str) {
        return str.replace(/[&<>"']/g, c =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
        );
    }

    _submit() {
        const titleEl   = document.getElementById('feedbackTitle');
        const messageEl = document.getElementById('feedbackMessage');
        const sendBtn   = document.getElementById('feedbackSendBtn');

        const title   = titleEl?.value.trim();
        const message = messageEl?.value.trim();

        if (!title || !message) return;

        // Loading state
        if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Enviando…'; }

        this._send({ title, message, files: this._files })
            .then(() => {
                document.getElementById('feedbackForm')?.classList.add('hidden');
                document.getElementById('feedbackSuccess')?.classList.remove('hidden');
            })
            .catch(() => {
                if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Enviar Mensagem ✉️'; }
                toast.error('Erro ao enviar. Tente novamente.');
            });
    }

    _send({ title, message, files }) {
        /*
         * TODO: replace this stub with real delivery via EmailJS:
         *
         * return emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
         *     subject:  title,
         *     message:  message,
         *     filenames: files.map(f => f.name).join(', '),
         * }, 'PUBLIC_KEY');
         *
         * See https://www.emailjs.com/docs/
         */
        return new Promise(resolve => setTimeout(resolve, 900));
    }
}

const feedbackModal = new FeedbackModal();
