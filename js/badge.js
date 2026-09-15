/**
 * 🔗 LienLibre — Badge Officiel pour Médias Indépendants & Journalistes
 * Permet d'intégrer en 1 ligne de code un bouton de partage citoyen et propre sur tout article web.
 * 
 * UTILISATION RAPIDE :
 * <script src="https://bwillou1.github.io/LienLibre/js/badge.js" async></script>
 * <div class="lienlibre-badge" data-theme="dark" data-style="card"></div>
 */

(function () {
  'use strict';

  const LIENLIBRE_BASE = "https://bwillou1.github.io/LienLibre/";

  function initLienLibreBadges() {
    const containers = document.querySelectorAll('.lienlibre-badge:not([data-initialized="true"])');
    if (!containers || containers.length === 0) return;

    containers.forEach(container => {
      container.setAttribute('data-initialized', 'true');

      const targetUrl = container.getAttribute('data-url') || window.location.href;
      const theme = container.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const styleType = container.getAttribute('data-style') || 'card'; // 'card', 'compact', 'pill'
      const lang = container.getAttribute('data-lang') || (document.documentElement.lang || 'fr').slice(0, 2);

      const isEn = lang.startsWith('en');
      const cleanTargetUrl = targetUrl.split('#')[0];
      const encodedUrl = encodeURIComponent(cleanTargetUrl);
      const mirrorUrl = `${LIENLIBRE_BASE}?url=${encodedUrl}`;

      // Injection du style CSS scoped une seule fois
      if (!document.getElementById('lienlibre-badge-css')) {
        const style = document.createElement('style');
        style.id = 'lienlibre-badge-css';
        style.textContent = `
          .ll-widget-box {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            display: inline-flex;
            flex-direction: column;
            border-radius: 12px;
            padding: 14px 16px;
            margin: 16px 0;
            max-width: 100%;
            transition: all 0.2s ease;
          }
          .ll-widget-box.ll-dark {
            background: #0f172a;
            color: #f1f5f9;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          }
          .ll-widget-box.ll-light {
            background: #f8fafc;
            color: #0f172a;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .ll-widget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }
          .ll-widget-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.2px;
          }
          .ll-widget-tag {
            font-size: 11px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 99px;
            background: rgba(14, 165, 233, 0.15);
            color: #0284c7;
          }
          .ll-dark .ll-widget-tag {
            background: rgba(56, 189, 248, 0.2);
            color: #38bdf8;
          }
          .ll-widget-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }
          .ll-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            padding: 7px 13px;
            border-radius: 8px;
            cursor: pointer;
            border: none;
            transition: all 0.15s ease;
            text-decoration: none;
            outline: none;
          }
          .ll-btn-primary {
            background: #0284c7;
            color: #ffffff !important;
          }
          .ll-btn-primary:hover {
            background: #0369a1;
            transform: translateY(-1px);
          }
          .ll-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: inherit !important;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          .ll-light .ll-btn-secondary {
            background: #ffffff;
            color: #334155 !important;
            border: 1px solid #cbd5e1;
          }
          .ll-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          .ll-light .ll-btn-secondary:hover {
            background: #f1f5f9;
          }
          .ll-toast {
            font-size: 11px;
            color: #10b981;
            font-weight: 600;
            display: none;
            margin-left: 6px;
          }
          /* Style Compact / Pill */
          .ll-widget-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .ll-widget-pill.ll-dark {
            background: #1e293b;
            color: #38bdf8;
            border: 1px solid rgba(56, 189, 248, 0.3);
          }
          .ll-widget-pill.ll-light {
            background: #f0f9ff;
            color: #0369a1;
            border: 1px solid #bae6fd;
          }
          .ll-widget-pill:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
          }
        `;
        document.head.appendChild(style);
      }

      // Rendu selon le style demandé
      if (styleType === 'pill' || styleType === 'compact') {
        const pill = document.createElement('a');
        pill.className = `ll-widget-pill ll-${theme}`;
        pill.href = mirrorUrl;
        pill.target = '_blank';
        pill.rel = 'noopener noreferrer';
        pill.title = isEn ? 'Share freely via LienLibre' : 'Partager librement via LienLibre';
        pill.innerHTML = `
          <span>🔗</span>
          <span>${isEn ? 'Share with LienLibre' : 'Partager avec LienLibre'}</span>
          <span style="font-size: 10px; opacity: 0.8;">↗</span>
        `;
        container.innerHTML = '';
        container.appendChild(pill);
        return;
      }

      // Style 'card' complet
      const card = document.createElement('div');
      card.className = `ll-widget-box ll-${theme}`;
      card.innerHTML = `
        <div class="ll-widget-header">
          <div class="ll-widget-title">
            <span style="font-size: 16px;">🔗</span>
            <span>${isEn ? 'Free Citizen Sharing' : 'Partage Citoyen & Éducatif'}</span>
          </div>
          <span class="ll-widget-tag">${isEn ? 'Zero Tracking' : 'Lien Nettoyé'}</span>
        </div>
        <div style="font-size: 12px; opacity: 0.85; margin-bottom: 12px; line-height: 1.4;">
          ${isEn 
            ? 'Share this article freely on social networks without tracking or blocking.' 
            : 'Partagez cet article librement sur vos réseaux sociaux sans blocage ni mouchards publicitaires.'}
        </div>
        <div class="ll-widget-actions">
          <button class="ll-btn ll-btn-primary ll-copy-btn" type="button">
            <span>📋</span>
            <span>${isEn ? 'Copy Clean Link' : 'Copier le lien propre'}</span>
          </button>
          <a class="ll-btn ll-btn-secondary" href="${mirrorUrl}" target="_blank" rel="noopener noreferrer">
            <span>🌐</span>
            <span>${isEn ? 'Open Mirror' : 'Ouvrir via LienLibre'}</span>
          </a>
          <button class="ll-btn ll-btn-secondary ll-share-btn" type="button">
            <span>📲</span>
            <span>${isEn ? 'Share' : 'Partager'}</span>
          </button>
          <span class="ll-toast">✓ ${isEn ? 'Copied!' : 'Copié !'}</span>
        </div>
      `;

      // Gestion des interactions
      const copyBtn = card.querySelector('.ll-copy-btn');
      const shareBtn = card.querySelector('.ll-share-btn');
      const toast = card.querySelector('.ll-toast');

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(mirrorUrl);
          toast.style.display = 'inline-block';
          copyBtn.style.opacity = '0.8';
          setTimeout(() => {
            toast.style.display = 'none';
            copyBtn.style.opacity = '1';
          }, 2500);
        } catch (_) {
          window.open(mirrorUrl, '_blank');
        }
      });

      shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: document.title,
              url: mirrorUrl
            });
          } catch (_) {}
        } else {
          copyBtn.click();
        }
      });

      container.innerHTML = '';
      container.appendChild(card);
    });
  }

  // Initialisation automatique au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLienLibreBadges);
  } else {
    initLienLibreBadges();
  }

  window.initLienLibreBadges = initLienLibreBadges;
})();
