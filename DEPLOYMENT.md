# Déploiement — LienLibre

Ce guide résume les étapes recommandées pour déployer LienLibre proprement sur GitHub Pages + Cloudflare Worker.

## 1. GitHub Pages

Le frontend doit contenir au minimum :

- `index.html`
- `og-image.png`
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `.nojekyll`

Activez GitHub Pages sur la branche `main` et le dossier racine.

## 2. Cloudflare Worker

Déployez le Worker :

```bash
npx wrangler deploy
```

## 3. KV Namespaces recommandés

```bash
wrangler kv namespace create LIENLIBRE_KV
wrangler kv namespace create LIENLIBRE_WHITELIST
```

Puis ajoutez les bindings dans `wrangler.toml` :

```toml
[[kv_namespaces]]
binding = "LIENLIBRE_KV"
id = "VOTRE_ID_STATS"

[[kv_namespaces]]
binding = "LIENLIBRE_WHITELIST"
id = "VOTRE_ID_WHITELIST"
```

## 4. Secret HMAC recommandé

Pour les liens signés :

```bash
wrangler secret put LINK_SIGNING_SECRET
```

Utilisez une valeur longue et aléatoire.

## 5. Domaine personnalisé recommandé

Pour des protections Cloudflare complètes, utilisez un domaine comme :

```txt
https://lienlibre.ca/
```

Puis mettez le domaine derrière Cloudflare avec proxy activé.

## 6. À ne jamais committer

- `.wrangler/`
- `.env`
- `.dev.vars`
- clés API
- secrets HMAC
- bases SQLite locales

## 7. Après déploiement

Tester :

- page d’accueil ;
- génération d’un lien média vérifié ;
- génération d’un lien inconnu ;
- page d’avertissement 10 secondes ;
- `/api/stats` ;
- `/api/stats/detailed` si activé ;
- Facebook Sharing Debugger ;
- Google Search Console.
