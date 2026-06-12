// LienLibre — protections Cloudflare avancées + statistiques détaillées
// À intégrer dans le Cloudflare Worker.
//
// Objectif : ajouter un "mode Sentinelle" défensif : liens signés, anti-abus,
// statistiques agrégées, audit de domaines inconnus et endpoints Open Data.
//
// Bindings recommandés dans wrangler.toml :
// [[kv_namespaces]]
// binding = "LIENLIBRE_KV"
// id = "..."
//
// [[kv_namespaces]]
// binding = "LIENLIBRE_WHITELIST"
// id = "..."
//
// [vars]
// PUBLIC_STATS_ENABLED = "true"
//
// Secret à créer :
// wrangler secret put LINK_SIGNING_SECRET

const ADVANCED_PROTECTION = {
  signedLinksEnabled: true,
  signatureTtlSeconds: 60 * 60 * 24 * 30, // 30 jours
  rateLimitWindowSeconds: 60,
  rateLimitMaxPerWindow: 40,
  maxUrlLength: 4000,
  allowedProtocols: new Set(['http:', 'https:']),
  statsPrefix: 'stats:v1',
  ratePrefix: 'rate:v1',
  eventPrefix: 'event:v1'
};

function b64urlEncode(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function hmacSHA256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', key, enc.encode(message));
}

async function signBridgeTarget(targetUrl, env, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!env.LINK_SIGNING_SECRET) throw new Error('MISSING_LINK_SIGNING_SECRET');
  const exp = nowSeconds + ADVANCED_PROTECTION.signatureTtlSeconds;
  const payload = `${targetUrl.toString()}|${exp}`;
  const sig = b64urlEncode(await hmacSHA256(env.LINK_SIGNING_SECRET, payload));
  return { exp, sig };
}

async function verifyBridgeSignature(targetUrl, exp, sig, env) {
  if (!ADVANCED_PROTECTION.signedLinksEnabled) return true;
  if (!env.LINK_SIGNING_SECRET) return false;
  const expNumber = Number(exp || 0);
  if (!expNumber || expNumber < Math.floor(Date.now() / 1000)) return false;
  const payload = `${targetUrl.toString()}|${expNumber}`;
  const expected = b64urlEncode(await hmacSHA256(env.LINK_SIGNING_SECRET, payload));
  return timingSafeEqual(expected, String(sig || ''));
}

function timingSafeEqual(a, b) {
  const left = String(a);
  const right = String(b);
  if (left.length !== right.length) return false;
  let out = 0;
  for (let i = 0; i < left.length; i += 1) out |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return out === 0;
}

function getClientBucket(request) {
  // Pour éviter de stocker les IP en clair, on utilise seulement une clé grossière.
  // Si vous utilisez Cloudflare Turnstile ou une session anonyme, remplacez par mieux.
  const country = request.headers.get('cf-ipcountry') || 'XX';
  const ua = request.headers.get('user-agent') || '';
  const uaClass = /facebookexternalhit|twitterbot|linkedinbot|discordbot|slackbot/i.test(ua) ? 'preview-bot' : 'browser';
  return `${country}:${uaClass}`;
}

async function checkRateLimit(request, env) {
  if (!env.LIENLIBRE_KV) return { ok: true, remaining: null };
  const now = Math.floor(Date.now() / 1000);
  const windowId = Math.floor(now / ADVANCED_PROTECTION.rateLimitWindowSeconds);
  const key = `${ADVANCED_PROTECTION.ratePrefix}:${windowId}:${getClientBucket(request)}`;
  const current = Number(await env.LIENLIBRE_KV.get(key) || 0);
  if (current >= ADVANCED_PROTECTION.rateLimitMaxPerWindow) {
    await incrementStat(env, 'security_events:rate_limited');
    return { ok: false, remaining: 0 };
  }
  await env.LIENLIBRE_KV.put(key, String(current + 1), { expirationTtl: ADVANCED_PROTECTION.rateLimitWindowSeconds * 2 });
  return { ok: true, remaining: ADVANCED_PROTECTION.rateLimitMaxPerWindow - current - 1 };
}

function parseSafeTarget(raw) {
  if (!raw || String(raw).length > ADVANCED_PROTECTION.maxUrlLength) throw new Error('INVALID_URL_LENGTH');
  const url = new URL(String(raw));
  if (!ADVANCED_PROTECTION.allowedProtocols.has(url.protocol)) throw new Error('INVALID_PROTOCOL');
  if (url.username || url.password) throw new Error('URL_WITH_CREDENTIALS');
  return url;
}

function hourKey(date = new Date()) {
  return date.toISOString().slice(0, 13) + ':00:00Z';
}

function normalizeHostForStats(hostname) {
  return String(hostname || '').toLowerCase().replace(/^www\./, '');
}

async function incrementStat(env, name, by = 1) {
  if (!env.LIENLIBRE_KV) return;
  const key = `${ADVANCED_PROTECTION.statsPrefix}:${name}`;
  const current = Number(await env.LIENLIBRE_KV.get(key) || 0);
  await env.LIENLIBRE_KV.put(key, String(current + by));
}

async function incrementJsonCounter(env, name, counterKey, by = 1) {
  if (!env.LIENLIBRE_KV) return;
  const key = `${ADVANCED_PROTECTION.statsPrefix}:${name}`;
  const obj = (await env.LIENLIBRE_KV.get(key, { type: 'json' })) || {};
  obj[counterKey] = Number(obj[counterKey] || 0) + by;
  await env.LIENLIBRE_KV.put(key, JSON.stringify(obj));
}

async function recordDetailedStats(env, { targetUrl, lang = 'fr', safety = {}, trackingCleaned = false }) {
  const host = normalizeHostForStats(targetUrl.hostname);
  await incrementStat(env, 'total_clicks');
  await incrementJsonCounter(env, 'domains', host);
  await incrementJsonCounter(env, 'languages', lang);
  await incrementJsonCounter(env, 'hourly', hourKey());

  if (trackingCleaned) await incrementStat(env, 'tracking_cleaned');

  if (safety.allowed && safety.autoWhitelisted) {
    await incrementStat(env, 'audited_domains');
    await incrementJsonCounter(env, 'trust', 'auto');
  } else if (safety.allowed) {
    await incrementJsonCounter(env, 'trust', 'verified');
  } else {
    await incrementStat(env, 'warnings_shown');
    await incrementJsonCounter(env, 'trust', 'warning');
  }

  if (safety.audit && Array.isArray(safety.audit.reasons)) {
    for (const reason of safety.audit.reasons.slice(0, 6)) {
      await incrementJsonCounter(env, 'security_events', reason);
    }
  }
}

async function readDetailedStats(env) {
  if (!env.LIENLIBRE_KV) return null;
  const [total, domains, languages, hourlyObj, trust, securityEvents, audited, warnings, trackingCleaned] = await Promise.all([
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:total_clicks`),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:domains`, { type: 'json' }),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:languages`, { type: 'json' }),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:hourly`, { type: 'json' }),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:trust`, { type: 'json' }),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:security_events`, { type: 'json' }),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:audited_domains`),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:warnings_shown`),
    env.LIENLIBRE_KV.get(`${ADVANCED_PROTECTION.statsPrefix}:tracking_cleaned`)
  ]);

  const hourly = Object.entries(hourlyObj || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-48)
    .map(([hour, clicks]) => ({ hour, clicks: Number(clicks) || 0 }));

  return {
    total_clicks: Number(total || 0),
    domains: domains || {},
    languages: languages || {},
    hourly,
    trust: trust || {},
    security_events: securityEvents || {},
    audited_domains: Number(audited || 0),
    warnings_shown: Number(warnings || 0),
    tracking_cleaned: Number(trackingCleaned || 0),
    updated_at: new Date().toISOString()
  };
}

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
      'access-control-allow-origin': '*',
      ...(init.headers || {})
    }
  });
}

async function handleDetailedStatsEndpoint(env) {
  const stats = await readDetailedStats(env);
  return jsonResponse(stats || {
    total_clicks: 0,
    domains: {},
    languages: {},
    hourly: [],
    trust: {},
    security_events: {},
    audited_domains: 0,
    warnings_shown: 0,
    updated_at: new Date().toISOString()
  });
}

// Exemple d’intégration dans votre fetch(request, env, ctx) :
//
// export default {
//   async fetch(request, env, ctx) {
//     const url = new URL(request.url);
//
//     if (url.pathname === '/api/stats/detailed') {
//       return handleDetailedStatsEndpoint(env);
//     }
//
//     const rate = await checkRateLimit(request, env);
//     if (!rate.ok) {
//       return jsonResponse({ error: 'RATE_LIMITED' }, { status: 429, headers: { 'retry-after': '60' } });
//     }
//
//     const rawTarget = url.searchParams.get('url');
//     const targetUrl = parseSafeTarget(rawTarget);
//
//     // Pour un lien généré : signez le lien renvoyé au front.
//     // const { exp, sig } = await signBridgeTarget(targetUrl, env);
//
//     // Pour une redirection : vérifiez la signature si vous activez signedLinksEnabled.
//     // const signatureOk = await verifyBridgeSignature(targetUrl, url.searchParams.get('exp'), url.searchParams.get('sig'), env);
//     // if (!signatureOk) return jsonResponse({ error: 'BAD_SIGNATURE' }, { status: 403 });
//
//     // Après votre logique d’audit/whitelist :
//     // ctx.waitUntil(recordDetailedStats(env, { targetUrl, lang: url.searchParams.get('lang') || 'fr', safety, trackingCleaned }));
//
//     // ... reste de votre Worker.
//   }
// };
