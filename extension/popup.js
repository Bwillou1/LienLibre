const WORKER_URL = 'https://acces-presse.williamguindon.workers.dev';

let activeFormat = 'short';
let currentLinks = {
  short: '',
  mirror: ''
};
let currentTabTitle = '';

// Clean tracking query parameters
function cleanTrackingParams(urlString) {
  try {
    const url = new URL(urlString);
    const trackingParams = [
      'fbclid', 'gclid', 'msclkid', 'mc_eid', 'igshid',
      '_ga', '_gl', 'ref', 'source', 'platform', 'campaign',
      'cmpid', 'pk_campaign', 'pk_kwd', 'piwik_campaign',
      'at_medium', 'at_campaign', 'xtor'
    ];
    for (const key of Array.from(url.searchParams.keys())) {
      if (key.startsWith('utm_') || trackingParams.includes(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return urlString;
  }
}

function updateFormatUI() {
  const tabShort = document.getElementById('tab-short');
  const tabMirror = document.getElementById('tab-mirror');
  const outputBox = document.getElementById('output-url');

  if (activeFormat === 'short') {
    tabShort.classList.add('active');
    tabMirror.classList.remove('active');
    outputBox.textContent = currentLinks.short || 'Génération...';
  } else {
    tabMirror.classList.add('active');
    tabShort.classList.remove('active');
    outputBox.textContent = currentLinks.mirror || 'Génération...';
  }

  // Refresh QR code if visible
  const qrSection = document.getElementById('qr-section');
  if (!qrSection.classList.contains('hidden')) {
    renderQR();
  }
}

function renderQR() {
  const targetUrl = activeFormat === 'short' ? currentLinks.short : currentLinks.mirror;
  const canvas = document.getElementById('qr-canvas');
  if (targetUrl && canvas && typeof LienLibreQR !== 'undefined') {
    LienLibreQR.render(targetUrl, canvas, {
      size: 160,
      margin: 2,
      colorDark: '#0f172a',
      colorLight: '#ffffff'
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const sourceTitle = document.getElementById('source-title');
  const sourceDomain = document.getElementById('source-domain');
  const tabShort = document.getElementById('tab-short');
  const tabMirror = document.getElementById('tab-mirror');
  const btnCopy = document.getElementById('btn-copy');
  const copyText = document.getElementById('copy-text');
  const btnShare = document.getElementById('btn-share');
  const btnQr = document.getElementById('btn-qr');
  const qrSection = document.getElementById('qr-section');
  const btnDownloadQr = document.getElementById('btn-download-qr');

  // Format Switchers
  tabShort.addEventListener('click', () => {
    activeFormat = 'short';
    updateFormatUI();
  });

  tabMirror.addEventListener('click', () => {
    activeFormat = 'mirror';
    updateFormatUI();
  });

  // Toggle QR
  btnQr.addEventListener('click', () => {
    qrSection.classList.toggle('hidden');
    if (!qrSection.classList.contains('hidden')) {
      renderQR();
    }
  });

  // Download QR
  btnDownloadQr.addEventListener('click', () => {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const imgData = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgData;
    a.download = 'lienlibre-qrcode.png';
    a.click();
  });

  // Copy Action
  btnCopy.addEventListener('click', () => {
    const textToCopy = activeFormat === 'short' ? currentLinks.short : currentLinks.mirror;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      copyText.textContent = 'Copié !';
      btnCopy.classList.add('btn-success');
      setTimeout(() => {
        copyText.textContent = 'Copier';
        btnCopy.classList.remove('btn-success');
      }, 2000);
    });
  });

  // Web Share Action
  btnShare.addEventListener('click', () => {
    const textToShare = activeFormat === 'short' ? currentLinks.short : currentLinks.mirror;
    if (!textToShare) return;

    if (navigator.share) {
      navigator.share({
        title: currentTabTitle || 'LienLibre - Accès Presse',
        text: 'Partagé via LienLibre :',
        url: textToShare
      }).catch(err => {
        if (err.name !== 'AbortError') {
          console.warn('Erreur partage:', err);
        }
      });
    } else {
      // Fallback copy
      navigator.clipboard.writeText(textToShare).then(() => {
        copyText.textContent = 'Copié !';
        btnCopy.classList.add('btn-success');
        setTimeout(() => {
          copyText.textContent = 'Copier';
          btnCopy.classList.remove('btn-success');
        }, 2000);
      });
    }
  });

  // Query Active Tab
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0 || !tabs[0].url) {
        sourceTitle.textContent = 'Aucune page web active détectée';
        sourceDomain.textContent = '';
        return;
      }

      const activeTab = tabs[0];
      const rawUrl = activeTab.url;

      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        sourceTitle.textContent = 'Page interne ou non compatible';
        sourceDomain.textContent = rawUrl;
        document.getElementById('output-url').textContent = 'Ouvrez un article de presse en ligne pour générer un lien.';
        return;
      }

      currentTabTitle = activeTab.title || 'Article de presse';
      const cleanUrl = cleanTrackingParams(rawUrl);
      
      try {
        const parsed = new URL(cleanUrl);
        sourceDomain.textContent = parsed.hostname;
      } catch {
        sourceDomain.textContent = cleanUrl;
      }

      sourceTitle.textContent = currentTabTitle;

      // Default Direct Links
      const encodedUrl = encodeURIComponent(cleanUrl);
      const cleanPath = cleanUrl.replace(/^https?:\/\/(?:www\.)?/i, '');
      currentLinks.short = `${WORKER_URL}/?url=${encodedUrl}`;
      currentLinks.mirror = `${WORKER_URL}/${cleanPath}`;
      updateFormatUI();

      // Async fetch /api/create if available
      try {
        const createCtrl = new AbortController();
        const timeout = setTimeout(() => createCtrl.abort(), 3500);
        const res = await fetch(`${WORKER_URL}/api/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanUrl }),
          signal: createCtrl.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (data.shortLink) currentLinks.short = data.shortLink;
          if (data.link) currentLinks.mirror = data.link;
          updateFormatUI();
        }
      } catch (err) {
        console.warn('Mode fallback direct extension actif:', err);
      }
    });
  } else {
    // Testing mode outside Chrome extension runtime
    sourceTitle.textContent = "Mode Test Web";
    sourceDomain.textContent = "lapresse.ca";
    currentLinks.short = `${WORKER_URL}/?url=https%3A%2F%2Flapresse.ca`;
    currentLinks.mirror = `${WORKER_URL}/lapresse.ca`;
    updateFormatUI();
  }
});
