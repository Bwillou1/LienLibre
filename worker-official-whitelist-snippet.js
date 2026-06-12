// LienLibre — snippet à intégrer dans le Cloudflare Worker
// Objectif : reconnaître le site officiel LienLibre, son dépôt GitHub et leurs sous-chemins
// comme destinations de confiance afin d’éviter un faux positif dans votre propre barrière
// anti-hameçonnage de 10 secondes.
//
// Important : ceci ne force pas Meta à accepter un lien. Cela évite seulement que votre
// propre logique Worker classe le projet officiel comme "domaine non vérifié".

const OFFICIAL_LIENLIBRE_TARGETS = [
  {
    host: 'bwillou1.github.io',
    pathPrefixes: ['/LienLibre', '/LienLibre/']
  },
  {
    host: 'github.com',
    pathPrefixes: ['/Bwillou1/LienLibre', '/bwillou1/LienLibre', '/bwillou1/lienlibre']
  },
  {
    host: 'raw.githubusercontent.com',
    pathPrefixes: ['/Bwillou1/LienLibre', '/bwillou1/LienLibre', '/bwillou1/lienlibre']
  }
];

function isOfficialLienLibreTarget(inputUrl) {
  let url;
  try {
    url = inputUrl instanceof URL ? inputUrl : new URL(String(inputUrl));
  } catch (_) {
    return false;
  }

  if (!['http:', 'https:'].includes(url.protocol)) return false;

  const host = url.hostname.toLowerCase();
  const pathname = url.pathname;
  const pathnameLower = pathname.toLowerCase();

  return OFFICIAL_LIENLIBRE_TARGETS.some(target => {
    if (host !== target.host.toLowerCase()) return false;
    return target.pathPrefixes.some(prefix => {
      const prefixLower = prefix.toLowerCase();
      return pathnameLower === prefixLower || pathnameLower.startsWith(prefixLower + '/');
    });
  });
}

// Exemple d’intégration dans votre Worker :
//
// const targetUrl = new URL(originalUrl);
// let allowed = isWhitelistedNewsDomain(targetUrl.hostname);
//
// if (isOfficialLienLibreTarget(targetUrl)) {
//   allowed = true;
// }
//
// return new Response(JSON.stringify({
//   allowed,
//   title,
//   description,
//   image
// }), { headers: { 'content-type': 'application/json; charset=utf-8' } });
