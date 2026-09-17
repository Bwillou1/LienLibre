/**
 * 🔗 LienLibre — Script Runtime Universel pour Médias & Journalistes
 * 
 * FONCTIONNALITÉS :
 * - Détection automatique de l'URL de l'article en cours (aucune action manuelle requise pour chaque article).
 * - Personnalisation intégrale : +30 paramètres (thèmes blanc/noir/verre/papier, couleurs d'accent, formats, textes, boutons sociaux).
 * - Nettoyage anti-tracking automatique (suppression des paramètres utm_*, fbclid, gclid, etc.).
 * - Partage multi-plateforme en 1 clic (Presse-papier, Web Share, Bluesky, Mastodon, X, Threads, WhatsApp, Liseuses E-Ink, QR Code).
 * - Mention d'utilisation équitable intégrée en petits caractères (art. 29 LDA Canada).
 * - Zéro dépendance, CSS encapsulé et respect absolu de la vie privée des lecteurs.
 */

(function () {
  'use strict';

  const LIENLIBRE_BASE = "https://bwillou1.github.io/LienLibre/";

  function playBadgeHapticSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.05); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  function cleanUrl(rawUrl) {
    try {
      const u = new URL(rawUrl);
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi',
        'igshid', 'twclid', 'yclid', 'zanpid', 'sc_customer', 's_kwcid'
      ];
      trackingParams.forEach(p => u.searchParams.delete(p));
      return u.toString().split('#')[0];
    } catch (_) {
      return (rawUrl || '').split('#')[0];
    }
  }

  function injectBadgeStyles() {
    if (document.getElementById('lienlibre-badge-global-css')) return;

    const style = document.createElement('style');
    style.id = 'lienlibre-badge-global-css';
    style.textContent = `
      .ll-widget-root {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        margin: 16px 0;
        max-width: 100%;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      .ll-widget-root * {
        box-sizing: border-box;
      }

      /* ================= THÈMES ================= */
      /* 1. Thème Sombre Pro */
      .ll-theme-dark {
        background: #090d16;
        color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      }
      /* 2. Thème Blanc Épuré (Presse) */
      .ll-theme-light {
        background: #ffffff;
        color: #0f172a;
        border: 1px solid #e2e8f0;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }
      /* 3. Thème Verre Dépoli (Glassmorphism) */
      .ll-theme-glass {
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
      }
      /* 4. Thème Papier Journal (Editorial) */
      .ll-theme-paper {
        background: #fbf8f1;
        color: #262626;
        border: 1px solid #dcd5c5;
        box-shadow: 0 6px 16px rgba(44, 38, 27, 0.08);
      }
      /* 5. Thème Auto / Adaptatif */
      @media (prefers-color-scheme: dark) {
        .ll-theme-auto {
          background: #090d16;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
      }
      @media (prefers-color-scheme: light) {
        .ll-theme-auto {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
      }

      /* ================= FORMATS ================= */
      /* Format Carte */
      .ll-format-card {
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        padding: 16px 20px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      /* Format Bannière */
      .ll-format-banner {
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        padding: 18px 24px;
        width: 100%;
      }
      /* Format Pilule */
      .ll-format-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      /* Format Compact */
      .ll-format-compact {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      /* Format Sticky Floating Bar */
      .ll-format-floating {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        padding: 14px 18px;
        max-width: 360px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
        animation: ll-slide-up 0.35s ease-out;
      }
      @keyframes ll-slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      /* ================= ÉLÉMENTS INTERNES ================= */
      .ll-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
      }
      .ll-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.2px;
      }
      .ll-shield-icon {
        font-size: 17px;
        line-height: 1;
      }
      .ll-tag {
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 99px;
        letter-spacing: 0.3px;
      }
      .ll-subtext {
        font-size: 12px;
        opacity: 0.82;
        margin-bottom: 12px;
        line-height: 1.45;
      }
      .ll-actions-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      /* Boutons */
      .ll-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        padding: 8px 14px;
        border-radius: 10px;
        cursor: pointer;
        border: none;
        outline: none;
        text-decoration: none;
        transition: all 0.18s ease;
        user-select: none;
      }
      .ll-btn:hover {
        transform: translateY(-1px);
      }
      .ll-btn:active {
        transform: scale(0.98);
      }

      /* Couleurs d'accent pour boutons primaires */
      .ll-accent-cyan {
        background: linear-gradient(135deg, #0284c7, #0369a1);
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
      }
      .ll-accent-emerald {
        background: linear-gradient(135deg, #059669, #047857);
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      }
      .ll-accent-purple {
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
      }
      .ll-accent-amber {
        background: linear-gradient(135deg, #d97706, #b45309);
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
      }
      .ll-accent-mono {
        background: #0f172a;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }
      .ll-theme-light .ll-accent-mono {
        background: #0f172a;
        color: #ffffff !important;
      }

      /* Boutons secondaires */
      .ll-btn-sec {
        background: rgba(255, 255, 255, 0.08);
        color: inherit !important;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .ll-theme-light .ll-btn-sec {
        background: #f1f5f9;
        color: #334155 !important;
        border: 1px solid #cbd5e1;
      }
      .ll-theme-paper .ll-btn-sec {
        background: #ede6d6;
        color: #262626 !important;
        border: 1px solid #d4cbb8;
      }
      .ll-btn-sec:hover {
        background: rgba(255, 255, 255, 0.18);
      }
      .ll-theme-light .ll-btn-sec:hover {
        background: #e2e8f0;
      }

      /* Boutons Réseaux Sociaux */
      .ll-socials-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        flex-wrap: wrap;
      }
      .ll-theme-light .ll-socials-bar {
        border-top-color: #e2e8f0;
      }
      .ll-social-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        font-size: 13px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: inherit;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .ll-theme-light .ll-social-btn {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
      .ll-social-btn:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.2);
      }
      .ll-theme-light .ll-social-btn:hover {
        background: #e2e8f0;
      }

      /* Mention Légale en petits caractères */
      .ll-legal-notice {
        margin-top: 10px;
        font-size: 10px;
        line-height: 1.35;
        opacity: 0.65;
        border-top: 1px dashed rgba(255, 255, 255, 0.15);
        padding-top: 8px;
      }
      .ll-theme-light .ll-legal-notice {
        border-top-color: #e2e8f0;
        opacity: 0.75;
      }
      .ll-legal-notice a {
        color: inherit;
        text-decoration: underline;
        font-weight: 600;
      }

      /* Feedback Toast */
      .ll-toast {
        display: none;
        font-size: 11px;
        font-weight: 700;
        color: #10b981;
        margin-left: 6px;
        animation: ll-pop 0.2s ease-out;
      }
      @keyframes ll-pop {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* QR Popover */
      .ll-qr-modal {
        display: none;
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        padding: 12px;
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        z-index: 99999;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  function renderBadge(container) {
    const targetUrl = cleanUrl(container.getAttribute('data-url') || window.location.href);
    const theme = container.getAttribute('data-theme') || 'dark'; // 'dark', 'light', 'glass', 'paper', 'auto'
    const format = container.getAttribute('data-style') || 'card'; // 'card', 'banner', 'pill', 'compact', 'floating'
    const accent = container.getAttribute('data-accent') || 'cyan'; // 'cyan', 'emerald', 'purple', 'amber', 'mono'
    const lang = container.getAttribute('data-lang') || (document.documentElement.lang || 'fr').slice(0, 2);
    const isEn = lang.startsWith('en');

    // Textes personnalisables
    const customTitle = container.getAttribute('data-title') || (isEn ? 'Free Citizen Sharing' : 'Partage Citoyen & Éducatif');
    const customSub = container.getAttribute('data-subtitle') || (isEn ? 'Share this article freely on social networks without tracking or blocking.' : 'Partagez cet article librement sur vos réseaux sociaux sans blocage ni mouchards publicitaires.');
    const customBtnText = container.getAttribute('data-btn-text') || (isEn ? 'Copy Clean Link' : 'Copier le lien propre');

    // Toggles de configuration
    const showShield = container.getAttribute('data-show-shield') !== 'false';
    const showTag = container.getAttribute('data-show-tag') !== 'false';
    const showCopy = container.getAttribute('data-show-copy') !== 'false';
    const showOpen = container.getAttribute('data-show-open') !== 'false';
    const showShare = container.getAttribute('data-show-share') !== 'false';
    const showSocials = container.getAttribute('data-show-socials') === 'true';
    const showEink = container.getAttribute('data-show-eink') === 'true';
    const showLegal = container.getAttribute('data-show-legal') !== 'false';
    const enableSound = container.getAttribute('data-sound') !== 'false';

    const encodedUrl = encodeURIComponent(targetUrl);
    const mirrorUrl = `${LIENLIBRE_BASE}?url=${encodedUrl}`;

    // Tag text & style
    const tagText = isEn ? 'Zero Tracking' : 'Lien Nettoyé';
    let tagStyleClass = 'll-accent-cyan';
    if (accent === 'emerald') tagStyleClass = 'll-accent-emerald';
    else if (accent === 'purple') tagStyleClass = 'll-accent-purple';
    else if (accent === 'amber') tagStyleClass = 'll-accent-amber';
    else if (accent === 'mono') tagStyleClass = 'll-accent-mono';

    // Rendu Format Pilule
    if (format === 'pill') {
      const pill = document.createElement('a');
      pill.className = `ll-widget-root ll-format-pill ll-theme-${theme} ${tagStyleClass}`;
      pill.href = mirrorUrl;
      pill.target = '_blank';
      pill.rel = 'noopener noreferrer';
      pill.title = isEn ? 'Share freely via LienLibre' : 'Partager librement via LienLibre';
      pill.innerHTML = `
        ${showShield ? '<span>🛡️</span>' : '<span>🔗</span>'}
        <span>${customTitle}</span>
        <span style="font-size: 11px; opacity: 0.85;">↗</span>
      `;
      container.innerHTML = '';
      container.appendChild(pill);
      return;
    }

    // Rendu Format Compact
    if (format === 'compact') {
      const compact = document.createElement('button');
      compact.type = 'button';
      compact.className = `ll-widget-root ll-format-compact ll-theme-${theme} ${tagStyleClass} ll-btn`;
      compact.innerHTML = `
        ${showShield ? '<span>🛡️</span>' : '<span>🔗</span>'}
        <span>${customBtnText}</span>
        <span class="ll-toast">✓</span>
      `;
      compact.addEventListener('click', async () => {
        if (enableSound) playBadgeHapticSound();
        try {
          await navigator.clipboard.writeText(mirrorUrl);
          const t = compact.querySelector('.ll-toast');
          if (t) {
            t.style.display = 'inline-block';
            setTimeout(() => { t.style.display = 'none'; }, 2000);
          }
        } catch (_) {
          window.open(mirrorUrl, '_blank');
        }
      });
      container.innerHTML = '';
      container.appendChild(compact);
      return;
    }

    // Rendu Carte / Bannière / Flottant
    const box = document.createElement('div');
    box.className = `ll-widget-root ll-format-${format} ll-theme-${theme}`;

    // Réseaux sociaux HTML si activés
    let socialsHtml = '';
    if (showSocials) {
      const shareTitle = encodeURIComponent(document.title || 'Article');
      const shareUrlEncoded = encodeURIComponent(mirrorUrl);
      socialsHtml = `
        <div class="ll-socials-bar">
          <span style="font-size: 11px; font-weight: 600; opacity: 0.8; margin-right: 4px;">${isEn ? 'Share on:' : 'Partager sur :'}</span>
          <a class="ll-social-btn" href="https://bsky.app/intent/compose?text=${shareTitle}%20${shareUrlEncoded}" target="_blank" rel="noopener noreferrer" title="Bluesky">🦋</a>
          <a class="ll-social-btn" href="https://mastodonshare.com/?text=${shareTitle}&url=${shareUrlEncoded}" target="_blank" rel="noopener noreferrer" title="Mastodon">🐘</a>
          <a class="ll-social-btn" href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrlEncoded}" target="_blank" rel="noopener noreferrer" title="X / Twitter">𝕏</a>
          <a class="ll-social-btn" href="https://threads.net/intent/post?text=${shareTitle}%20${shareUrlEncoded}" target="_blank" rel="noopener noreferrer" title="Threads">🧵</a>
          <a class="ll-social-btn" href="https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrlEncoded}" target="_blank" rel="noopener noreferrer" title="WhatsApp">💬</a>
          <a class="ll-social-btn" href="mailto:?subject=${shareTitle}&body=${shareUrlEncoded}" title="Email">✉️</a>
        </div>
      `;
    }

    // Mention Légale HTML
    let legalHtml = '';
    if (showLegal) {
      legalHtml = `
        <div class="ll-legal-notice">
          ${isEn 
            ? 'By sharing this link, you support independent journalism and agree to the <a href="https://bwillou1.github.io/LienLibre/politiques.html" target="_blank">Fair Use Terms (s. 29 Copyright Act of Canada)</a>. Zero tracking or profiling.'
            : 'En partageant ce lien, vous soutenez l\'indépendance de la presse et acceptez les <a href="https://bwillou1.github.io/LienLibre/politiques.html" target="_blank">conditions d\'utilisation équitable (art. 29 LDA Canada)</a>. Aucun pistage ni collecte de données.'}
        </div>
      `;
    }

    box.innerHTML = `
      <div class="ll-header">
        <div class="ll-brand">
          ${showShield ? '<span class="ll-shield-icon">🛡️</span>' : '<span>🔗</span>'}
          <span>${customTitle}</span>
        </div>
        ${showTag ? `<span class="ll-tag ${tagStyleClass}">${tagText}</span>` : ''}
      </div>

      <div class="ll-subtext">
        ${customSub}
      </div>

      <div class="ll-actions-row">
        ${showCopy ? `
          <button class="ll-btn ${tagStyleClass} ll-copy-btn" type="button">
            <span>📋</span>
            <span>${customBtnText}</span>
          </button>
        ` : ''}
        
        ${showOpen ? `
          <a class="ll-btn ll-btn-sec" href="${mirrorUrl}" target="_blank" rel="noopener noreferrer">
            <span>🌐</span>
            <span>${isEn ? 'Open via LienLibre' : 'Ouvrir via LienLibre'}</span>
          </a>
        ` : ''}

        ${showShare ? `
          <button class="ll-btn ll-btn-sec ll-share-btn" type="button">
            <span>📲</span>
            <span>${isEn ? 'Share' : 'Partager'}</span>
          </button>
        ` : ''}

        ${showEink ? `
          <a class="ll-btn ll-btn-sec" href="${LIENLIBRE_BASE}#ereader" target="_blank" rel="noopener noreferrer" title="Liseuses Kobo/Kindle/reMarkable">
            <span>📖</span>
            <span>E-Ink</span>
          </a>
        ` : ''}

        <span class="ll-toast">✓ ${isEn ? 'Copied!' : 'Copié !'}</span>
      </div>

      ${socialsHtml}
      ${legalHtml}
    `;

    // Événements
    const copyBtn = box.querySelector('.ll-copy-btn');
    const shareBtn = box.querySelector('.ll-share-btn');
    const toast = box.querySelector('.ll-toast');

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        if (enableSound) playBadgeHapticSound();
        try {
          await navigator.clipboard.writeText(mirrorUrl);
          if (toast) {
            toast.style.display = 'inline-block';
            setTimeout(() => { toast.style.display = 'none'; }, 2500);
          }
          if (window.LienLibreAtoll) {
            window.LienLibreAtoll.notify({
              title: "LienLibre Prêt",
              subtitle: "Lien propre copié dans le presse-papier",
              status: "verified",
              link: mirrorUrl
            });
          }
        } catch (_) {
          window.open(mirrorUrl, '_blank');
        }
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: document.title || customTitle,
              url: mirrorUrl
            });
          } catch (_) {}
        } else if (copyBtn) {
          copyBtn.click();
        } else {
          window.open(mirrorUrl, '_blank');
        }
      });
    }

    container.innerHTML = '';
    container.appendChild(box);
  }

  function initLienLibreBadges() {
    injectBadgeStyles();
    const containers = document.querySelectorAll('.lienlibre-badge');
    containers.forEach(renderBadge);
  }

  // Initialisation automatique
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLienLibreBadges);
  } else {
    initLienLibreBadges();
  }

  // Export pour les configurateurs dynamiques
  window.initLienLibreBadges = initLienLibreBadges;
  window.renderLienLibreBadge = renderBadge;
})();
