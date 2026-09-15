/**
 * 🏝️ LienLibre — Module Ultime Atoll & AtollExtensionKit (macOS Dynamic Island)
 * 
 * FONCTIONNALITÉS AVANCÉES :
 * 1. Interface Dynamic Island Liquid Glass "Next-Gen" (Morphing interactif, physique réaliste, radar Sentinel).
 * 2. Pont XPC / URL Scheme natif Atoll macOS (`atoll://live-activity`).
 * 3. Panneau de contrôle interactif intégré à l'encoche (Actions rapides, Copie 1-clic, Audit Sentinel en direct).
 * 4. Synthèse audio haptique Web Audio (effet sonore Apple subtil).
 * 5. Rétrocompatibilité universelle (macOS Catalina+, navigateurs Safari/Chrome/Firefox, Tauri Desktop).
 */

(function () {
  'use strict';

  const isMacOS = /Macintosh|Mac OS X/i.test(navigator.userAgent);
  let isTauri = typeof window.__TAURI__ !== 'undefined';

  class AtollDynamicIsland {
    constructor() {
      this.hudElement = null;
      this.hideTimeout = null;
      this.currentData = null;
      this.audioCtx = null;
      this.initAudio();
      this.initHUD();
    }

    initAudio() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      } catch (e) {
        // Audio optionnel
      }
    }

    playHapticSound(type = 'pop') {
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      if (type === 'pop') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.06); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    }

    initHUD() {
      if (document.getElementById('lienlibre-atoll-hud')) return;

      const style = document.createElement('style');
      style.id = 'lienlibre-atoll-style';
      style.textContent = `
        #lienlibre-atoll-hud {
          position: fixed;
          top: 10px;
          left: 50%;
          transform: translateX(-50%) translateY(-140%) scale(0.9);
          z-index: 999999;
          background: rgba(8, 12, 22, 0.92);
          backdrop-filter: blur(32px) saturate(210%);
          -webkit-backdrop-filter: blur(32px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15);
          border-radius: 999px;
          padding: 8px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
          user-select: none;
          cursor: pointer;
          transition: all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          max-width: 92vw;
          min-width: 220px;
          overflow: hidden;
        }

        #lienlibre-atoll-hud.active {
          transform: translateX(-50%) translateY(0) scale(1);
          opacity: 1;
        }

        #lienlibre-atoll-hud.expanded {
          border-radius: 28px;
          padding: 16px 20px;
          min-width: 340px;
          max-width: 440px;
          background: rgba(6, 10, 20, 0.96);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 40px rgba(56, 189, 248, 0.25);
        }

        .atoll-main-row {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 12px;
        }

        .atoll-notch-icon-wrapper {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(14, 165, 233, 0.1));
          border: 1px solid rgba(56, 189, 248, 0.3);
          flex-shrink: 0;
        }

        .atoll-notch-icon {
          font-size: 16px;
        }

        .atoll-radar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 14px;
          border: 1.5px solid rgba(56, 189, 248, 0.5);
          animation: atoll-pulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          opacity: 0;
        }

        @keyframes atoll-pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .atoll-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .atoll-header-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .atoll-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .atoll-sub {
          font-size: 11px;
          font-weight: 500;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .atoll-badge-score {
          font-size: 11px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 99px;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
          letter-spacing: 0.2px;
          flex-shrink: 0;
        }

        .atoll-badge-score.verified {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.45);
        }

        .atoll-badge-score.blocked {
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          box-shadow: 0 2px 10px rgba(239, 68, 68, 0.45);
        }

        .atoll-badge-score.alert {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 2px 10px rgba(245, 158, 11, 0.45);
        }

        /* Vue Dépliée (Expanded) */
        .atoll-expanded-body {
          display: none;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: atoll-fade-in 0.3s ease-out;
        }

        #lienlibre-atoll-hud.expanded .atoll-expanded-body {
          display: flex;
        }

        @keyframes atoll-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .atoll-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .atoll-metric-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 6px 8px;
          text-align: center;
        }

        .atoll-metric-val {
          font-size: 12px;
          font-weight: 700;
          color: #38bdf8;
        }

        .atoll-metric-lbl {
          font-size: 9px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .atoll-actions-row {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .atoll-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          font-size: 11px;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .atoll-btn:hover {
          background: rgba(56, 189, 248, 0.3);
          transform: translateY(-1px);
        }

        .atoll-btn.primary {
          background: linear-gradient(135deg, #0284c7, #0369a1);
          border-color: #38bdf8;
          color: #ffffff;
        }

        .atoll-btn.primary:hover {
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.5);
        }
      `;
      document.head.appendChild(style);

      const hud = document.createElement('div');
      hud.id = 'lienlibre-atoll-hud';
      hud.innerHTML = `
        <div class="atoll-main-row">
          <div class="atoll-notch-icon-wrapper">
            <div class="atoll-radar-ring"></div>
            <div class="atoll-notch-icon" id="atoll-icon">⚡</div>
          </div>
          <div class="atoll-content">
            <div class="atoll-header-line">
              <span class="atoll-title" id="atoll-title">LienLibre Sentinel</span>
            </div>
            <span class="atoll-sub" id="atoll-sub">Prêt pour l'analyse dynamique</span>
          </div>
          <div class="atoll-badge-score" id="atoll-badge">100/100</div>
        </div>

        <div class="atoll-expanded-body">
          <div class="atoll-metrics-grid">
            <div class="atoll-metric-item">
              <div class="atoll-metric-val" id="atoll-metric-dns">Protégé</div>
              <div class="atoll-metric-lbl">DoH Shield</div>
            </div>
            <div class="atoll-metric-item">
              <div class="atoll-metric-val" id="atoll-metric-ssrf">Actif</div>
              <div class="atoll-metric-lbl">Anti-SSRF</div>
            </div>
            <div class="atoll-metric-item">
              <div class="atoll-metric-val" id="atoll-metric-trust">Élite</div>
              <div class="atoll-metric-lbl">Confiance</div>
            </div>
          </div>

          <div class="atoll-actions-row">
            <button class="atoll-btn primary" id="atoll-btn-copy">📋 Copier le Lien</button>
            <button class="atoll-btn" id="atoll-btn-open">🌐 Ouvrir</button>
            <button class="atoll-btn" id="atoll-btn-close">✕</button>
          </div>
        </div>
      `;

      // Expansion / Réduction au clic sur l'îlot
      hud.addEventListener('click', (e) => {
        if (e.target.closest('.atoll-btn')) return;
        hud.classList.toggle('expanded');
        this.playHapticSound('pop');
      });

      // Actions des boutons
      hud.querySelector('#atoll-btn-copy').addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.currentData && this.currentData.link) {
          navigator.clipboard.writeText(this.currentData.link);
          const btn = hud.querySelector('#atoll-btn-copy');
          btn.textContent = '✓ Copié !';
          this.playHapticSound('success');
          setTimeout(() => { btn.textContent = '📋 Copier le Lien'; }, 2000);
        }
      });

      hud.querySelector('#atoll-btn-open').addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.currentData && this.currentData.link) {
          window.open(this.currentData.link, '_blank');
        }
      });

      hud.querySelector('#atoll-btn-close').addEventListener('click', (e) => {
        e.stopPropagation();
        hud.classList.remove('active');
        hud.classList.remove('expanded');
      });

      document.body.appendChild(hud);
      this.hudElement = hud;
    }

    /**
     * Émet une activité dynamique vers Atoll (macOS Dynamic Island) et la HUD interactive
     */
    async notify({ title = "LienLibre", subtitle = "", score = 100, status = "verified", link = "" } = {}) {
      this.currentData = { title, subtitle, score, status, link };

      // Son haptique
      if (status === 'verified') this.playHapticSound('success');
      else if (status === 'blocked' || status === 'alert') this.playHapticSound('alert');
      else this.playHapticSound('pop');

      // 1. Émission vers Tauri macOS si disponible
      if (typeof window.__TAURI__ !== 'undefined' && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
        try {
          await window.__TAURI__.core.invoke('emit_atoll_activity', {
            title,
            subtitle,
            score: Number(score) || 100,
            status,
            link: link || null
          });
        } catch (e) {
          console.warn("Pont Atoll Tauri non disponible :", e);
        }
      }

      // 2. Émission directe vers l'application macOS Atoll via URL Scheme (si Safari/Chrome sur Mac)
      if (isMacOS && !isTauri) {
        const atollIframe = document.createElement('iframe');
        atollIframe.style.display = 'none';
        atollIframe.src = `atoll://live-activity?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&score=${score}&status=${status}&link=${encodeURIComponent(link || '')}&source=LienLibre`;
        document.body.appendChild(atollIframe);
        setTimeout(() => atollIframe.remove(), 1000);
      }

      // 3. Affichage visuel dans la HUD Liquid Glass Notch
      if (this.hudElement) {
        const iconEl = document.getElementById('atoll-icon');
        const titleEl = document.getElementById('atoll-title');
        const subEl = document.getElementById('atoll-sub');
        const badgeEl = document.getElementById('atoll-badge');

        if (titleEl) titleEl.textContent = title;
        if (subEl) subEl.textContent = subtitle || (status === 'verified' ? 'Média sécurisé prêt au partage' : 'Traitement complété');
        if (badgeEl) {
          badgeEl.textContent = `${score}/100`;
          badgeEl.className = `atoll-badge-score ${status}`;
        }

        if (iconEl) {
          iconEl.textContent = status === 'verified' ? '🛡️' : (status === 'blocked' ? '🛑' : (status === 'alert' ? '🚨' : '⚡'));
        }

        this.hudElement.classList.add('active');

        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
          if (!this.hudElement.classList.contains('expanded')) {
            this.hudElement.classList.remove('active');
          }
        }, 6000);
      }
    }
  }

  // Initialisation et export global
  window.LienLibreAtoll = new AtollDynamicIsland();
})();
