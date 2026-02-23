(function () {
  const style = document.createElement('style');
  style.textContent = `
    #kodai-chat-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(0, 212, 255, 0.35);
      z-index: 9999;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #kodai-chat-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 32px rgba(0, 212, 255, 0.5);
    }
    #kodai-chat-btn svg { width: 24px; height: 24px; fill: white; }

    #kodai-chat-panel {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 360px;
      height: 500px;
      background: #0e0e1f;
      border: 1px solid #1c1c3a;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      z-index: 9998;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      transform-origin: bottom right;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
    }
    #kodai-chat-panel.kodai-hidden {
      transform: scale(0.8);
      opacity: 0;
      pointer-events: none;
    }

    .kodai-header {
      padding: 14px 18px;
      background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08));
      border-bottom: 1px solid #1c1c3a;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .kodai-header-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .kodai-header-name { font-size: 14px; font-weight: 800; color: #f8fafc; }
    .kodai-header-status {
      font-size: 11px;
      color: #4ade80;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 1px;
    }
    .kodai-header-status::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }
    .kodai-header-close {
      margin-left: auto;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      padding: 4px;
      transition: color 0.2s;
    }
    .kodai-header-close:hover { color: #f8fafc; }

    .kodai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .kodai-messages::-webkit-scrollbar { width: 4px; }
    .kodai-messages::-webkit-scrollbar-track { background: transparent; }
    .kodai-messages::-webkit-scrollbar-thumb { background: #1c1c3a; border-radius: 2px; }

    .kodai-msg {
      max-width: 86%;
      padding: 9px 13px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
    .kodai-bot {
      background: #13132a;
      color: #f8fafc;
      border: 1px solid #1c1c3a;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .kodai-user {
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .kodai-typing {
      background: #13132a;
      border: 1px solid #1c1c3a;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 11px 14px;
    }
    .kodai-dot {
      width: 6px;
      height: 6px;
      background: #64748b;
      border-radius: 50%;
      animation: kodaiDot 1.2s infinite;
    }
    .kodai-dot:nth-child(2) { animation-delay: 0.2s; }
    .kodai-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes kodaiDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    .kodai-input-wrap {
      padding: 10px 14px;
      border-top: 1px solid #1c1c3a;
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    .kodai-input {
      flex: 1;
      background: #13132a;
      border: 1px solid #1c1c3a;
      border-radius: 12px;
      padding: 9px 13px;
      color: #f8fafc;
      font-size: 13px;
      outline: none;
      resize: none;
      font-family: inherit;
      max-height: 80px;
      line-height: 1.4;
      transition: border-color 0.2s;
    }
    .kodai-input:focus { border-color: #00d4ff; }
    .kodai-input::placeholder { color: #64748b; }
    .kodai-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s;
    }
    .kodai-send:hover { opacity: 0.85; }
    .kodai-send svg { width: 15px; height: 15px; fill: white; }
    .kodai-send:disabled { opacity: 0.35; cursor: not-allowed; }

    @media (max-width: 420px) {
      #kodai-chat-panel { width: calc(100vw - 32px); right: 16px; bottom: 80px; }
      #kodai-chat-btn { right: 16px; bottom: 16px; }
    }

    /* POPUP */
    #kodai-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: kodaiFadeIn 0.3s ease;
    }
    #kodai-popup-overlay.kodai-hidden { display: none; }
    @keyframes kodaiFadeIn { from { opacity: 0; } to { opacity: 1; } }

    #kodai-popup {
      background: #0e0e1f;
      border: 1px solid #1c1c3a;
      border-radius: 24px;
      padding: 40px 36px;
      max-width: 440px;
      width: calc(100vw - 40px);
      text-align: center;
      position: relative;
      animation: kodaiPopIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0,212,255,0.1);
    }
    @keyframes kodaiPopIn {
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    #kodai-popup-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 4px 8px;
      transition: color 0.2s;
    }
    #kodai-popup-close:hover { color: #f8fafc; }
    .kodai-popup-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .kodai-popup-title {
      font-size: 22px;
      font-weight: 900;
      color: #f8fafc;
      margin-bottom: 10px;
      line-height: 1.3;
    }
    .kodai-popup-sub {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .kodai-popup-btns {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .kodai-popup-btn-primary {
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      color: #fff;
      border: none;
      border-radius: 99px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.2s;
    }
    .kodai-popup-btn-primary:hover { opacity: 0.85; }
    .kodai-popup-btn-ghost {
      background: transparent;
      color: #64748b;
      border: none;
      border-radius: 99px;
      padding: 12px 20px;
      font-size: 13px;
      cursor: pointer;
      transition: color 0.2s;
    }
    .kodai-popup-btn-ghost:hover { color: #f8fafc; }
  `;
  document.head.appendChild(style);

  const ICON_CHAT = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
  const ICON_CLOSE = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
  const ICON_SEND = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;

  const btn = document.createElement('button');
  btn.id = 'kodai-chat-btn';
  btn.setAttribute('aria-label', 'Ouvrir le chat');
  btn.innerHTML = ICON_CHAT;

  const panel = document.createElement('div');
  panel.id = 'kodai-chat-panel';
  panel.classList.add('kodai-hidden');
  panel.innerHTML = `
    <div class="kodai-header">
      <div class="kodai-header-avatar">🤖</div>
      <div>
        <div class="kodai-header-name">Assistant KodAI</div>
        <div class="kodai-header-status">En ligne</div>
      </div>
      <button class="kodai-header-close" id="kodaiClose">✕</button>
    </div>
    <div class="kodai-messages" id="kodaiMsgs"></div>
    <div class="kodai-input-wrap">
      <textarea class="kodai-input" id="kodaiInput" placeholder="Posez votre question..." rows="1"></textarea>
      <button class="kodai-send" id="kodaiSend">${ICON_SEND}</button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const history = [];
  let open = false;
  let loading = false;

  addBot("Bonjour. Je suis l'assistant de KodAI. Comment puis-je vous aider?");

  function addBot(text) {
    history.push({ role: 'assistant', content: text });
    render();
  }

  function render() {
    const c = document.getElementById('kodaiMsgs');
    if (!c) return;
    c.innerHTML = history.map(m =>
      `<div class="kodai-msg ${m.role === 'user' ? 'kodai-user' : 'kodai-bot'}">${m.content.replace(/\n/g, '<br>')}</div>`
    ).join('');
    c.scrollTop = c.scrollHeight;
  }

  function showTyping() {
    const c = document.getElementById('kodaiMsgs');
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'kodai-msg kodai-typing';
    el.id = 'kodaiTyping';
    el.innerHTML = '<div class="kodai-dot"></div><div class="kodai-dot"></div><div class="kodai-dot"></div>';
    c.appendChild(el);
    c.scrollTop = c.scrollHeight;
  }

  function hideTyping() {
    document.getElementById('kodaiTyping')?.remove();
  }

  async function send() {
    const input = document.getElementById('kodaiInput');
    const sendBtn = document.getElementById('kodaiSend');
    if (!input || loading) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    history.push({ role: 'user', content: text });
    render();

    loading = true;
    if (sendBtn) sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(history.findIndex(m => m.role === 'user')).slice(-10) }),
      });
      const data = await res.json();
      hideTyping();
      addBot(data.message || "Désolé, une erreur est survenue. Contactez-nous à info@kodai.ca");
    } catch {
      hideTyping();
      addBot("Désolé, une erreur est survenue. Contactez-nous directement à info@kodai.ca");
    } finally {
      loading = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function toggle() {
    open = !open;
    panel.classList.toggle('kodai-hidden', !open);
    btn.innerHTML = open ? ICON_CLOSE : ICON_CHAT;
    if (open) setTimeout(() => document.getElementById('kodaiInput')?.focus(), 300);
  }

  btn.addEventListener('click', toggle);
  document.getElementById('kodaiClose')?.addEventListener('click', toggle);
  document.getElementById('kodaiSend')?.addEventListener('click', send);
  document.getElementById('kodaiInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  document.getElementById('kodaiInput')?.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
  });

  // ===== POPUP =====
  if (!sessionStorage.getItem('kodai_popup_seen')) {
    const overlay = document.createElement('div');
    overlay.id = 'kodai-popup-overlay';
    overlay.innerHTML = `
      <div id="kodai-popup">
        <button id="kodai-popup-close">✕</button>
        <div class="kodai-popup-icon">🚀</div>
        <div class="kodai-popup-title">Votre idée mérite<br>d'exister.</div>
        <div class="kodai-popup-sub">Site web, agent IA, automatisation — on livre vite,<br>sans jargon technique. Soumission gratuite.</div>
        <div class="kodai-popup-btns">
          <button class="kodai-popup-btn-primary" id="kodaiPopupChat">Parler à l'assistant →</button>
          <button class="kodai-popup-btn-ghost" id="kodaiPopupDismiss">Plus tard</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function closePopup() {
      sessionStorage.setItem('kodai_popup_seen', '1');
      overlay.style.display = 'none';
    }

    document.getElementById('kodai-popup-close')?.addEventListener('click', closePopup);
    document.getElementById('kodaiPopupDismiss')?.addEventListener('click', closePopup);
    overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });

    document.getElementById('kodaiPopupChat')?.addEventListener('click', () => {
      closePopup();
      if (!open) toggle();
    });

    setTimeout(() => { overlay.style.display = 'flex'; }, 5000);
    overlay.style.display = 'none';
  }
})();
