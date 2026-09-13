const WORKER_URL = 'https://lienlibre.acces-presse.workers.dev';

let activeFormat = 'short';
let currentLinks = {
  short: '',
  mirror: ''
};
let currentTabTitle = '';
let currentCleanUrl = '';
let isGenerated = false;

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
    if (tabShort) tabShort.classList.add('active');
    if (tabMirror) tabMirror.classList.remove('active');
    if (outputBox) outputBox.textContent = currentLinks.short || 'Génération...';
  } else {
    if (tabMirror) tabMirror.classList.add('active');
    if (tabShort) tabShort.classList.remove('active');
    if (outputBox) outputBox.textContent = currentLinks.mirror || 'Génération...';
  }

  // Refresh QR code if visible
  const qrSection = document.getElementById('qr-section');
  if (qrSection && !qrSection.classList.contains('hidden')) {
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
  const btnGenerate = document.getElementById('btn-generate');
  const resultSection = document.getElementById('result-section');
  const tabShort = document.getElementById('tab-short');
  const tabMirror = document.getElementById('tab-mirror');
  const btnCopy = document.getElementById('btn-copy');
  const copyText = document.getElementById('copy-text');
  const btnShare = document.getElementById('btn-share');
  const btnQr = document.getElementById('btn-qr');
  const qrSection = document.getElementById('qr-section');
  const btnDownloadQr = document.getElementById('btn-download-qr');

  // Format Switchers
  if (tabShort) {
    tabShort.addEventListener('click', () => {
      activeFormat = 'short';
      updateFormatUI();
    });
  }

  if (tabMirror) {
    tabMirror.addEventListener('click', () => {
      activeFormat = 'mirror';
      updateFormatUI();
    });
  }

  // Toggle QR
  if (btnQr) {
    btnQr.addEventListener('click', () => {
      qrSection.classList.toggle('hidden');
      if (!qrSection.classList.contains('hidden')) {
        renderQR();
      }
    });
  }

  // Download QR
  if (btnDownloadQr) {
    btnDownloadQr.addEventListener('click', () => {
      const canvas = document.getElementById('qr-canvas');
      if (!canvas) return;
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = 'lienlibre-qrcode.png';
      a.click();
    });
  }

  // Copy Action
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const textToCopy = activeFormat === 'short' ? currentLinks.short : currentLinks.mirror;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (copyText) copyText.textContent = 'Copié !';
        btnCopy.classList.add('btn-success');
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copier';
          btnCopy.classList.remove('btn-success');
        }, 2000);
      });
    });
  }

  // Web Share Action
  if (btnShare) {
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
        navigator.clipboard.writeText(textToShare).then(() => {
          if (copyText) copyText.textContent = 'Copié !';
          btnCopy.classList.add('btn-success');
          setTimeout(() => {
            if (copyText) copyText.textContent = 'Copier';
            btnCopy.classList.remove('btn-success');
          }, 2000);
        });
      }
    });
  }

  // Explicit Manual Generation (Zero automatic network requests on page load)
  if (btnGenerate) {
    btnGenerate.addEventListener('click', async () => {
      if (!currentCleanUrl) return;

      btnGenerate.disabled = true;
      btnGenerate.innerHTML = '<span>⏳</span><span>Génération en cours...</span>';

      // 1. Instantly compute direct client-side passerelle URL (Zero network delay)
      const encodedUrl = encodeURIComponent(currentCleanUrl);
      const cleanPath = currentCleanUrl.replace(/^https?:\/\/(?:www\.)?/i, '');
      currentLinks.short = `${WORKER_URL}/?url=${encodedUrl}`;
      currentLinks.mirror = `${WORKER_URL}/${cleanPath}`;
      
      if (resultSection) {
        resultSection.classList.remove('hidden');
      }
      updateFormatUI();

      // 2. Optional: Register short link via Worker API ONLY on explicit user click
      try {
        const createCtrl = new AbortController();
        const timeout = setTimeout(() => createCtrl.abort(), 3500);
        const res = await fetch(`${WORKER_URL}/api/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentCleanUrl }),
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
        console.warn('Passerelle directe active:', err);
      } finally {
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = '<span>✓</span><span>LienLibre Prêt ! Re-générer</span>';
        btnGenerate.classList.remove('btn-primary');
        btnGenerate.classList.add('btn-secondary');
      }
    });
  }

  // Query Active Tab ONLY for local display (Zero API / network calls)
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0 || !tabs[0].url) {
        if (sourceTitle) sourceTitle.textContent = 'Aucune page web active détectée';
        if (sourceDomain) sourceDomain.textContent = '';
        if (btnGenerate) btnGenerate.disabled = true;
        return;
      }

      const activeTab = tabs[0];
      const rawUrl = activeTab.url;

      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        if (sourceTitle) sourceTitle.textContent = 'Page interne ou non compatible';
        if (sourceDomain) sourceDomain.textContent = rawUrl;
        if (btnGenerate) {
          btnGenerate.disabled = true;
          btnGenerate.textContent = 'Article en ligne requis';
        }
        return;
      }

      currentTabTitle = activeTab.title || 'Article de presse';
      currentCleanUrl = cleanTrackingParams(rawUrl);
      
      try {
        const parsed = new URL(currentCleanUrl);
        if (sourceDomain) sourceDomain.textContent = parsed.hostname;
      } catch {
        if (sourceDomain) sourceDomain.textContent = currentCleanUrl;
      }

      if (sourceTitle) sourceTitle.textContent = currentTabTitle;
      if (btnGenerate) btnGenerate.disabled = false;
    });
  } else {
    // Testing mode outside Chrome extension runtime
    if (sourceTitle) sourceTitle.textContent = "Mode Test Local";
    if (sourceDomain) sourceDomain.textContent = "lapresse.ca";
    currentCleanUrl = "https://www.lapresse.ca";
    if (btnGenerate) btnGenerate.disabled = false;
  }
});
