/**
 * LIENLIBRE - BACKEND (Cloudflare Worker)
 * 
 * Ce script écoute les requêtes GET contenant un paramètre `?url=...`.
 * Il récupère l'HTML du site cible en contournant les WAF (User-Agent/Headers spoofing),
 * extrait les métadonnées Open Graph (avec fallbacks Twitter et HTML5 standard),
 * puis génère une page HTML de redirection instantanée contenant les balises OG.
 * Il supporte également les requêtes JSON pour la prévisualisation dans le frontend.
 */

// Headers complets pour imiter un navigateur de bureau moderne et contourner les protections anti-scraping (WAF)
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

    // Détecter si le client demande du JSON (pour la prévisualisation dans le frontend)
    const isJsonRequested = 
      requestUrl.searchParams.get("json") === "1" || 
      requestUrl.searchParams.get("json") === "true" ||
      (request.headers.get("Accept") || "").includes("application/json");

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

        // Exécuter la réécriture pour forcer le parsing des flux
        const transformedResponse = rewriter.transform(response);
        await transformedResponse.arrayBuffer(); // Déclenche le streaming et remplit l'objet "meta"
      }
    } catch (err) {
      console.error("Erreur lors du scraping :", err);
      // Nous ne levons pas d'erreur ici. Si le site bloque ou tombe, la redirection fonctionnera toujours!
    }

    // 4. Appliquer la logique de Fallback multiniveau
    const finalTitle = (meta.title || meta.twitterTitle || meta.standardTitle || targetUrl.hostname).trim();
    const finalDescription = (meta.description || meta.twitterDescription || "Cliquez pour lire l'article complet sur " + targetUrl.hostname).trim();
    
    let rawImage = meta.image || meta.twitterImage;
    if (!rawImage && meta.fallbackImages.length > 0) {
      rawImage = meta.fallbackImages[0];
    }
    
    // Résoudre l'URL de l'image si elle est relative
    const finalImage = rawImage ? resolveUrl(targetUrl.href, rawImage) : "";

    // 5. Renvoyer la réponse selon le format demandé
    if (isJsonRequested) {
      return new Response(
        JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          image: finalImage,
          url: targetUrl.href
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

    // Renvoyer le HTML de redirection avec les balises Open Graph
    return new Response(
      generateRedirectionHTML(targetUrl.href, finalTitle, finalDescription, finalImage),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
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
    // Redirection Javascript de secours immédiate
    window.location.href = ${JSON.stringify(targetUrl)};
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
