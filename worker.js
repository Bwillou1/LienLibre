/**
 * LIENLIBRE - BACKEND (Cloudflare Worker)
 * 
 * Ce script écoute les requêtes GET contenant un paramètre `?url=...`.
 * Il récupère l'HTML du site cible en contournant les WAF (User-Agent/Headers spoofing),
 * extrait les métadonnées Open Graph (avec fallbacks Twitter et HTML5 standard),
 * puis génère :
 * - Une redirection instantanée si le domaine est dans la liste de confiance.
 * - Une page d'avertissement de sécurité (avec IP et bouton continuer) si le domaine est suspect,
 *   tout en conservant l'affichage de la miniature (Open Graph) pour les robots de Meta.
 */

// Headers complets pour imiter un navigateur de bureau moderne et contourner les protections WAF
const SPOOF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "fr-CA,fr;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1"
};

// En-têtes CORS globaux pour autoriser le frontend
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400"
};

// En-têtes HTTP de sécurité globaux
const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src *; data: *;",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

// Liste blanche des médias canadiens autorisés (Redirection directe instantanée)
const ALLOWED_DOMAINS = [
  // Nationaux & Majeurs
  "lapresse.ca",
  "radio-canada.ca",
  "cbc.ca",
  "ctvnews.ca",
  "tvanouvelles.ca",
  "ledevoir.com",
  "journaldemontreal.com",
  "journaldequebec.com",
  "theglobeandmail.com",
  "nationalpost.com",
  "thestar.com",
  "torontostar.com",
  "globalnews.ca",
  "rds.ca",
  "tsn.ca",
  "noovo.info",
  "lactualite.com",
  "lesaffaires.com",
  "macleans.ca",
  "tvo.org",
  "cheknews.ca",
  "hilltimes.com",
  
  // Coopératives de l'information (Québec)
  "lesoleil.com",
  "latribune.ca",
  "lenouvelliste.ca",
  "ledroit.com",
  "lequotidien.com",
  "lavoixdelest.ca",

  // Quotidiens Régionaux (Ontario)
  "thespec.com",
  "windsorstar.com",
  "thesudburystar.com",
  "thewhig.com",
  "stcatharinesstandard.ca",
  "wellandtribune.ca",
  "niagarafallsreview.ca",
  "peterboroughexaminer.com",
  "saultstar.com",
  "northbaynugget.ca",
  "theintelligencer.ca",
  "standard-freeholder.com",
  "recorder.ca",
  "chroniclejournal.com",

  // Ouest Canadien & Prairies
  "vancouversun.com",
  "theprovince.com",
  "calgaryherald.com",
  "edmontonjournal.com",
  "winnipegfreepress.com",
  "leaderpost.com",
  "thestarphoenix.com",
  "timescolonist.com",
  "dailyhive.com",
  "narcity.com",
  "thetyee.ca",
  "nationalobserver.com",
  "castanet.net",
  "pentictonherald.ca",
  "kelownadailycourier.ca",
  "brandonsun.com",
  "sasktoday.ca",
  "cjme.com",
  "ckom.com",
  "paherald.sk.ca",
  "stalbertgazette.com",
  "cochranetoday.ca",
  "okotokstoday.ca",
  "reddeeradvocate.com",
  "medicinehatnews.com",
  "lethbridgeherald.com",
  "vancouverisawesome.com",
  "pgcitizen.ca",

  // Provinces de l'Atlantique & Acadie
  "saltwire.com",
  "thetelegram.com",
  "theguardian.pe.ca",
  "capebretonpost.com",
  "chronicleherald.ca",
  "acadienouvelle.com",
  "l-express.ca",

  // Hebdomadaires et hyperlocaux (Québec)
  "journalmetro.com",
  "les2rives.com",
  "lecourrier.qc.ca",
  "lecharlevoisien.com",
  "lecitoyenvaldor.com",
  "lecitoyenrouyn.com",
  "laction.com",
  "lanouvelle.net",
  "courrierfrontenac.qc.ca",
  "lecanadafrancais.qc.ca",
  "journalexpress.ca",
  "lhebdojournal.com",
  "lecourrierdesud.ca",
  "soreltracy.com",
  "infodimanche.com",
  "enbeauce.com",
  "neomedia.com",
  "lavantage.qc.ca",
  "urbania.ca",
  
  // Radios et médias locaux
  "iheartradio.ca",
  "chga.fm",
  "cime.fm",
  "cjso.ca",
  "republiquedebagages.ca"
];

/**
 * Vérifie si le domaine cible fait partie des médias canadiens de confiance.
 */
function isDomainAllowed(hostname) {
  const cleanHost = hostname.toLowerCase().replace(/^www\./, "");
  return ALLOWED_DOMAINS.some(domain => cleanHost === domain || cleanHost.endsWith("." + domain));
}

export default {
  async fetch(request, env, ctx) {
    // 1. Gérer les requêtes CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // Uniquement accepter les requêtes GET
    if (request.method !== "GET") {
      return new Response("Méthode non autorisée", { 
        status: 405, 
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" } 
      });
    }

    const requestUrl = new URL(request.url);
    const targetUrlString = requestUrl.searchParams.get("url");

    // Si aucune URL n'est passée, afficher une page de bienvenue informative
    if (!targetUrlString) {
      return new Response(getWelcomeHTML(), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          ...SECURITY_HEADERS,
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    // 2. Valider et formater l'URL cible
    let targetUrl;
    try {
      targetUrl = new URL(targetUrlString.trim());
      if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
        throw new Error("Le protocole doit être HTTP ou HTTPS");
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "URL invalide ou mal formée." }), {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    const isJsonRequested = 
      requestUrl.searchParams.get("json") === "1" || 
      requestUrl.searchParams.get("json") === "true" ||
      (request.headers.get("Accept") || "").includes("application/json");

    const isAllowed = isDomainAllowed(targetUrl.hostname);

    // 3. Extraire les métadonnées de la page cible
    const meta = {
      title: "",
      description: "",
      image: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      standardTitle: "",
      fallbackImages: []
    };

    try {
      // Effectuer la requête vers le média canadien avec nos en-têtes de spoofing
      const response = await fetch(targetUrl.href, {
        headers: SPOOF_HEADERS,
        redirect: "follow"
      });

      if (response.ok) {
        // Utiliser HTMLRewriter de Cloudflare pour extraire en streaming les balises de métadonnées
        const rewriter = new HTMLRewriter()
          .on('meta[property="og:title"]', {
            element(el) { meta.title = el.getAttribute("content") || ""; }
          })
          .on('meta[property="og:description"]', {
            element(el) { meta.description = el.getAttribute("content") || ""; }
          })
          .on('meta[property="og:image"]', {
            element(el) { meta.image = el.getAttribute("content") || ""; }
          })
          .on('meta[name="twitter:title"]', {
            element(el) { meta.twitterTitle = el.getAttribute("content") || ""; }
          })
          .on('meta[name="twitter:description"]', {
            element(el) { meta.twitterDescription = el.getAttribute("content") || ""; }
          })
          .on('meta[name="twitter:image"]', {
            element(el) { meta.twitterImage = el.getAttribute("content") || ""; }
          })
          .on('title', {
            text(textChunk) { meta.standardTitle += textChunk.text; }
          })
          .on('article img, main img, header img', {
            element(el) {
              const src = el.getAttribute("src");
              if (src && meta.fallbackImages.length < 5) {
                meta.fallbackImages.push(src);
              }
            }
          });

        const transformedResponse = rewriter.transform(response);
        await transformedResponse.arrayBuffer(); // Déclenche le parsing
      }
    } catch (err) {
      console.error("Erreur lors du scraping :", err);
    }

    // 4. Appliquer la logique de Fallback
    const finalTitle = (meta.title || meta.twitterTitle || meta.standardTitle || targetUrl.hostname).trim();
    const finalDescription = (meta.description || meta.twitterDescription || "Cliquez pour lire l'article complet sur " + targetUrl.hostname).trim();
    
    let rawImage = meta.image || meta.twitterImage;
    if (!rawImage && meta.fallbackImages.length > 0) {
      rawImage = meta.fallbackImages[0];
    }
    
    const finalImage = rawImage ? resolveUrl(targetUrl.href, rawImage) : "";

    // 5. Renvoyer la réponse selon le format demandé
    if (isJsonRequested) {
      return new Response(
        JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          image: finalImage,
          url: targetUrl.href,
          allowed: isAllowed
        }),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json; charset=utf-8"
          }
        }
      );
    }

    // Si le domaine est dans la liste blanche ➡️ Redirection immédiate
    if (isAllowed) {
      return new Response(
        generateRedirectionHTML(targetUrl.href, finalTitle, finalDescription, finalImage),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            ...SECURITY_HEADERS,
            "Content-Type": "text/html; charset=utf-8"
          }
        }
      );
    }

    // Si le domaine est suspect ➡️ Page d'avertissement avec IP (mais miniature préservée pour les bots)
    const userIp = request.headers.get("CF-Connecting-IP") || "Inconnue";
    return new Response(
      generateWarningHTML(targetUrl.href, finalTitle, finalDescription, finalImage, userIp),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          ...SECURITY_HEADERS,
          "Content-Type": "text/html; charset=utf-8"
        }
      }
    );
  }
};

/**
 * Résout une URL relative par rapport à une URL de base.
 */
function resolveUrl(baseUrl, relativeUrl) {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch (e) {
    return relativeUrl;
  }
}

/**
 * Échappe les caractères HTML sensibles pour éviter les failles XSS.
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Génère le HTML pour rediriger l'utilisateur tout en affichant l'aperçu Open Graph pour les bots.
 */
function generateRedirectionHTML(targetUrl, title, description, image) {
  const escapedUrl = escapeHtml(targetUrl);
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImg = escapeHtml(image);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  
  <!-- Balises Open Graph pour Facebook, Instagram, LinkedIn, Discord -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapedUrl}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDesc}">
  ${escapedImg ? `<meta property="og:image" content="${escapedImg}">` : ""}
  <meta property="og:site_name" content="LienLibre">
  
  <!-- Balises Meta Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapedUrl}">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDesc}">
  ${escapedImg ? `<meta name="twitter:image" content="${escapedImg}">` : ""}

  <!-- Redirection automatique côté client (immédiate) -->
  <meta http-equiv="refresh" content="0;url=${escapedUrl}">
  
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 2.5rem;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.05);
      border-top: 3px solid #06b6d4;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #f3f4f6;
    }
    p {
      color: #9ca3af;
      font-size: 0.95rem;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }
    .link-btn {
      display: inline-block;
      background-color: #0891b2;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .link-btn:hover {
      background-color: #0e7490;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h1>Redirection sécurisée</h1>
    <p>LienLibre vous redirige vers l'article d'origine :<br><strong style="color: #e5e7eb; word-break: break-all;">${escapedTitle}</strong></p>
    <p style="font-size: 0.85rem;">Si la redirection automatique ne fonctionne pas après quelques secondes, veuillez cliquer ci-dessous.</p>
    <a href="${escapedUrl}" class="link-btn">Accéder à l'article</a>
  </div>

  <script>
    window.location.href = ${JSON.stringify(targetUrl)};
  </script>
</body>
</html>`;
}

/**
 * Génère une page d'avertissement de sécurité (phishing/spam) pour les domaines non vérifiés.
 * Les balises Open Graph de la cible sont incluses dans le <head> pour que la miniature s'affiche tout de même sur Meta.
 */
function generateWarningHTML(targetUrl, title, description, image, userIp) {
  const escapedUrl = escapeHtml(targetUrl);
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImg = escapeHtml(image);
  const escapedIp = escapeHtml(userIp);
  const hostname = new URL(targetUrl).hostname;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Avertissement de Sécurité - LienLibre</title>
  
  <!-- Balises Open Graph pour afficher l'aperçu sur Facebook/Instagram -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapedUrl}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDesc}">
  ${escapedImg ? `<meta property="og:image" content="${escapedImg}">` : ""}
  <meta property="og:site_name" content="LienLibre">
  
  <!-- Balises Meta Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapedUrl}">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDesc}">
  ${escapedImg ? `<meta name="twitter:image" content="${escapedImg}">` : ""}

  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #020617;
      color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 1rem;
      padding: 2.5rem;
      max-width: 550px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
    }
    .icon-container {
      width: 4rem;
      height: 4rem;
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .icon {
      color: #ef4444;
      font-size: 2rem;
      font-weight: bold;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: #f87171;
    }
    p {
      color: #9ca3af;
      font-size: 0.95rem;
      margin: 0 0 1.5rem;
      line-height: 1.6;
    }
    .info-box {
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: left;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
    }
    .info-row {
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
      flex-shrink: 0;
    }
    .info-value {
      color: #e5e7eb;
      font-family: monospace;
      word-break: break-all;
      text-align: right;
    }
    .btn-report {
      display: block;
      background-color: #ef4444;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: background-color 0.2s;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .btn-report:hover {
      background-color: #dc2626;
    }
    .advanced-toggle {
      background: none;
      border: none;
      color: #6b7280;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: underline;
      padding: 0.5rem;
    }
    .advanced-toggle:hover {
      color: #9ca3af;
    }
    .advanced-content {
      display: none;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.85rem;
      color: #9ca3af;
    }
    .btn-continue {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #d1d5db;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      margin-top: 0.5rem;
      transition: all 0.2s;
    }
    .btn-continue:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-container">
      <span class="icon">⚠️</span>
    </div>
    <h1>Lien non vérifié</h1>
    <p>Ce lien redirige vers un site qui ne figure pas dans notre liste de confiance des médias canadiens. Par mesure de sécurité pour éviter le hameçonnage (phishing), la redirection n'est pas automatique.</p>
    
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Destination :</span>
        <span class="info-value">${escapeHtml(hostname)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Votre IP publique :</span>
        <span class="info-value">${escapedIp}</span>
      </div>
    </div>

    <a href="https://www.antifraudcentre-centreantifraude.ca/report-signalez-fra.htm" target="_blank" rel="noopener noreferrer" class="btn-report">
      Signaler une tentative de fraude
    </a>

    <button class="advanced-toggle" onclick="toggleAdvanced()">Options avancées</button>
    
    <div id="advanced-content" class="advanced-content">
      <p>Si vous faites confiance à ce site, vous pouvez continuer vers la page d'origine.</p>
      <a href="${escapedUrl}" class="btn-continue">Continuer vers le site (non recommandé)</a>
    </div>
  </div>

  <script>
    function toggleAdvanced() {
      const content = document.getElementById('advanced-content');
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
        content.scrollIntoView({ behavior: 'smooth' });
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Génère le HTML pour la page d'accueil du Worker (si appelé sans ?url=)
 */
function getWelcomeHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LienLibre - Service Proxy d'Actualités</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: 1rem;
      padding: 3rem;
      max-width: 600px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem;
      background: linear-gradient(to right, #22d3ee, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #9ca3af;
      font-size: 1.05rem;
      margin: 0 0 2rem;
      line-height: 1.6;
    }
    code {
      background-color: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      color: #22d3ee;
      font-family: monospace;
      font-size: 0.95rem;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      color: #4ade80;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 2rem;
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 8px #22c55e;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="status"><span class="dot"></span> Backend Actif</div>
    <h1>LienLibre API</h1>
    <p>Ceci est l'instance Cloudflare Worker de l'application open-source <strong>LienLibre</strong>. Ce service sert de passerelle de contournement et d'extraction de métadonnées.</p>
    <p>Pour l'utiliser, passez un paramètre URL encodé :<br><code>?url=https://adresse-du-media.com/article</code></p>
    <p style="font-size: 0.9rem; color: #6b7280;">Pour configurer votre interface utilisateur, déployez le code frontend et pointez la variable <code>WORKER_URL</code> vers cette adresse.</p>
  </div>
</body>
</html>`;
}
