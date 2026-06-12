// LienLibre — Abuse Shield anti-criminels / anti-open-redirect
// À intégrer dans le Cloudflare Worker.
//
// But : empêcher que LienLibre devienne un masque pour phishing, malware,
// scam, spam ou trafic criminel.
//
// Principe de sécurité recommandé :
// - seuls les domaines officiellement vérifiés redirigent sans friction ;
// - les domaines inconnus ne doivent jamais être traités comme une confiance forte ;
// - tous les liens de sortie doivent envoyer Referrer-Policy: no-referrer ;
// - les URL pont ne doivent pas être indexées par Google/Meta comme contenu LienLibre ;
// - les créations de liens doivent être signées + rate-limit + Turnstile optionnel.

const ABUSE_SHIELD = {
  projectUrl: 'https://bwillou1.github.io/LienLibre/',
  githubIssuesUrl: 'https://github.com/Bwillou1/LienLibre/issues/new',
  requireSignatureForRedirect: true,
  requireTurnstileForCreateEndpoint: false, // recommandé si abus réel : true
  maxTargetUrlLength: 4000,
  warningDelaySeconds: 10,
  blockedShorteners: new Set([
    'bit.ly', 't.co', 'tinyurl.com', 'goo.gl', 'ow.ly', 'buff.ly', 'cutt.ly',
    'is.gd', 'rebrand.ly', 'shorturl.at', 'lnkd.in', 'urlz.fr', 'rb.gy',
    'grabify.link', 'iplogger.org', '2no.co', 'yip.su'
  ]),
  highRiskHosts: new Set([
    // Exemples de plateformes souvent abusées. Ne bloquez pas aveuglément si vous
    // avez des usages légitimes ; utilisez plutôt warning forcé.
    'ngrok-free.app', 'ngrok.io', 'trycloudflare.com', 'pages.dev', 'workers.dev',
    'vercel.app', 'netlify.app', 'github.io', 'firebaseapp.com', 'web.app'
  ]),
  blockedFileExtensions: /\.(?:exe|scr|msi|apk|dmg|pkg|bat|cmd|ps1|jar|vbs|iso|zip|rar|7z)(?:[?#].*)?$/i
};

function abuseSecurityHeaders(extra = {}) {
  return {
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Resource-Policy': 'same-origin',
    ...extra
  };
}

function normalizeAbuseHost(hostname) {
  return String(hostname || '').trim().toLowerCase().replace(/^www\./, '');
}

function parseTargetForAbuseShield(rawTarget) {
  if (!rawTarget || String(rawTarget).length > ABUSE_SHIELD.maxTargetUrlLength) {
    throw new Error('INVALID_URL_LENGTH');
  }

  const target = new URL(String(rawTarget));
  if (!['http:', 'https:'].includes(target.protocol)) throw new Error('INVALID_PROTOCOL');
  if (target.username || target.password) throw new Error('URL_WITH_CREDENTIALS');
  return target;
}

function isProbablyIpLiteral(host) {
  const normalized = normalizeAbuseHost(host);
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(normalized)) return true;
  if (normalized.startsWith('[') && normalized.endsWith(']')) return true;
  return false;
}

function isPrivateOrLocalHost(host) {
  const normalized = normalizeAbuseHost(host);
  if (!normalized) return true;
  if (normalized === 'localhost' || normalized.endsWith('.localhost')) return true;
  if (normalized.endsWith('.local')) return true;

  const ipv4 = normalized.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
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

function classifyTargetForAbuse(targetUrl, { isOfficiallyVerified = false, isManuallyApproved = false } = {}) {
  const host = normalizeAbuseHost(targetUrl.hostname);
  const reasons = [];
  let action = 'warning'; // allow | warning | block

  if (isOfficiallyVerified || isManuallyApproved) action = 'allow';

  if (isPrivateOrLocalHost(host)) {
    action = 'block';
    reasons.push('private-or-local-host');
  }

  if (isProbablyIpLiteral(host)) {
    action = 'block';
    reasons.push('ip-literal');
  }

  if (ABUSE_SHIELD.blockedShorteners.has(host)) {
    action = 'block';
    reasons.push('known-shortener-or-iplogger');
  }

  if (ABUSE_SHIELD.blockedFileExtensions.test(targetUrl.pathname)) {
    action = 'block';
    reasons.push('dangerous-file-extension');
  }

  if (ABUSE_SHIELD.highRiskHosts.has(host) && action !== 'block') {
    action = 'warning';
    reasons.push('high-risk-hosting-platform');
  }

  // Si l’URL contient des mots typiques de phishing, on force au minimum warning.
  if (/\b(login|signin|verify|wallet|airdrop|password|2fa|bank|crypto|gift|prize|claim)\b/i.test(targetUrl.pathname + targetUrl.search)) {
    if (action === 'allow' && !isOfficiallyVerified && !isManuallyApproved) action = 'warning';
    reasons.push('phishing-keyword');
  }

  return { action, reasons, host };
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(String(input));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function recordAbuseSignal(env, { targetUrl, action, reasons }) {
  if (!env || !env.LIENLIBRE_KV) return;
  const host = normalizeAbuseHost(targetUrl.hostname);
  const hostHash = await sha256Hex(host);
  const day = new Date().toISOString().slice(0, 10);
  const key = `abuse:v1:${day}:${hostHash}`;

  const record = (await env.LIENLIBRE_KV.get(key, { type: 'json' })) || {
    hostHash,
    day,
    count: 0,
    actions: {},
    reasons: {}
  };

  record.count += 1;
  record.actions[action] = Number(record.actions[action] || 0) + 1;
  for (const reason of reasons || []) {
    record.reasons[reason] = Number(record.reasons[reason] || 0) + 1;
  }

  await env.LIENLIBRE_KV.put(key, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 90 });
}

function htmlEscape(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

function renderBlockedPage(targetUrl, reasons = []) {
  const host = normalizeAbuseHost(targetUrl.hostname);
  const issueUrl = `${ABUSE_SHIELD.githubIssuesUrl}?title=${encodeURIComponent('Signalement abus LienLibre')}&body=${encodeURIComponent('URL ou domaine concerné : ' + host + '\nRaison : ' + reasons.join(', '))}`;
  return `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>LienLibre — lien bloqué</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#fff7ed;color:#431407;margin:0;min-height:100vh;display:grid;place-items:center;padding:1rem}.card{max-width:720px;background:#fff;border:1px solid #fed7aa;border-radius:24px;padding:1.25rem;box-shadow:0 20px 60px rgba(124,45,18,.14)}h1{margin:.2rem 0;font-size:clamp(1.6rem,5vw,2.4rem)}p{line-height:1.65}.host{font-family:ui-monospace,monospace;overflow-wrap:anywhere;background:#ffedd5;border-radius:12px;padding:.75rem}.btn{display:inline-flex;margin-top:.5rem;border-radius:999px;padding:.75rem 1rem;background:#0f172a;color:white;text-decoration:none;font-weight:800}.muted{color:#9a3412;font-size:.9rem}</style></head><body><main class="card"><p class="muted">Protection anti-abus LienLibre</p><h1>Lien bloqué par sécurité</h1><p>Ce lien ne sera pas redirigé par LienLibre, car il ressemble à une utilisation abusive ou risquée de l’outil.</p><p class="host">${htmlEscape(host)}</p><p>Raisons : ${htmlEscape(reasons.join(', ') || 'risque inconnu')}</p><a class="btn" href="${htmlEscape(ABUSE_SHIELD.projectUrl)}" rel="noreferrer">Retour à LienLibre</a> <a class="btn" href="${htmlEscape(issueUrl)}" rel="noreferrer" style="background:#f97316">Signaler une erreur</a></main></body></html>`;
}

function renderWarningPage(targetUrl, reasons = [], delaySeconds = ABUSE_SHIELD.warningDelaySeconds) {
  const safeUrl = targetUrl.toString();
  const host = normalizeAbuseHost(targetUrl.hostname);
  return `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>LienLibre — domaine non vérifié</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f8fafc;color:#0f172a;margin:0;min-height:100vh;display:grid;place-items:center;padding:1rem}.card{max-width:760px;background:#fff;border:1px solid rgba(15,23,42,.12);border-radius:24px;padding:1.25rem;box-shadow:0 20px 60px rgba(15,23,42,.12)}h1{margin:.2rem 0;font-size:clamp(1.6rem,5vw,2.5rem)}p{line-height:1.65}.host,.url{font-family:ui-monospace,monospace;overflow-wrap:anywhere;background:#f1f5f9;border-radius:12px;padding:.75rem}.warn{background:#fff7ed;border:1px solid #fed7aa;color:#7c2d12;border-radius:16px;padding:.85rem}.btn{display:inline-flex;align-items:center;justify-content:center;margin-top:.7rem;border-radius:999px;padding:.8rem 1rem;background:#0f172a;color:white;text-decoration:none;font-weight:850}.btn[aria-disabled=true]{opacity:.55;pointer-events:none}.muted{color:#64748b;font-size:.9rem}</style></head><body><main class="card"><p class="muted">Barrière anti-hameçonnage LienLibre</p><h1>Domaine non vérifié</h1><p class="warn">LienLibre n’a pas vérifié officiellement ce domaine. Vérifiez bien la destination avant de continuer.</p><p>Domaine :</p><p class="host">${htmlEscape(host)}</p><p>URL complète :</p><p class="url">${htmlEscape(safeUrl)}</p><p class="muted">Signaux : ${htmlEscape(reasons.join(', ') || 'aucun signal bloquant, mais domaine inconnu')}</p><a id="continue" class="btn" aria-disabled="true" href="${htmlEscape(safeUrl)}" rel="noreferrer noopener">Continuer dans <span id="count">${delaySeconds}</span>s</a> <a class="btn" href="${htmlEscape(ABUSE_SHIELD.projectUrl)}" rel="noreferrer" style="background:#0f766e">Annuler</a><script>let n=${Number(delaySeconds)||10};const a=document.getElementById('continue'),c=document.getElementById('count');const timer=setInterval(()=>{n-=1;c.textContent=n;if(n<=0){clearInterval(timer);a.removeAttribute('aria-disabled');a.textContent='Continuer vers le site';}},1000);</script></main></body></html>`;
}

function responseHtml(html, status = 200) {
  return new Response(html, {
    status,
    headers: abuseSecurityHeaders({
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    })
  });
}

function safeRedirectNoReferrer(targetUrl, status = 302) {
  return new Response(null, {
    status,
    headers: abuseSecurityHeaders({
      'location': targetUrl.toString(),
      'cache-control': 'no-store'
    })
  });
}

async function enforceAbuseShield({ targetUrl, env, ctx, isOfficiallyVerified = false, isManuallyApproved = false }) {
  const classification = classifyTargetForAbuse(targetUrl, { isOfficiallyVerified, isManuallyApproved });
  if (ctx && ctx.waitUntil) ctx.waitUntil(recordAbuseSignal(env, { targetUrl, action: classification.action, reasons: classification.reasons }));

  if (classification.action === 'block') {
    return {
      allowed: false,
      blocked: true,
      response: responseHtml(renderBlockedPage(targetUrl, classification.reasons), 403),
      classification
    };
  }

  if (classification.action === 'warning') {
    return {
      allowed: false,
      warning: true,
      response: responseHtml(renderWarningPage(targetUrl, classification.reasons), 200),
      classification
    };
  }

  return {
    allowed: true,
    response: safeRedirectNoReferrer(targetUrl, 302),
    classification
  };
}

// Exemple d’intégration :
//
// const targetUrl = parseTargetForAbuseShield(url.searchParams.get('url'));
// const isOfficiallyVerified = isWhitelistedNewsDomain(targetUrl.hostname);
// const isManuallyApproved = await isDomainManuallyApproved(env, targetUrl.hostname);
// const shield = await enforceAbuseShield({ targetUrl, env, ctx, isOfficiallyVerified, isManuallyApproved });
// if (!shield.allowed) return shield.response;
// return shield.response; // redirect no-referrer
