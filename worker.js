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
 * 
 * NOUVELLES FONCTIONNALITÉS :
 * - Anti-Tracking : Nettoyage automatique des paramètres de pistage Meta/Google (fbclid, utm_*, etc.).
 * - Statistiques en temps réel : Enregistrement anonyme des clics et domaines via Cloudflare KV (LIENLIBRE_KV).
 * - Mode "Abonnement" : Bannière d'incitation à soutenir le journalisme local.
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
   "therover.ca",
  
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

/**
 * Nettoie les paramètres de pistage Meta/Google (Anti-Tracking).
 */
function cleanTrackingParameters(urlStr) {
  try {
    const parsed = new URL(urlStr);
    const paramsToStrip = [
      "fbclid", "gclid", "utm_source", "utm_medium", "utm_campaign", 
      "utm_term", "utm_content", "msclkid", "mc_eid", "yclid", 
      "twclid", "dclid", "_hsenc", "_hsmi"
    ];
    let strippedAny = false;
    for (const param of paramsToStrip) {
      if (parsed.searchParams.has(param)) {
        parsed.searchParams.delete(param);
        strippedAny = true;
      }
    }
    return { cleanedUrl: parsed.href, strippedAny };
  } catch (e) {
    return { cleanedUrl: urlStr, strippedAny: false };
  }
}

/**
 * Enregistre un clic de manière 100% anonyme dans le stockage Cloudflare KV.
 */
async function recordClick(env, hostname) {
  if (!env || !env.LIENLIBRE_KV) return;
  try {
    const cleanHost = hostname.toLowerCase().replace(/^www\./, "");
    
    // 1. Incrémenter le total global
    const totalKey = "stats:total_clicks";
    let total = parseInt(await env.LIENLIBRE_KV.get(totalKey) || "0");
    await env.LIENLIBRE_KV.put(totalKey, (total + 1).toString());

    // 2. Incrémenter la statistique du domaine
    const domainKey = `stats:domain:${cleanHost}`;
    let domainTotal = parseInt(await env.LIENLIBRE_KV.get(domainKey) || "0");
    await env.LIENLIBRE_KV.put(domainKey, (domainTotal + 1).toString());
  } catch (e) {
    console.error("Erreur d'écriture KV :", e);
  }
}

/**
 * Récupère les statistiques agrégées depuis le stockage Cloudflare KV.
 */
async function getStats(env) {
  if (!env || !env.LIENLIBRE_KV) {
    // Fallback si KV n'est pas configuré pour éviter de faire planter le site
    return { total_clicks: 0, domains: {} };
  }
  try {
    const totalClicks = parseInt(await env.LIENLIBRE_KV.get("stats:total_clicks") || "0");
    
    // Lister toutes les clés de domaine
    const listResult = await env.LIENLIBRE_KV.list({ prefix: "stats:domain:" });
    const domains = {};
    
    for (const key of listResult.keys) {
      const val = await env.LIENLIBRE_KV.get(key.name) || "0";
      const domainName = key.name.replace("stats:domain:", "");
      domains[domainName] = parseInt(val);
    }
    
    return { total_clicks: totalClicks, domains };
  } catch (e) {
    return { total_clicks: 0, domains: {}, error: e.message };
  }
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

    const requestUrl = new URL(request.url);
    const lang = (requestUrl.searchParams.get("lang") || "fr").toLowerCase();

    // 2. Point de terminaison API Stats
    if (requestUrl.pathname === "/api/stats") {
      const stats = await getStats(env);
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    // Uniquement accepter les requêtes GET pour le reste
    if (request.method !== "GET") {
      return new Response("Méthode non autorisée", { 
        status: 405, 
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" } 
      });
    }

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

    // 3. Valider et formater l'URL cible
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

    // 4. Anti-Tracking : Nettoyer l'URL cible
    const { cleanedUrl, strippedAny } = cleanTrackingParameters(targetUrl.href);
    targetUrl = new URL(cleanedUrl); // Utiliser l'URL nettoyée des mouchards

    const isJsonRequested = 
      requestUrl.searchParams.get("json") === "1" || 
      requestUrl.searchParams.get("json") === "true" ||
      (request.headers.get("Accept") || "").includes("application/json");

    const isAllowed = isDomainAllowed(targetUrl.hostname);

    // Enregistrer le clic de manière asynchrone (sans bloquer la redirection de l'utilisateur)
    ctx.waitUntil(recordClick(env, targetUrl.hostname));

    // 5. Extraire les métadonnées de la page cible
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

    // 6. Appliquer la logique de Fallback
    const finalTitle = (meta.title || meta.twitterTitle || meta.standardTitle || targetUrl.hostname).trim();
    const finalDescription = (meta.description || meta.twitterDescription || "Cliquez pour lire l'article complet sur " + targetUrl.hostname).trim();
    
    let rawImage = meta.image || meta.twitterImage;
    if (!rawImage && meta.fallbackImages.length > 0) {
      rawImage = meta.fallbackImages[0];
    }
    
    const finalImage = rawImage ? resolveUrl(targetUrl.href, rawImage) : "";

    // 7. Renvoyer la réponse selon le format demandé
    if (isJsonRequested) {
      return new Response(
        JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          image: finalImage,
          url: targetUrl.href,
          allowed: isAllowed,
          trackingCleaned: strippedAny
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
        generateRedirectionHTML(targetUrl.href, finalTitle, finalDescription, finalImage, lang),
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
      generateWarningHTML(targetUrl.href, finalTitle, finalDescription, finalImage, userIp, lang),
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
const WORKER_TRANSLATIONS = {
  fr: {
    redirectTitle: "Redirection sécurisée",
    redirecting: "LienLibre vous redirige vers l'article d'origine :",
    fallbackNote: "Si la redirection automatique ne fonctionne pas après quelques secondes, veuillez cliquer ci-dessous.",
    accessBtn: "Accéder à l'article",
    supportBanner: "<strong>Soutenez le journalisme local :</strong> ce média (<strong>{host}</strong>) a besoin de vous. Pensez à vous abonner ou à désactiver votre bloqueur de pub sur leur site."
  },
  en: {
    redirectTitle: "Secure Redirection",
    redirecting: "LienLibre is redirecting you to the original article:",
    fallbackNote: "If the automatic redirection does not work after a few seconds, please click below.",
    accessBtn: "Access the article",
    supportBanner: "<strong>Support local journalism:</strong> this media outlet (<strong>{host}</strong>) needs you. Please consider subscribing or disabling your ad blocker on their site."
  },
  ar: {
    redirectTitle: "إعادة توجيه آمنة",
    redirecting: "يقوم LienLibre بإعادة توجيهك إلى المقال الأصلي:",
    fallbackNote: "إذا لم تعمل إعادة التوجيه التلقائي بعد بضع ثوانٍ، يرجى النقر أدناه.",
    accessBtn: "الوصول إلى المقال",
    supportBanner: "<strong>ادعم الصحافة المحلية:</strong> هذه الوسيلة الإعلامية (<strong>{host}</strong>) بحاجة إليك. يرجى التفكير في الاشتراك أو إيقاف تشغيل مانع الإعلانات على موقعهم."
  },
  es: {
    redirectTitle: "Redirección segura",
    redirecting: "LienLibre le está redirigiendo al artículo original:",
    fallbackNote: "Si la redirección automática no funciona después de unos segundos, haga clic a continuación.",
    accessBtn: "Acceder al artículo",
    supportBanner: "<strong>Apoye el periodismo local:</strong> este medio (<strong>{host}</strong>) le necesita. Considere suscribirse o desactivar su bloqueador de anuncios en su sitio."
  },
  it: {
    redirectTitle: "Reindirizzamento sicuro",
    redirecting: "LienLibre ti sta reindirizzando all'articolo originale:",
    fallbackNote: "Se il reindirizzamento automatico non funziona dopo pochi secondi, clicca qui sotto.",
    accessBtn: "Accedi all'articolo",
    supportBanner: "<strong>Sostieni il giornalismo locale:</strong> questo media (<strong>{host}</strong>) ha bisogno di te. Considera di abbonarti o disattivare il tuo ad blocker sul loro sito."
  },
  zh: {
    redirectTitle: "安全重定向",
    redirecting: "LienLibre 正在将您重定向至原始文章：",
    fallbackNote: "如果自动重定向在几秒钟后未运行，请点击下方链接。",
    accessBtn: "访问文章",
    supportBanner: "<strong>支持本地新闻：</strong>该媒体（<strong>{host}</strong>）需要您的支持。请考虑订阅或在其网站上停用广告拦截器。"
  },
  cr: {
    redirectTitle: "Kwayask pimi-cahkêyhk",
    redirecting: "LienLibre wîci-ayamihtân ôma âcimowin:",
    fallbackNote: "Kîspin nama-sêmâk pimohtêmakahk, ôta cahkêyhk.",
    accessBtn: "Ayamihtâ âcimowin",
    supportBanner: "<strong>Wîcihiwê kânata âcimowina:</strong> ôma (<strong>{host}</strong>) wîci-nîso-kamik. Masinahikan kie wîcihiwê."
  },
  iu: {
    redirectTitle: "Nalunaiqtillugu nuutitauniq",
    redirecting: "LienLibre nuutitsijuq tusaraksaq-mut:",
    fallbackNote: "Utaqqilaurlutit maanna nuutingippat.",
    accessBtn: "Tusaraksaq atulugu",
    supportBanner: "<strong>Ikayurlugu tusagaksat:</strong> una (<strong>{host}</strong>) ikayuriqquq. Ikayuriaqutit."
  },
  in: {
    redirectTitle: "Tshitisheun e kanatshiau",
    redirecting: "LienLibre tshitissipitamin nete tipatshimun:",
    fallbackNote: "Eka sêmâk tshitissipitamin, kussenitan nete tshe miskamin.",
    accessBtn: "Tipatshimun aitun",
    supportBanner: "<strong>Uitsheue tipatshimun:</strong> nete (<strong>{host}</strong>) uitsheue tshetshi tutamin."
  },
  moh: {
    redirectTitle: "Tsi nioht tyohtetyon",
    redirecting: "LienLibre tsi niahsewenni ne karihwaneken:",
    fallbackNote: "Kwah ok kwahiaton ne thó tsi niiorihwà:ke.",
    accessBtn: "Acceder ne karihwaneken",
    supportBanner: "<strong>Sewarihwakwenihs ne ohwentsia:</strong> ne (<strong>{host}</strong>) karihwaneken. Takwarent."
  }
};

const WORKER_WARN_TRANSLATIONS = {
  fr: {
    warnTitle: "Avertissement de Sécurité - LienLibre",
    unverifiedLink: "Lien non vérifié",
    warnDesc: "Ce lien redirige vers un site qui ne figure pas dans notre liste de confiance des médias d'information canadiens. Par mesure de sécurité pour éviter le hameçonnage (phishing), la redirection est suspendue temporairement.",
    countdownText: "Redirection automatique dans <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Destination :",
    ipLabel: "Votre IP publique :",
    reportBtn: "Signaler une tentative de fraude au Canada",
    advancedBtn: "Options avancées",
    advancedDesc: "Si vous faites confiance à ce site, vous pouvez continuer vers la page d'origine.",
    continueBtn: "Continuer vers le site (non recommandé)",
    supportBanner: "<strong>Soutenez le journalisme indépendant :</strong> Pensez à visiter les sites de presse directement et à vous abonner pour financer l'information locale."
  },
  en: {
    warnTitle: "Security Warning - LienLibre",
    unverifiedLink: "Unverified Link",
    warnDesc: "This link redirects to a website that is not on our trusted whitelist of Canadian news media. As a security measure to prevent phishing, the redirection is temporarily suspended.",
    countdownText: "Automatic redirection in <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Destination:",
    ipLabel: "Your public IP:",
    reportBtn: "Report a scam attempt in Canada",
    advancedBtn: "Advanced options",
    advancedDesc: "If you trust this site, you can proceed to the original page.",
    continueBtn: "Continue to site (not recommended)",
    supportBanner: "<strong>Support independent journalism:</strong> Consider visiting news sites directly and subscribing to fund local reporting."
  },
  ar: {
    warnTitle: "تحذير أمان - LienLibre",
    unverifiedLink: "رابط غير موثق",
    warnDesc: "إعادة التوجيه إلى موقع غير مدرج في قائمتنا البيضاء لوسائل الإعلام الكندية الموثوقة. كإجراء أمني لمنع التصيد الاحتيالي، تم تعليق إعادة التوجيه مؤقتاً.",
    countdownText: "إعادة التوجيه تلقائياً خلال <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> ثوانٍ...",
    destination: "الوجهة:",
    ipLabel: "عنوان IP العام الخاص بك:",
    reportBtn: "الإبلاغ عن محاولة احتيال في كندا",
    advancedBtn: "خيارات متقدمة",
    advancedDesc: "إذا كنت تثق في هذا الموقع، يمكنك المتابعة إلى الصفحة الأصلية.",
    continueBtn: "المتابعة إلى الموقع (غير مستحسن)",
    supportBanner: "<strong>ادعم الصحافة المستقلة:</strong> فكر في زيارة مواقع الأخبار مباشرة والاشتراك لتمويل الصحافة المحلية."
  },
  es: {
    warnTitle: "Advertencia de seguridad - LienLibre",
    unverifiedLink: "Enlace no verificado",
    warnDesc: "Este enlace redirige a un sitio web que no está en nuestra lista de confianza de medios canadienses. Como medida de seguridad contra el phishing, la redirección se ha suspendido temporalmente.",
    countdownText: "Redirección automática en <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Destino:",
    ipLabel: "Su IP pública:",
    reportBtn: "Reportar un intento de fraude en Canadá",
    advancedBtn: "Opciones avanzadas",
    advancedDesc: "Si confía en este sitio, puede continuar a la página de origen.",
    continueBtn: "Continuar al sitio (no recomendado)",
    supportBanner: "<strong>Apoye el periodismo independiente:</strong> Considere visitar los sitios de noticias directamente y suscribirse para financiar la información local."
  },
  it: {
    warnTitle: "Avviso di sicurezza - LienLibre",
    unverifiedLink: "Link non verificato",
    warnDesc: "Questo link reindirizza a un sito web che non è nella nostra lista di fiducia dei media canadesi. Come misura di sicurezza per evitare il phishing, il reindirizzamento è temporaneamente sospeso.",
    countdownText: "Reindirizzamento automatico in <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Destinazione:",
    ipLabel: "Il tuo IP pubblico:",
    reportBtn: "Segnala un tentativo di frode in Canada",
    advancedBtn: "Opzioni avanzate",
    advancedDesc: "Se ti fidi di questo sito, puoi procedere alla pagina di origine.",
    continueBtn: "Continua sul sito (non consigliato)",
    supportBanner: "<strong>Sostieni il giornalismo indipendente:</strong> Prendi in considerazione l'idea di visitare direttamente i siti di informazione e abbonarti per finanziare il giornalismo locale."
  },
  zh: {
    warnTitle: "安全警告 - LienLibre",
    unverifiedLink: "未经验证的链接",
    warnDesc: "此链接重定向至不在我们信任的加拿大新闻媒体白名单中的网站。作为防范网络钓鱼的安全措施，重定向已暂时挂起。",
    countdownText: "将在 <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> 秒内自动重定向...",
    destination: "目标地址:",
    ipLabel: "您的公网 IP:",
    reportBtn: "在加拿大举报欺诈行为",
    advancedBtn: "高级选项",
    advancedDesc: "如果您信任此网站，可以继续前往原始页面。",
    continueBtn: "继续前往网站（不推荐）",
    supportBanner: "<strong>支持独立新闻：</strong>请考虑直接访问新闻网站并订阅以资助本地报道。"
  },
  cr: {
    warnTitle: "Nama-kwayask kiskêyihtâkwan - LienLibre",
    unverifiedLink: "Nama-kwayask pimohtêw",
    warnDesc: "Ôma kiskinowâpahtihikowin nama-kiskêyihtâkwan ôta. Wîcihiwêw-paminikêwin sêmâk ka-pêhon.",
    countdownText: "Pimohtêwin sêmâk <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Tânte pimi-ayâw:",
    ipLabel: "Kiyahk IP pimohtêwin:",
    reportBtn: "Report a scam attempt in Canada",
    advancedBtn: "Wîci-ayamihtân kîkway",
    advancedDesc: "Kîspin kwayask, sêmâk ka-wâpahtên âcimowin.",
    continueBtn: "Sêmâk (Nama-kwayask)",
    supportBanner: "<strong>Wîcihiwê âcimowina:</strong> Masinahikan kie wîcihiwê."
  },
  iu: {
    warnTitle: "Nalunaiqtillugu nuutitauniq - LienLibre",
    unverifiedLink: "Nalunaiqtaulluarsimangittuq Link",
    warnDesc: "Una qaritaujakkuurutinga ilisimajaujut list-inginniiqataungittuq. Ajuqhaqquq takuksautitsijjutimik maanna.",
    countdownText: "Nuutitsijuq maanna <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Nuutarvik:",
    ipLabel: "IP-it:",
    reportBtn: "Report a scam attempt in Canada",
    advancedBtn: "Ikayuriaqutit",
    advancedDesc: "Ikayurumalutit tunisijungnarqutit.",
    continueBtn: "Atulugu",
    supportBanner: "<strong>Ikayurlugu tusagaksat:</strong> Una ikayuriqquq."
  },
  in: {
    warnTitle: "Eka tshissikuat tshe ishinakuat - LienLibre",
    unverifiedLink: "Eka tshissikuat Link",
    warnDesc: "Mane tshitshipan eka e nishtutamin tshe ishinakuat. Tshe uapataman mishta aimun.",
    countdownText: "Tshitissipitamin nete <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Tshitisheun:",
    ipLabel: "IP nete:",
    reportBtn: "Report a scam attempt in Canada",
    advancedBtn: "Advanced options",
    advancedDesc: "Kussenitan nete tshe miskamin.",
    continueBtn: "Tshitissipitamin",
    supportBanner: "<strong>Uitsheue tipatshimun:</strong> Uitsheue tshetshi tutamin."
  },
  moh: {
    warnTitle: "Iáh teiowatennion - LienLibre",
    unverifiedLink: "Iáh teiowatennion Link",
    warnDesc: "Tsi niiorihwà:ke iáh teiowatennion ne Kanada. Thó nioht kaia'táhrho.",
    countdownText: "Tsi niahsewenni ne <span id=\"countdown\" style=\"font-family: monospace; font-weight: bold; font-size: 1.05rem;\">{sec}</span> s...",
    destination: "Destination:",
    ipLabel: "IP:",
    reportBtn: "Report a scam in Canada",
    advancedBtn: "Options",
    advancedDesc: "Kwah ok kwahiaton ne thó tsi niiorihwà:ke.",
    continueBtn: "Continuer vers le site (non recommandé)",
    supportBanner: "<strong>Sewarihwakwenihs ne ohwentsia:</strong> Takwarent."
  }
};

/**
 * Génère le HTML pour rediriger l'utilisateur tout en affichant l'aperçu Open Graph pour les bots.
 */
function generateRedirectionHTML(targetUrl, title, description, image, lang = "fr") {
  const escapedUrl = escapeHtml(targetUrl);
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImg = escapeHtml(image);
  const targetHost = new URL(targetUrl).hostname.replace("www.", "");

  const trans = WORKER_TRANSLATIONS[lang] || WORKER_TRANSLATIONS.fr;
  const htmlDir = lang === "ar" ? "rtl" : "ltr";
  const supportBannerText = trans.supportBanner.replace("{host}", escapeHtml(targetHost));

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${htmlDir}">
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
      flex-direction: column;
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
      margin-bottom: 1.5rem;
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
    .support-banner {
      background-color: rgba(6, 182, 212, 0.05);
      border: 1px solid rgba(6, 182, 212, 0.15);
      color: #22d3ee;
      border-radius: 0.75rem;
      padding: 1rem;
      font-size: 0.85rem;
      max-width: 500px;
      text-align: center;
      line-height: 1.4;
    }
    .heart {
      color: #f43f5e;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h1>${trans.redirectTitle}</h1>
    <p>${trans.redirecting}<br><strong style="color: #e5e7eb; word-break: break-all;">${escapedTitle}</strong></p>
    <p style="font-size: 0.85rem;">${trans.fallbackNote}</p>
    <a href="${escapedUrl}" class="link-btn">${trans.accessBtn}</a>
  </div>

  <div class="support-banner">
    <span class="heart">❤️</span> ${supportBannerText}
  </div>

  <script>
    window.location.href = ${JSON.stringify(targetUrl)};
  </script>
</body>
</html>`;
}

/**
 * Génère une page d'avertissement de sécurité (phishing/spam) pour les domaines non vérifiés.
 */
function generateWarningHTML(targetUrl, title, description, image, userIp, lang = "fr") {
  const escapedUrl = escapeHtml(targetUrl);
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImg = escapeHtml(image);
  const escapedIp = escapeHtml(userIp);
  const hostname = new URL(targetUrl).hostname;

  const trans = WORKER_WARN_TRANSLATIONS[lang] || WORKER_WARN_TRANSLATIONS.fr;
  const htmlDir = lang === "ar" ? "rtl" : "ltr";
  
  // Anti-fraud report URL selection (EN vs FR/Indigenous)
  const reportUrl = (lang === "fr" || lang === "cr" || lang === "iu" || lang === "in" || lang === "moh")
    ? "https://www.antifraudcentre-centreantifraude.ca/report-signalez-fra.htm"
    : "https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${htmlDir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${trans.warnTitle}</title>
  
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

  <!-- Redirection de sécurité différée (10 secondes) -->
  <meta http-equiv="refresh" content="10;url=${escapedUrl}">

  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #020617;
      color: #f3f4f6;
      display: flex;
      flex-direction: column;
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
      margin-bottom: 1.5rem;
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
    .support-banner {
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #9ca3af;
      border-radius: 0.75rem;
      padding: 1rem;
      font-size: 0.85rem;
      max-width: 550px;
      text-align: center;
      line-height: 1.4;
    }
    .heart {
      color: #f43f5e;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-container">
      <span class="icon">⚠️</span>
    </div>
    <h1>${trans.unverifiedLink}</h1>
    <p>${trans.warnDesc}</p>
    
    <div style="margin-bottom: 1.5rem; padding: 0.75rem; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 0.5rem; color: #f87171; font-size: 0.9rem; font-weight: 500;">
      ${trans.countdownText.replace("{sec}", `<span id="countdown" style="font-family: monospace; font-weight: bold; font-size: 1.05rem;">10</span>`)}
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">${trans.destination}</span>
        <span class="info-value">${escapeHtml(hostname)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${trans.ipLabel}</span>
        <span class="info-value">${escapedIp}</span>
      </div>
    </div>

    <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" class="btn-report">
      ${trans.reportBtn}
    </a>

    <button class="advanced-toggle" onclick="toggleAdvanced()">${trans.advancedBtn}</button>
    
    <div id="advanced-content" class="advanced-content">
      <p>${trans.advancedDesc}</p>
      <a href="${escapedUrl}" class="btn-continue">${trans.continueBtn}</a>
    </div>
  </div>

  <div class="support-banner">
    <span class="heart">❤️</span> ${trans.supportBanner}
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

    (function() {
      let secondsLeft = 10;
      const countdownEl = document.getElementById("countdown");
      const url = ${JSON.stringify(targetUrl)};
      const interval = setInterval(function() {
        secondsLeft--;
        if (countdownEl) {
          countdownEl.textContent = secondsLeft;
        }
        if (secondsLeft <= 0) {
          clearInterval(interval);
          window.location.href = url;
        }
      }, 1000);
    })();
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
