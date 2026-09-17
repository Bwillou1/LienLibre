/**
 * LienLibre — Script Runtime Universel pour Médias & Journalistes
 * 
 * FONCTIONNALITÉS :
 * - 0 emoji graphique (emoticones et symboles typographiques stricts).
 * - Détection automatique de l'URL de l'article (aucune configuration par article requise).
 * - Mention légale OBLIGATOIRE et permanente vers https://bwillou1.github.io/LienLibre/politiques.html
 * - Personnalisation : thèmes blanc/noir/verre/papier, formats carte/banniere/pilule/compact/flottant.
 * - Nettoyage automatique des balises de pistage (UTM, Facebook fbclid, etc.).
 * - Partage éthique et équitable conforme à l'article 29 de la Loi sur le droit d'auteur du Canada.
 */

(function () {
  'use strict';

  const LIENLIBRE_BASE = "https://bwillou1.github.io/LienLibre/";
  const LEGAL_URL = "https://bwillou1.github.io/LienLibre/politiques.html";

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
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
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

      /* THÈMES */
      .ll-theme-dark {
        background: #090d16;
        color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      }
      .ll-theme-light {
        background: #ffffff;
        color: #0f172a;
        border: 1px solid #e2e8f0;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }
      .ll-theme-glass {
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
      }
      .ll-theme-paper {
        background: #fbf8f1;
        color: #262626;
        border: 1px solid #dcd5c5;
        box-shadow: 0 6px 16px rgba(44, 38, 27, 0.08);
      }
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

      /* FORMATS */
      .ll-format-card {
        display: flex;
        flex-direction: column;
        border-radius: 14px;
        padding: 16px 20px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .ll-format-banner {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        padding: 18px 24px;
        width: 100%;
      }
      .ll-format-pill {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 10px 16px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .ll-format-pill .ll-pill-top {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: inherit;
        text-decoration: none;
        cursor: pointer;
      }
      .ll-format-compact {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
      }
      .ll-format-floating {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        border-radius: 14px;
        padding: 14px 18px;
        max-width: 360px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      }

      /* ÉLÉMENTS */
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
        gap: 6px;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.2px;
      }
      .ll-emoticon-tag {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .ll-theme-light .ll-emoticon-tag {
        background: #e2e8f0;
        border-color: #cbd5e1;
        color: #0f172a;
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
        opacity: 0.85;
        margin-bottom: 12px;
        line-height: 1.45;
      }
      .ll-actions-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      /* BOUTONS */
      .ll-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        padding: 8px 14px;
        border-radius: 8px;
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

      /* BARRE RESEAUX SOCIAUX SANS EMOJI */
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
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }

      /* MENTION LEGALE OBLIGATOIRE */
      .ll-legal-notice {
        margin-top: 10px;
        font-size: 10.5px;
        line-height: 1.4;
        opacity: 0.8;
        border-top: 1px dashed rgba(255, 255, 255, 0.18);
        padding-top: 8px;
      }
      .ll-theme-light .ll-legal-notice {
        border-top-color: #cbd5e1;
        opacity: 0.9;
      }
      .ll-legal-notice a {
        color: #38bdf8;
        text-decoration: underline;
        font-weight: 700;
      }
      .ll-theme-light .ll-legal-notice a {
        color: #0284c7;
      }

      .ll-toast {
        display: none;
        font-size: 11px;
        font-weight: 700;
        color: #10b981;
        margin-left: 6px;
      }
    `;
    document.head.appendChild(style);
  }

  function renderBadge(container) {
    if (!container) return;
    injectBadgeStyles();

    const targetUrl = cleanUrl(container.getAttribute('data-url') || window.location.href);
    const theme = container.getAttribute('data-theme') || 'dark';
    const format = container.getAttribute('data-style') || 'card';
    const accent = container.getAttribute('data-accent') || 'cyan';
    const lang = container.getAttribute('data-lang') || (document.documentElement.lang || 'fr').slice(0, 2);
    const isEn = lang.startsWith('en');

    const customTitle = container.getAttribute('data-title') || (isEn ? 'Citizen Sharing Gateway' : 'Partage Citoyen & Educatif');
    const customSub = container.getAttribute('data-subtitle') || (isEn ? 'Share this article freely on social networks without tracking or blocking.' : 'Partagez cet article librement sans mouchards publicitaires ni blocage.');
    const customBtnText = container.getAttribute('data-btn-text') || (isEn ? 'Copy Clean Link' : 'Copier le lien propre');

    const showTag = container.getAttribute('data-show-tag') !== 'false';
    const showCopy = container.getAttribute('data-show-copy') !== 'false';
    const showOpen = container.getAttribute('data-show-open') !== 'false';
    const showShare = container.getAttribute('data-show-share') !== 'false';
    const showSocials = container.getAttribute('data-show-socials') === 'true';
    const showEink = container.getAttribute('data-show-eink') === 'true';
    const enableSound = container.getAttribute('data-sound') !== 'false';

    const encodedUrl = encodeURIComponent(targetUrl);
    const mirrorUrl = `${LIENLIBRE_BASE}?url=${encodedUrl}`;

    const tagText = isEn ? '[Zero-Tracking]' : '[Sans Mouchard]';
    let tagStyleClass = 'll-accent-cyan';
    if (accent === 'emerald') tagStyleClass = 'll-accent-emerald';
    else if (accent === 'purple') tagStyleClass = 'll-accent-purple';
    else if (accent === 'amber') tagStyleClass = 'll-accent-amber';
    else if (accent === 'mono') tagStyleClass = 'll-accent-mono';

    // MENTION LÉGALE PRIMORDIALE (Présente dans toutes les configurations)
    const legalNoticeText = isEn
      ? `By sharing this link, you agree to the <a href="${LEGAL_URL}" target="_blank" rel="noopener noreferrer">Fair Use Terms (s. 29 Copyright Act of Canada)</a>. Zero tracking.`
      : `En partageant ce lien, vous soutenez la presse libre et acceptez les <a href="${LEGAL_URL}" target="_blank" rel="noopener noreferrer">conditions d'utilisation equitable (art. 29 LDA Canada)</a>. Zero pistage.`;

    // FORMAT PILULE
    if (format === 'pill') {
      const pillBox = document.createElement('div');
      pillBox.className = `ll-widget-root ll-format-pill ll-theme-${theme}`;
      pillBox.innerHTML = `
        <div class="ll-pill-top">
          <span class="ll-emoticon-tag">[LienLibre]</span>
          <a class="ll-btn ${tagStyleClass}" href="${mirrorUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; padding: 4px 10px;">
            ${customTitle} ↗
          </a>
        </div>
        <div style="font-size: 9.5px; opacity: 0.8; margin-top: 2px;">
          <a href="${LEGAL_URL}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">
            (i) ${isEn ? 'Fair Use Terms (s. 29)' : 'Conditions d\'utilisation equitable (art. 29)'}
          </a>
        </div>
      `;
      container.innerHTML = '';
      container.appendChild(pillBox);
      return;
    }

    // FORMAT COMPACT
    if (format === 'compact') {
      const compactBox = document.createElement('div');
      compactBox.className = `ll-widget-root ll-format-compact ll-theme-${theme}`;
      compactBox.innerHTML = `
        <button type="button" class="ll-btn ${tagStyleClass} ll-compact-btn">
          <span class="ll-emoticon-tag">[+]</span>
          <span>${customBtnText}</span>
          <span class="ll-toast">[OK]</span>
        </button>
        <div style="font-size: 9.5px; opacity: 0.8; margin-top: 2px;">
          <a href="${LEGAL_URL}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">
            (i) ${isEn ? 'Legal Notice (s. 29)' : 'Mention legale (art. 29)'}
          </a>
        </div>
      `;
      const btn = compactBox.querySelector('.ll-compact-btn');
      btn.addEventListener('click', async () => {
        if (enableSound) playBadgeHapticSound();
        try {
          await navigator.clipboard.writeText(mirrorUrl);
          const t = compactBox.querySelector('.ll-toast');
          if (t) {
            t.style.display = 'inline-block';
            setTimeout(() => { t.style.display = 'none'; }, 2000);
          }
        } catch (_) {
          window.open(mirrorUrl, '_blank');
        }
      });
      container.innerHTML = '';
      container.appendChild(compactBox);
      return;
    }

    // FORMAT CARTE / BANNIERE / FLOTTANT
    const box = document.createElement('div');
    box.className = `ll-widget-root ll-format-${format} ll-theme-${theme}`;

    let socialsHtml = '';
    if (showSocials) {
      const shareTitle = encodeURIComponent(document.title || 'Article');
      const shareUrlEncoded = encodeURIComponent(mirrorUrl);
      socialsHtml = `
        <div class="ll-socials-bar">
          <span style="font-size: 11px; font-weight: 700; opacity: 0.8; margin-right: 4px;">${isEn ? 'Share:' : 'Partager :'}</span>
          <a class="ll-social-btn" href="https://bsky.app/intent/compose?text=${shareTitle}%20${shareUrlEncoded}" target="_blank" rel="noopener noreferrer">[Bluesky]</a>
          <a class="ll-social-btn" href="https://mastodonshare.com/?text=${shareTitle}&url=${shareUrlEncoded}" target="_blank" rel="noopener noreferrer">[Mastodon]</a>
          <a class="ll-social-btn" href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrlEncoded}" target="_blank" rel="noopener noreferrer">[X]</a>
          <a class="ll-social-btn" href="https://threads.net/intent/post?text=${shareTitle}%20${shareUrlEncoded}" target="_blank" rel="noopener noreferrer">[Threads]</a>
          <a class="ll-social-btn" href="https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrlEncoded}" target="_blank" rel="noopener noreferrer">[WhatsApp]</a>
          <a class="ll-social-btn" href="mailto:?subject=${shareTitle}&body=${shareUrlEncoded}">[Email]</a>
        </div>
      `;
    }

    box.innerHTML = `
      <div class="ll-header">
        <div class="ll-brand">
          <span class="ll-emoticon-tag">[LienLibre]</span>
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
            <span>[Copier]</span>
            <span>${customBtnText}</span>
          </button>
        ` : ''}
        
        ${showOpen ? `
          <a class="ll-btn ll-btn-sec" href="${mirrorUrl}" target="_blank" rel="noopener noreferrer">
            <span>[Ouvrir]</span>
            <span>${isEn ? 'Open' : 'Ouvrir via LienLibre'} ↗</span>
          </a>
        ` : ''}

        ${showShare ? `
          <button class="ll-btn ll-btn-sec ll-share-btn" type="button">
            <span>[Partager]</span>
            <span>${isEn ? 'Share' : 'Partager'} »</span>
          </button>
        ` : ''}

        ${showEink ? `
          <a class="ll-btn ll-btn-sec" href="${LIENLIBRE_BASE}#ereader" target="_blank" rel="noopener noreferrer">
            <span>[E-Ink]</span>
            <span>Liseuses</span>
          </a>
        ` : ''}

        <span class="ll-toast">[OK] ${isEn ? 'Copied!' : 'Copie !'}</span>
      </div>

      ${socialsHtml}

      <div class="ll-legal-notice">
        ${legalNoticeText}
      </div>
    `;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLienLibreBadges);
  } else {
    initLienLibreBadges();
  }

  window.initLienLibreBadges = initLienLibreBadges;
  window.renderLienLibreBadge = renderBadge;
})();
