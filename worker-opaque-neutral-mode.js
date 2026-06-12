// LienLibre — Mode opaque neutre pour réduire au maximum l’association Meta ↔ article d’actualité
// À intégrer ou utiliser comme base pour worker.js.
//
// Principe :
// - le lien public partagé est /l/<id>, jamais ?url=https://media.ca/article ;
// - la page GET /l/<id> ne contient PAS l’URL originale, PAS le domaine média,
//   PAS le titre/description/image de l’article ;
// - la page partagée a un Open Graph neutre ;
// - l’ouverture réelle se fait par action utilisateur POST /go/<id> ;
// - les bots qui font un simple GET ne voient que la page neutre.
//
// Important : on ne peut jamais garantir qu’une plateforme ne fera aucune association
// par réputation du domaine, comportement utilisateur, texte du post, signalements, etc.
// Ce code supprime toutefois les signaux techniques les plus évidents du lien partagé.
//
// Bindings wrangler.toml :
// [[kv_namespaces]]
// binding = "LIENLIBRE_LINKS"
// id = "..."
//
// Optionnel :
// [vars]
// PUBLIC_LINK_ORIGIN = "https://go.lienlibre.ca"

const LINK_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 jours
const MAX_TARGET_URL_LENGTH = 4000;
const NEUTRAL_OG_IMAGE = 'https://bwillou1.github.io/LienLibre/og-image.png';

// Collez ici votre whitelist existante ou importez-la depuis votre worker actuel.
// Les domaines vérifiés peuvent être ouverts sans avertissement après action utilisateur.
const ALLOWED_DOMAINS = [
  'lapresse.ca',
  'ledevoir.com',
  'cbc.ca',
  'radio-canada.ca',
  'ici.radio-canada.ca',
  'ctvnews.ca',
  'globalnews.ca',
  'tvanouvelles.ca',
  'journaldemontreal.com',
  'journaldequebec.com',
  'theglobeandmail.com',
  'nationalpost.com',
  'thestar.com'
];

const BLOCKED_HOSTS = new Set([
  'grabify.link',
  'iplogger.org',
  '2no.co',
  'yip.su'
]);

const BLOCKED_EXTENSIONS = /\.(?:exe|scr|msi|apk|dmg|pkg|bat|cmd|ps1|jar|vbs|iso)(?:[?#].*)?$/i;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, accept',
  'Access-Control-Max-Age': '86400'
};

const BASE_SECURITY_HEADERS = {
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

const NO_INDEX_HEADERS = {
  ...BASE_SECURITY_HEADERS,
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/create') {
      return handleCreate(request, env);
    }

    const landingMatch = url.pathname.match(/^\/l\/([A-Za-z0-9_-]{8,64})$/);
    if (landingMatch && request.method === 'GET') {
      return handleLanding(landingMatch[1], env);
    }

    const openMatch = url.pathname.match(/^\/go\/([A-Za-z0-9_-]{8,64})$/);
    if (openMatch) {
      return handleOpen(request, openMatch[1], env);
    }

    return jsonResponse({ ok: true, service: 'LienLibre opaque neutral mode' });
  }
};

async function handleCreate(request, env) {
  if (!env.LIENLIBRE_LINKS) {
    return jsonResponse({ error: 'LIENLIBRE_LINKS_KV_MISSING' }, { status: 500 });
  }

  let payload = {};
  try {
    if (request.method === 'POST') {
      const body = await request.text();
      if (body.length > 6000) throw new Error('BODY_TOO_LARGE');
      payload = JSON.parse(body || '{}');
    } else if (request.method === 'GET') {
      const url = new URL(request.url);
      payload.url = url.searchParams.get('url');
      payload.lang = url.searchParams.get('lang') || 'fr';
    } else {
      return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
    }
  } catch (_) {
    return jsonResponse({ error: 'BAD_JSON' }, { status: 400 });
  }

  let target;
  let cleaned;
  try {
    target = parseSafeTarget(payload.url);
    cleaned = cleanTrackingParameters(target);
    target = cleaned.url;
  } catch (error) {
    return jsonResponse({ error: 'INVALID_TARGET_URL' }, { status: 400 });
  }

  const safety = classifyTarget(target);
  if (safety.blocked) {
    return jsonResponse({
      error: 'TARGET_BLOCKED',
      blocked: true,
      reasons: safety.reasons
    }, { status: 403 });
  }

  const id = await generateUniqueId(env);
  const record = {
    v: 1,
    target: target.toString(),
    host: normalizeHost(target.hostname),
    allowed: safety.allowed,
    warningRequired: !safety.allowed,
    reasons: safety.reasons,
    lang: String(payload.lang || 'fr').slice(0, 12),
    createdAt: new Date().toISOString()
  };

  await env.LIENLIBRE_LINKS.put(`link:${id}`, JSON.stringify(record), {
    expirationTtl: LINK_TTL_SECONDS
  });

  const publicOrigin = getPublicOrigin(request, env);
  const publicLink = `${publicOrigin}/l/${id}`;

  return jsonResponse({
    link: publicLink,
    id,
    neutral: true,
    allowed: safety.allowed,
    warningRequired: !safety.allowed,
    blocked: false,
    trackingCleaned: cleaned.strippedAny,
    // Preview volontairement neutre : ne pas retourner les métadonnées de l’article.
    preview: {
      title: 'LienLibre — lien sécurisé',
      description: 'Ouvrir ce lien via LienLibre.',
      image: NEUTRAL_OG_IMAGE,
      domain: new URL(publicLink).hostname
    }
  });
}

async function handleLanding(id, env) {
  const record = await getRecord(env, id);
  if (!record) {
    return htmlResponse(neutralNotFoundHTML(), 404, true);
  }

  // Page GET neutre : aucune URL cible, aucun domaine cible, aucune donnée d’article.
  return htmlResponse(neutralLandingHTML(id), 200, true);
}

async function handleOpen(request, id, env) {
  if (request.method !== 'POST') {
    // Un bot ou quelqu’un qui ouvre /go/<id> en GET revient vers la page neutre.
    return new Response(null, {
      status: 303,
      headers: {
        ...NO_INDEX_HEADERS,
        'Location': `/l/${id}`,
        'Cache-Control': 'no-store'
      }
    });
  }

  const record = await getRecord(env, id);
  if (!record) {
    return htmlResponse(neutralNotFoundHTML(), 404, false);
  }

  let target;
  try {
    target = parseSafeTarget(record.target);
  } catch (_) {
    return htmlResponse(blockedHTML(['invalid-stored-target']), 403, false);
  }

  const safety = classifyTarget(target, record.allowed === true);
  if (safety.blocked) {
    return htmlResponse(blockedHTML(safety.reasons), 403, false);
  }

  const confirm = new URL(request.url).searchParams.get('confirm') === '1';
  if (!record.allowed && !confirm) {
    // Cette page est servie seulement après action POST utilisateur.
    // On peut afficher le domaine pour la sécurité humaine sans l’exposer dans la page partagée GET.
    return htmlResponse(warningHTML(id, normalizeHost(target.hostname), safety.reasons), 200, false);
  }

  return redirectNoReferrer(target.toString());
}

async function getRecord(env, id) {
  if (!env.LIENLIBRE_LINKS) return null;
  return env.LIENLIBRE_LINKS.get(`link:${id}`, { type: 'json' });
}

function getPublicOrigin(request, env) {
  if (env.PUBLIC_LINK_ORIGIN) return String(env.PUBLIC_LINK_ORIGIN).replace(/\/$/, '');
  const url = new URL(request.url);
  return url.origin;
}

async function generateUniqueId(env) {
  for (let i = 0; i < 5; i += 1) {
    const id = randomId(16);
    const existing = await env.LIENLIBRE_LINKS.get(`link:${id}`);
    if (!existing) return id;
  }
  return randomId(20);
}

function randomId(size = 16) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function parseSafeTarget(raw) {
  if (!raw || String(raw).length > MAX_TARGET_URL_LENGTH) throw new Error('BAD_LENGTH');
  const url = new URL(String(raw).trim());
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('BAD_PROTOCOL');
  if (url.username || url.password) throw new Error('CREDENTIALS_FORBIDDEN');
  if (isPrivateOrLocalHost(url.hostname)) throw new Error('PRIVATE_HOST');
  return url;
}

function cleanTrackingParameters(url) {
  const cleaned = new URL(url.toString());
  const patterns = [/^utm_/i, /^fbclid$/i, /^gclid$/i, /^dclid$/i, /^gbraid$/i, /^wbraid$/i, /^mc_cid$/i, /^mc_eid$/i, /^igshid$/i];
  let strippedAny = false;
  for (const key of Array.from(cleaned.searchParams.keys())) {
    if (patterns.some(pattern => pattern.test(key))) {
      cleaned.searchParams.delete(key);
      strippedAny = true;
    }
  }
  return { url: cleaned, strippedAny };
}

function classifyTarget(targetUrl, forceAllowed = false) {
  const host = normalizeHost(targetUrl.hostname);
  const reasons = [];
  let blocked = false;

  if (BLOCKED_HOSTS.has(host)) {
    blocked = true;
    reasons.push('blocked-host');
  }
  if (BLOCKED_EXTENSIONS.test(targetUrl.pathname)) {
    blocked = true;
    reasons.push('dangerous-file-extension');
  }
  if (/\b(login|signin|verify|wallet|airdrop|password|bank|crypto|gift|prize|claim)\b/i.test(targetUrl.pathname + targetUrl.search)) {
    reasons.push('sensitive-keyword');
  }

  const allowed = forceAllowed || isDomainAllowed(host);
  return { allowed, blocked, reasons };
}

function isDomainAllowed(hostname) {
  const host = normalizeHost(hostname);
  return ALLOWED_DOMAINS.some(domain => host === domain || host.endsWith('.' + domain));
}

function normalizeHost(hostname) {
  return String(hostname || '').trim().toLowerCase().replace(/^www\./, '');
}

function isPrivateOrLocalHost(hostname) {
  const host = normalizeHost(hostname);
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return true;
  if (host.startsWith('[') && host.endsWith(']')) return true;
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;
  const [a, b] = ipv4.slice(1).map(Number);
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function neutralLandingHTML(id) {
  const safeId = escapeHTML(id);
  return `<!doctype html>
<html lang="fr-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <title>LienLibre — lien sécurisé</title>
  <meta name="description" content="Ouvrir ce lien via LienLibre.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="LienLibre — lien sécurisé">
  <meta property="og:description" content="Ouvrir ce lien via LienLibre.">
  <meta property="og:image" content="${NEUTRAL_OG_IMAGE}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="LienLibre — lien sécurisé">
  <meta name="twitter:description" content="Ouvrir ce lien via LienLibre.">
  <meta name="twitter:image" content="${NEUTRAL_OG_IMAGE}">
  <style>${baseCSS()}</style>
</head>
<body>
  <main class="card">
    <div class="mark">↗</div>
    <h1>Lien sécurisé</h1>
    <p>Ce lien s’ouvre avec une protection de confidentialité. L’adresse de destination n’est pas exposée dans la carte partagée.</p>
    <form method="POST" action="/go/${safeId}">
      <button type="submit">Ouvrir le lien</button>
    </form>
    <p class="fine">LienLibre ne publie pas l’adresse originale dans l’aperçu social.</p>
  </main>
</body>
</html>`;
}

function warningHTML(id, host, reasons = []) {
  const safeId = escapeHTML(id);
  const safeHost = escapeHTML(host);
  const safeReasons = escapeHTML(reasons.join(', ') || 'domaine non vérifié');
  return `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>LienLibre — vérification</title><style>${baseCSS()}</style></head><body><main class="card"><div class="mark warn">!</div><h1>Vérification requise</h1><p>Cette destination n’est pas encore dans la liste vérifiée. Vérifiez le domaine avant de continuer.</p><p class="host">${safeHost}</p><p class="fine">Signaux : ${safeReasons}</p><form id="continue-form" method="POST" action="/go/${safeId}?confirm=1"><button id="continue-btn" type="submit" disabled>Continuer dans <span id="count">10</span>s</button></form><form method="GET" action="/l/${safeId}"><button class="secondary" type="submit">Annuler</button></form><script>let n=10,b=document.getElementById('continue-btn'),c=document.getElementById('count');let t=setInterval(()=>{n--;c.textContent=n;if(n<=0){clearInterval(t);b.disabled=false;b.textContent='Continuer';}},1000);</script></main></body></html>`;
}

function blockedHTML(reasons = []) {
  const safeReasons = escapeHTML(reasons.join(', ') || 'risque détecté');
  return `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>LienLibre — lien bloqué</title><style>${baseCSS()}</style></head><body><main class="card"><div class="mark danger">×</div><h1>Lien bloqué</h1><p>Ce lien ne peut pas être ouvert via LienLibre.</p><p class="fine">Raison : ${safeReasons}</p></main></body></html>`;
}

function neutralNotFoundHTML() {
  return `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>LienLibre</title><meta property="og:title" content="LienLibre — lien sécurisé"><meta property="og:description" content="Ouvrir ce lien via LienLibre."><meta property="og:image" content="${NEUTRAL_OG_IMAGE}"><style>${baseCSS()}</style></head><body><main class="card"><div class="mark">↗</div><h1>Lien indisponible</h1><p>Ce lien est expiré ou introuvable.</p></main></body></html>`;
}

function baseCSS() {
  return `body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1rem;background:linear-gradient(135deg,#f8fafc,#eef6f7);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#0f172a}.card{width:min(100%,620px);border:1px solid rgba(15,23,42,.1);border-radius:28px;background:#fff;padding:1.35rem;box-shadow:0 24px 70px rgba(15,23,42,.14);text-align:center}.mark{width:56px;height:56px;border-radius:18px;margin:0 auto 1rem;display:grid;place-items:center;color:white;background:linear-gradient(135deg,#0f766e,#2563eb);font-size:1.7rem;font-weight:900}.mark.warn{background:linear-gradient(135deg,#f59e0b,#ea580c)}.mark.danger{background:linear-gradient(135deg,#dc2626,#7f1d1d)}h1{margin:.2rem 0;font-size:clamp(2rem,7vw,3.4rem);line-height:.96;letter-spacing:-.06em}p{color:#475569;line-height:1.65}button{border:0;border-radius:999px;padding:.9rem 1.15rem;background:#0f172a;color:white;font-weight:900;font-size:1rem;cursor:pointer;margin:.35rem}button:disabled{opacity:.55;cursor:not-allowed}.secondary{background:#e2e8f0;color:#0f172a}.fine{font-size:.86rem;color:#64748b}.host{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#f1f5f9;border-radius:14px;padding:.75rem;overflow-wrap:anywhere;color:#0f172a}`;
}

function redirectNoReferrer(target) {
  return new Response(null, {
    status: 303,
    headers: {
      ...NO_INDEX_HEADERS,
      'Location': target,
      'Cache-Control': 'no-store'
    }
  });
}

function htmlResponse(html, status = 200, cacheable = false) {
  return new Response(html, {
    status,
    headers: {
      ...NO_INDEX_HEADERS,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': cacheable ? 'public, max-age=600' : 'no-store'
    }
  });
}

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      ...CORS_HEADERS,
      ...BASE_SECURITY_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init.headers || {})
    }
  });
}

function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[ch]));
}
