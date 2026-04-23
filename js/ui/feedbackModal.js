/**
 * Logic Studies - Feedback Modal
 * "Envie Sua Dúvida" — title + message + optional attachments via EmailJS
 *
 * ── EmailJS setup ──────────────────────────────────────────────────────────────
 * 1. Create a free account at https://www.emailjs.com
 * 2. Add a Gmail service → note the Service ID
 * 3. Create a template with the following variables:
 *      {{subject}}       — email subject (the title field)
 *      {{message}}       — plain-text message body
 *      {{{body_html}}}   — HTML body with embedded images (triple braces = unescaped HTML)
 *    Set "To email" to your address (e.g. wbfoliveira@gmail.com)
 * 4. Copy the Service ID, Template ID and Public Key below.
 * ──────────────────────────────────────────────────────────────────────────────
 */

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'AbCdEfGhIjKlMnOp'

// Images under this limit are embedded as base64; larger files are listed by name only.
const MAX_EMBED_BYTES = 300 * 1024; // 300 KB

class FeedbackModal {
    constructor() {
        this._modal = null;
        this._form  = null;
        this._files = [];
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
        const fileInput = document.getElementById('feedbackAttachments');
        const dropZone  = document.getElementById('fileDropZone');

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
        const sendBtn = document.getElementById('feedbackSendBtn');
        if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Enviar Mensagem ✉️'; }
    }

    _addFiles(newFiles) {
        newFiles.forEach(f => {
            const exists = this._files.some(x => x.name === f.name && x.size === f.size);
            if (!exists) this._files.push(f);
        });
        this._renderFileList();
    }

    _renderFileList() {
        const list = document.getElementById('fileList');
        if (!list) return;

        if (this._files.length === 0) { list.innerHTML = ''; return; }

        list.innerHTML = this._files.map((f, i) => {
            const embeddable = f.type.startsWith('image/') && f.size <= MAX_EMBED_BYTES;
            const badge = f.type.startsWith('image/')
                ? (embeddable
                    ? '<span class="file-embed-badge file-embed-yes">será incorporada</span>'
                    : '<span class="file-embed-badge file-embed-no">nome apenas</span>')
                : '';
            return `
                <div class="file-item">
                    <span class="file-icon" aria-hidden="true">${this._fileIcon(f)}</span>
                    <span class="file-name">${this._escapeHtml(f.name)}</span>
                    ${badge}
                    <span class="file-size">${this._formatSize(f.size)}</span>
                    <button type="button" class="file-remove" aria-label="Remover ${this._escapeHtml(f.name)}" data-index="${i}">×</button>
                </div>`;
        }).join('');

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

    _fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload  = () => resolve(reader.result); // data URI
            reader.onerror = () => reject(new Error(`Falha ao ler ${file.name}`));
            reader.readAsDataURL(file);
        });
    }

    _submit() {
        const titleEl   = document.getElementById('feedbackTitle');
        const messageEl = document.getElementById('feedbackMessage');
        const sendBtn   = document.getElementById('feedbackSendBtn');

        const title   = titleEl?.value.trim();
        const message = messageEl?.value.trim();
        if (!title || !message) return;

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

    async _send({ title, message, files }) {
        // Separate images that can be embedded from the rest
        const embeddable = files.filter(f => f.type.startsWith('image/') && f.size <= MAX_EMBED_BYTES);
        const nameOnly   = files.filter(f => !f.type.startsWith('image/') || f.size > MAX_EMBED_BYTES);

        // Convert embeddable images to base64 data URIs
        const dataUris = await Promise.all(embeddable.map(f => this._fileToBase64(f)));

        // Build HTML body
        let bodyHtml = `<p>${this._escapeHtml(message).replace(/\n/g, '<br>')}</p>`;

        if (embeddable.length > 0) {
            bodyHtml += '<hr><p><strong>Imagens anexadas:</strong></p>';
            embeddable.forEach((f, i) => {
                bodyHtml += `<p><em>${this._escapeHtml(f.name)}</em></p>`;
                bodyHtml += `<img src="${dataUris[i]}" alt="${this._escapeHtml(f.name)}" style="max-width:600px;display:block;margin:8px 0;">`;
            });
        }

        if (nameOnly.length > 0) {
            bodyHtml += '<hr><p><strong>Outros arquivos (não incorporados):</strong></p><ul>';
            nameOnly.forEach(f => {
                bodyHtml += `<li>${this._escapeHtml(f.name)} (${this._formatSize(f.size)})</li>`;
            });
            bodyHtml += '</ul>';
        }

        // If EmailJS credentials are not configured, fall back to a resolved promise
        // so the success screen still appears during development.
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            console.warn('EmailJS not configured — simulating send. Fill in the EMAILJS_* constants in feedbackModal.js.');
            return new Promise(resolve => setTimeout(resolve, 800));
        }

        return emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                subject:   title,
                message:   message,
                body_html: bodyHtml,
            },
            EMAILJS_PUBLIC_KEY
        );
    }
}

const feedbackModal = new FeedbackModal();
