# Audit du dépôt LienLibre

Dépôt audité : https://github.com/Bwillou1/LienLibre  
Date : 2026-06-12

## Résumé rapide

Le projet est déjà fonctionnel, mais il manque plusieurs fichiers importants pour qu’il soit propre, crédible, sécuritaire et difficile à détourner par des criminels.

Priorités :

1. Supprimer `.wrangler/` du dépôt.
2. Ajouter `LICENSE` car le projet annonce MIT.
3. Ajouter `og-image.png` car `index.html` la référence.
4. Ajouter `sitemap.xml` car `robots.txt` le référence.
5. Ajouter une vraie politique anti-abus : `ABUSE.md`, `TRUST_AND_SAFETY.md`, `abuse.html`.
6. Intégrer dans `worker.js` les protections anti-open-redirect : blocklist, no-referrer, noindex, liens signés, rate limiting.
7. Retirer l’affichage de l’IP publique dans la page d’avertissement.
8. Ajouter `.gitignore`, `.nojekyll`, `package.json`, `.env.example`.
9. Ajouter une page stats : `stats.html` + endpoint Worker `/api/stats/detailed`.
10. Améliorer `README.md`, trop court pour le SEO, les IA et les contributeurs.

---

## Fichiers présents dans ton dépôt actuel

| Fichier | Statut | Commentaire |
|---|---:|---|
| [`index.html`](https://github.com/Bwillou1/LienLibre/blob/main/index.html) | Présent | Bon frontend, mais le dépôt actuel contient un script Cloudflare injecté `cdn-cgi/challenge-platform` à la fin du fichier. À retirer. |
| [`worker.js`](https://github.com/Bwillou1/LienLibre/blob/main/worker.js) | Présent | Fonctionnel, mais il manque une couche anti-abus plus stricte. Ne pas afficher l’IP publique dans l’avertissement. |
| [`wrangler.toml`](https://github.com/Bwillou1/LienLibre/blob/main/wrangler.toml) | Présent | OK, mais KV encore commenté. Ajouter `LIENLIBRE_KV` et `LIENLIBRE_WHITELIST`. |
| [`README.md`](https://github.com/Bwillou1/LienLibre/blob/main/README.md) | Présent | Trop court. Il faut ajouter usage, sécurité, SEO, installation, Worker, Open Data. |
| [`SECURITY.md`](https://github.com/Bwillou1/LienLibre/blob/main/SECURITY.md) | Présent | À mettre à jour : le Worker actuel ne renvoie pas seulement `403`, il affiche un avertissement. |
| [`PRESS.md`](https://github.com/Bwillou1/LienLibre/blob/main/PRESS.md) | Présent | Bon fichier presse. À garder. |
| [`llms.txt`](https://github.com/Bwillou1/LienLibre/blob/main/llms.txt) | Présent | Bon pour IA/AEO. Ajouter une section anti-abus. |
| [`robots.txt`](https://github.com/Bwillou1/LienLibre/blob/main/robots.txt) | Présent | Bon, mais il référence `sitemap.xml`, absent du dépôt actuel. |
| [`deploy.sh`](https://github.com/Bwillou1/LienLibre/blob/main/deploy.sh) | Présent | À améliorer : `sed -i ''` fonctionne surtout sur macOS, pas Linux. Le script commit seulement `index.html`. |
| [`.wrangler/`](https://github.com/Bwillou1/LienLibre/tree/main/.wrangler) | Présent | À supprimer du dépôt. C’est un dossier local/cache Wrangler qui ne doit pas être versionné. |

---

## Fichiers manquants à ajouter

### Sécurité / anti-abus

| Fichier | Priorité | Pourquoi |
|---|---:|---|
| `ABUSE.md` | Très haute | Politique officielle pour empêcher phishing, malware, spam, IP loggers et fraude. |
| `TRUST_AND_SAFETY.md` | Très haute | Explique les niveaux de confiance : vérifié, candidat, inconnu, bloqué. |
| `abuse.html` | Haute | Page publique pour signaler un lien abusif. |
| `.github/ISSUE_TEMPLATE/abuse_report.yml` | Haute | Formulaire GitHub structuré pour recevoir les signalements. |
| `blocklist.example.json` | Moyenne | Exemple de domaines/extensions à bloquer ou forcer derrière avertissement. |

### Worker / Cloudflare

| Fichier | Priorité | Pourquoi |
|---|---:|---|
| `worker-abuse-shield-snippet.js` | Très haute | Protection anti-open-redirect et anti-criminels. À intégrer dans `worker.js`. |
| `worker-mini-auditor-snippet.js` | Haute | Mini-auditeur HTML. Mode prudent recommandé : domaine `candidate`, pas auto-trust immédiat. |
| `worker-advanced-protection-and-stats-snippet.js` | Haute | Rate limit, liens signés HMAC, stats détaillées, endpoint `/api/stats/detailed`. |
| `worker-official-whitelist-snippet.js` | Moyenne | Évite que LienLibre/GitHub soient classés comme non vérifiés. |

### SEO / IA / Open Data

| Fichier | Priorité | Pourquoi |
|---|---:|---|
| `sitemap.xml` | Très haute | `robots.txt` le référence déjà. Il doit exister. |
| `og-image.png` | Très haute | `index.html` référence cette image Open Graph. Elle doit exister. |
| `stats.html` | Haute | Page publique Open Data détaillée. |
| `.nojekyll` | Moyenne | Évite certains problèmes GitHub Pages. |

### Qualité dépôt

| Fichier | Priorité | Pourquoi |
|---|---:|---|
| `LICENSE` | Très haute | Le projet annonce MIT, mais le fichier de licence est absent. |
| `.gitignore` | Très haute | Empêche de recommitter `.wrangler/`, secrets, logs, caches. |
| `package.json` | Moyenne | Ajoute commandes standard `dev`, `deploy`, `check`. |
| `.env.example` | Moyenne | Documente les variables sans exposer de secrets. |
| `CONTRIBUTING.md` | Moyenne | Explique comment proposer médias, traductions, sécurité. |
| `CODE_OF_CONDUCT.md` | Basse/Moyenne | Utile pour projet citoyen public. |
| `DEPLOYMENT.md` | Moyenne | Guide GitHub Pages + Cloudflare Worker. |

---

## Corrections critiques dans `index.html`

### 1. Retirer le script Cloudflare injecté

Le `index.html` actuel du dépôt se termine avec un script de ce type :

```html
<script>(function(){.../cdn-cgi/challenge-platform/scripts/jsd/main.js...</script>
```

À retirer. Ce script ne doit pas être dans le code source GitHub Pages.

### 2. Ajouter les liens footer utiles

Ajouter :

```html
<a href="stats.html">Statistiques</a>
<a href="abuse.html">Signaler un abus</a>
```

---

## Corrections critiques dans `worker.js`

### 1. Ne pas afficher l’IP publique

Le Worker actuel récupère :

```js
const userIp = request.headers.get("CF-Connecting-IP") || "Inconnue";
```

Puis l’affiche dans l’avertissement. À retirer. C’est inutile et mauvais pour la confidentialité.

### 2. Changer la Referrer Policy

Actuel :

```http
Referrer-Policy: strict-origin-when-cross-origin
```

Recommandé pour les pages pont :

```http
Referrer-Policy: no-referrer
```

### 3. Ajouter X-Robots-Tag sur les URLs pont

Pour empêcher l’indexation de liens abusifs :

```http
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
```

### 4. Ajouter une blocklist stricte

Bloquer :

- `localhost`, `.local`, IP privées ;
- IP loggers ;
- raccourcisseurs abusifs ;
- fichiers dangereux : `.exe`, `.apk`, `.msi`, `.dmg`, `.ps1`, etc. ;
- URLs avec username/password ;
- domaines explicitement signalés.

### 5. Vérifier les redirections finales

Si un domaine whitelisté redirige vers un domaine non whitelisté, il faut forcer l’avertissement ou bloquer.

### 6. Ne pas compter les bots comme clics humains

`recordClick()` est appelé pour toutes les requêtes avec `?url`, y compris JSON preview et bots. Mieux : compter séparément :

- preview bot ;
- API JSON ;
- clic utilisateur ;
- avertissement affiché.

### 7. Signer les liens générés

Ajouter `exp` + `sig` pour éviter qu’un attaquant modifie simplement le paramètre `url`.

---

## Commandes de nettoyage recommandées

```bash
# Supprimer .wrangler du dépôt Git, sans supprimer forcément le dossier local
 git rm -r --cached .wrangler

# Ajouter le .gitignore
 git add .gitignore

# Ajouter les nouveaux fichiers
 git add LICENSE sitemap.xml og-image.png .nojekyll ABUSE.md TRUST_AND_SAFETY.md abuse.html stats.html SECURITY.md CONTRIBUTING.md CODE_OF_CONDUCT.md DEPLOYMENT.md package.json .env.example blocklist.example.json .github/ISSUE_TEMPLATE

# Ajouter les snippets si tu veux les garder comme documentation avant intégration
 git add worker-abuse-shield-snippet.js worker-mini-auditor-snippet.js worker-advanced-protection-and-stats-snippet.js worker-official-whitelist-snippet.js

# Commit
 git commit -m "Add trust and safety, SEO, stats and anti-abuse files"
 git push origin main
```

---

## À faire dans Cloudflare

### KV

```bash
wrangler kv namespace create LIENLIBRE_KV
wrangler kv namespace create LIENLIBRE_WHITELIST
```

Puis dans `wrangler.toml` :

```toml
[[kv_namespaces]]
binding = "LIENLIBRE_KV"
id = "VOTRE_ID_STATS"

[[kv_namespaces]]
binding = "LIENLIBRE_WHITELIST"
id = "VOTRE_ID_WHITELIST"
```

### Secret HMAC

```bash
wrangler secret put LINK_SIGNING_SECRET
```

### Option anti-abus forte

Si abus réel : ajouter Cloudflare Turnstile sur la génération de liens.

---

## Verdict

Le projet est prometteur et déjà solide côté idée/UI. Ce qui manque surtout :

- hygiène du dépôt ;
- fichier MIT ;
- image OG et sitemap ;
- suppression de `.wrangler/` ;
- anti-abus côté Worker ;
- politique de signalement ;
- stats détaillées ;
- confidentialité renforcée.

Une fois ces points réglés, LienLibre sera beaucoup plus crédible, plus indexable et beaucoup moins risqué à détourner.
