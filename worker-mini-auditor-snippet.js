// LienLibre — mini-auditeur automatique pour domaines inconnus
// À intégrer dans le Cloudflare Worker, pas dans index.html.
//
// But : quand un lien pointe vers un domaine inconnu, le Worker lit une partie du HTML,
// extrait les signaux utiles et décide si la page semble assez sûre pour éviter le
// compte à rebours anti-hameçonnage.
//
// IMPORTANT : aucun bot ne peut garantir qu’un site est 100 % non nuisible.
// Un site malveillant peut servir une page propre au bot puis changer après.
// Ce snippet utilise donc un mode prudent par défaut : le domaine devient seulement
// "candidate" pour révision manuelle. Pour autoriser une redirection immédiate après
// audit automatique, passez allowAutoRedirectAfterAudit à true — moins recommandé.
//
// Binding KV recommandé dans wrangler.toml :
// [[kv_namespaces]]
// binding = "LIENLIBRE_WHITELIST"
// id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

const MINI_AUDITOR_CONFIG = {
  enabled: true,
  requireHttpsForAutoAllow: true,
  maxRedirects: 3,
  maxHtmlBytes: 350_000,

  // Mode anti-abus recommandé : false.
  // Le mini-bot peut marquer un domaine comme "candidate", mais seul un domaine
  // manuel/vérifié évite automatiquement la barrière de 10 secondes.
  // Si vous acceptez plus de risque, passez à true.
  allowAutoRedirectAfterAudit: false,

  autoWhitelistTtlSeconds: 60 * 60 * 24 * 30, // 30 jours
  userAgent: 'LienLibre-SafetyBot/1.0 (+https://bwillou1.github.io/LienLibre/; security audit for anti-phishing)',
  blockedShorteners: new Set([
    'bit.ly', 't.co', 'tinyurl.com', 'goo.gl', 'ow.ly', 'buff.ly', 'cutt.ly',
    'is.gd', 'rebrand.ly', 'shorturl.at', 'lnkd.in', 'urlz.fr', 'rb.gy'
  ])
};

function normalizeHost(hostname) {
  return String(hostname || '')
    .trim()
    .toLowerCase()
    .replace(/^www\./, '');
}

function isUnsafeHostForFetch(hostname) {
  const host = normalizeHost(hostname);
  if (!host) return true;
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  if (host.startsWith('[') && host.endsWith(']')) return true; // IP littérales IPv6

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;

  const parts = ipv4.slice(1).map(Number);
  if (parts.some(part => Number.isNaN(part) || part < 0 || part > 255)) return true;

  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function parseTargetUrl(input) {
  const url = input instanceof URL ? new URL(input.toString()) : new URL(String(input));
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('INVALID_PROTOCOL');
  if (url.username || url.password) throw new Error('URL_WITH_CREDENTIALS');
  if (isUnsafeHostForFetch(url.hostname)) throw new Error('UNSAFE_HOST');
  return url;
}

async function readLimitedText(response, maxBytes) {
  if (!response.body || !response.body.getReader) {
    const text = await response.text();
    return { text: text.slice(0, maxBytes), truncated: text.length > maxBytes };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  let total = 0;
  let truncated = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const remaining = maxBytes - total;
    if (value.byteLength > remaining) {
      chunks.push(decoder.decode(value.slice(0, Math.max(0, remaining)), { stream: false }));
      truncated = true;
      try { await reader.cancel(); } catch (_) {}
      break;
    }

    chunks.push(decoder.decode(value, { stream: true }));
    total += value.byteLength;
  }

  chunks.push(decoder.decode());
  return { text: chunks.join(''), truncated };
}

async function safeFetchHtml(startUrl, config = MINI_AUDITOR_CONFIG) {
  let current = parseTargetUrl(startUrl);
  const redirects = [];

  for (let i = 0; i <= config.maxRedirects; i += 1) {
    const response = await fetch(current.toString(), {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
        'User-Agent': config.userAgent
      }
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('REDIRECT_WITHOUT_LOCATION');
      const next = parseTargetUrl(new URL(location, current).toString());
      redirects.push({ from: current.toString(), to: next.toString(), status: response.status });
      current = next;
      continue;
    }

    const contentType = response.headers.get('content-type') || '';
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength && contentLength > config.maxHtmlBytes * 3) throw new Error('HTML_TOO_LARGE');

    const { text, truncated } = await readLimitedText(response, config.maxHtmlBytes);
    return {
      response,
      finalUrl: current,
      redirects,
      html: text,
      truncated,
      contentType
    };
  }

  throw new Error('TOO_MANY_REDIRECTS');
}

function getTagAttribute(tag, attrName) {
  const attrRegex = new RegExp(`${attrName}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  const match = String(tag || '').match(attrRegex);
  return match ? match[2].trim() : '';
}

function extractMetaFromHtml(html) {
  const source = String(html || '');
  const meta = {};

  const titleMatch = source.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) meta.title = decodeBasicEntities(titleMatch[1].trim());

  const metaTags = source.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const property = getTagAttribute(tag, 'property') || getTagAttribute(tag, 'name');
    const content = getTagAttribute(tag, 'content');
    if (!property || !content) continue;

    const key = property.toLowerCase();
    if (key === 'og:title') meta.ogTitle = decodeBasicEntities(content);
    if (key === 'og:description' || key === 'description') meta.description = decodeBasicEntities(content);
    if (key === 'og:image') meta.image = content;
    if (key === 'og:type') meta.ogType = content.toLowerCase();
  }

  const canonicalTag = source.match(/<link\b[^>]*rel\s*=\s*(["'])canonical\1[^>]*>/i) ||
    source.match(/<link\b[^>]*href\s*=\s*(["']).*?\1[^>]*rel\s*=\s*(["'])canonical\2[^>]*>/i);
  if (canonicalTag) meta.hasCanonical = true;

  meta.hasArticleTag = /<article\b/i.test(source);
  meta.hasNewsSchema = /NewsArticle|Article|ReportageNewsArticle|schema\.org\/Article/i.test(source);
  return meta;
}

function decodeBasicEntities(text) {
  return String(text || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtmlToText(html) {
  return decodeBasicEntities(String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' '));
}

function countCrossOriginForms(html, finalUrl) {
  const forms = String(html || '').match(/<form\b[^>]*>/gi) || [];
  let crossOrigin = 0;

  for (const form of forms) {
    const action = getTagAttribute(form, 'action');
    if (!action) continue;
    try {
      const actionUrl = new URL(action, finalUrl);
      if (normalizeHost(actionUrl.hostname) !== normalizeHost(finalUrl.hostname)) crossOrigin += 1;
    } catch (_) {
      crossOrigin += 1;
    }
  }

  return { total: forms.length, crossOrigin };
}

function scoreAuditedHtml({ startUrl, finalUrl, html, contentType, response, redirects, truncated }, config = MINI_AUDITOR_CONFIG) {
  const reasons = [];
  const trustSignals = [];
  const hardFails = [];
  let riskScore = 0;
  let trustScore = 0;

  const startHost = normalizeHost(startUrl.hostname);
  const finalHost = normalizeHost(finalUrl.hostname);
  const text = stripHtmlToText(html);
  const meta = extractMetaFromHtml(html);
  const forms = countCrossOriginForms(html, finalUrl);

  if (config.requireHttpsForAutoAllow && finalUrl.protocol !== 'https:') {
    riskScore += 4;
    reasons.push('http-not-https');
  } else {
    trustScore += 1;
    trustSignals.push('https');
  }

  if (!response.ok) {
    hardFails.push(`bad-status-${response.status}`);
    riskScore += 8;
  }

  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
    hardFails.push('not-html');
    riskScore += 8;
  }

  if (config.blockedShorteners.has(startHost) || config.blockedShorteners.has(finalHost)) {
    riskScore += 5;
    reasons.push('url-shortener');
  }

  if (redirects.length > 0) {
    riskScore += redirects.length;
    reasons.push(`redirects-${redirects.length}`);
  }

  if (startHost !== finalHost) {
    riskScore += 2;
    reasons.push('host-changed-after-redirect');
  }

  if (truncated) {
    riskScore += 1;
    reasons.push('html-truncated');
  }

  if (text.length >= 700) {
    trustScore += 1;
    trustSignals.push('enough-visible-text');
  } else {
    riskScore += 2;
    reasons.push('too-little-visible-text');
  }

  if (meta.ogTitle || meta.title) {
    trustScore += 1;
    trustSignals.push('title-found');
  } else {
    riskScore += 1;
    reasons.push('missing-title');
  }

  if (meta.description) {
    trustScore += 1;
    trustSignals.push('description-found');
  }

  if (meta.image) {
    trustScore += 1;
    trustSignals.push('og-image-found');
  }

  if (meta.hasArticleTag || meta.hasNewsSchema || /\b(article|news|actualit|journal|press|presse|media|média)\b/i.test(text)) {
    trustScore += 1;
    trustSignals.push('article-like-page');
  }

  if (/<input\b[^>]*type\s*=\s*(["'])password\1/i.test(html)) {
    riskScore += 8;
    reasons.push('password-input');
  }

  if (forms.total > 0) {
    riskScore += Math.min(3, forms.total);
    reasons.push(`forms-${forms.total}`);
  }

  if (forms.crossOrigin > 0) {
    riskScore += forms.crossOrigin * 4;
    reasons.push(`cross-origin-forms-${forms.crossOrigin}`);
  }

  if (/\b(?:\.exe|\.scr|\.msi|\.apk|\.dmg|\.pkg|\.bat|\.cmd|\.ps1)(?:["'?#\s>]|$)/i.test(html)) {
    riskScore += 7;
    reasons.push('executable-download-link');
  }

  if (/javascript\s*:/i.test(html)) {
    riskScore += 2;
    reasons.push('javascript-url');
  }

  if (/<meta\b[^>]*http-equiv\s*=\s*(["'])refresh\1/i.test(html)) {
    riskScore += 4;
    reasons.push('meta-refresh');
  }

  const autoAllow = hardFails.length === 0 && riskScore <= 2 && trustScore >= 4;

  return {
    allowed: autoAllow,
    decision: autoAllow ? 'auto-allow' : 'countdown-required',
    riskScore,
    trustScore,
    reasons,
    trustSignals,
    hardFails,
    meta: {
      title: meta.ogTitle || meta.title || '',
      description: meta.description || '',
      image: meta.image || '',
      ogType: meta.ogType || ''
    },
    finalUrl: finalUrl.toString()
  };
}

async function auditUnknownUrl(inputUrl, config = MINI_AUDITOR_CONFIG) {
  const startUrl = parseTargetUrl(inputUrl);
  const fetched = await safeFetchHtml(startUrl, config);
  return scoreAuditedHtml({ startUrl, ...fetched }, config);
}

async function getAutoWhitelistRecord(env, hostname) {
  if (!env || !env.LIENLIBRE_WHITELIST) return null;
  const key = `host:${normalizeHost(hostname)}`;
  return env.LIENLIBRE_WHITELIST.get(key, { type: 'json' });
}

async function putAutoWhitelistRecord(env, hostname, audit) {
  if (!env || !env.LIENLIBRE_WHITELIST) return false;

  const host = normalizeHost(hostname);
  const key = `host:${host}`;
  const record = {
    host,
    status: MINI_AUDITOR_CONFIG.allowAutoRedirectAfterAudit ? 'auto' : 'candidate',
    source: 'mini-auditor',
    createdAt: new Date().toISOString(),
    expiresInSeconds: MINI_AUDITOR_CONFIG.autoWhitelistTtlSeconds,
    audit: {
      riskScore: audit.riskScore,
      trustScore: audit.trustScore,
      trustSignals: audit.trustSignals,
      reasons: audit.reasons,
      finalUrl: audit.finalUrl
    }
  };

  await env.LIENLIBRE_WHITELIST.put(key, JSON.stringify(record), {
    expirationTtl: MINI_AUDITOR_CONFIG.autoWhitelistTtlSeconds
  });

  return true;
}

async function auditAndMaybeWhitelistUnknownDomain(targetUrl, env) {
  if (!MINI_AUDITOR_CONFIG.enabled) {
    return { allowed: false, source: 'mini-auditor-disabled' };
  }

  const parsed = parseTargetUrl(targetUrl);
  const host = normalizeHost(parsed.hostname);

  const existing = await getAutoWhitelistRecord(env, host);
  if (existing && ['verified', 'manual'].includes(existing.status)) {
    return {
      allowed: true,
      source: `kv-${existing.status}`,
      autoWhitelisted: false,
      audit: existing.audit || null
    };
  }

  if (existing && existing.status === 'auto' && MINI_AUDITOR_CONFIG.allowAutoRedirectAfterAudit) {
    return {
      allowed: true,
      source: 'kv-auto',
      autoWhitelisted: true,
      audit: existing.audit || null
    };
  }

  if (existing && existing.status === 'candidate') {
    return {
      allowed: false,
      source: 'kv-candidate',
      autoAudited: true,
      candidateForManualReview: true,
      autoWhitelisted: false,
      audit: existing.audit || null
    };
  }

  try {
    const audit = await auditUnknownUrl(parsed);
    if (audit.allowed) {
      const saved = await putAutoWhitelistRecord(env, host, audit);
      const autoRedirect = MINI_AUDITOR_CONFIG.allowAutoRedirectAfterAudit === true;
      return {
        allowed: autoRedirect,
        source: 'mini-auditor',
        autoAudited: true,
        candidateForManualReview: !autoRedirect,
        autoWhitelisted: saved && autoRedirect,
        audit
      };
    }

    return {
      allowed: false,
      source: 'mini-auditor',
      autoWhitelisted: false,
      audit
    };
  } catch (error) {
    return {
      allowed: false,
      source: 'mini-auditor-error',
      autoWhitelisted: false,
      audit: {
        decision: 'countdown-required',
        error: error && error.message ? error.message : String(error)
      }
    };
  }
}

// Exemple d’intégration dans votre Worker existant :
//
// async function resolveAllowedStatus(targetUrl, env) {
//   const host = normalizeHost(targetUrl.hostname);
//
//   // 1. Votre whitelist officielle existante.
//   let allowed = isWhitelistedNewsDomain(host) || isOfficialLienLibreTarget(targetUrl);
//   let autoWhitelisted = false;
//   let audit = null;
//
//   // 2. Si domaine inconnu, lancer le mini-auditeur.
//   if (!allowed) {
//     const result = await auditAndMaybeWhitelistUnknownDomain(targetUrl, env);
//     allowed = result.allowed;
//     autoWhitelisted = result.autoWhitelisted === true;
//     audit = result.audit || null;
//   }
//
//   return { allowed, autoWhitelisted, audit };
// }
//
// Ensuite, dans la réponse JSON utilisée par index.html :
//
// const safety = await resolveAllowedStatus(targetUrl, env);
// return new Response(JSON.stringify({
//   allowed: safety.allowed,
//   autoWhitelisted: safety.autoWhitelisted,
//   audit: safety.audit,
//   title,
//   description,
//   image,
//   trackingCleaned
// }), { headers: { 'content-type': 'application/json; charset=utf-8' } });
//
// Et dans la redirection utilisateur :
//
// if (safety.allowed) {
//   return Response.redirect(targetUrl.toString(), 302);
// }
// return renderCountdownWarning(targetUrl, safety.audit);
