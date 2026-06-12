# Mode opaque neutre — LienLibre

Objectif : réduire au maximum la possibilité qu’une plateforme associe le lien partagé à un article d’actualité.

## Ce que ça change

Ancien format problématique :

```txt
https://worker.dev/?url=https://media.ca/article
```

Nouveau format :

```txt
https://worker.dev/l/ID_OPAQUE
```

L’URL originale est stockée dans Cloudflare KV et n’apparaît jamais dans le lien public.

## Page partagée par GET

La page publique :

```txt
GET /l/<id>
```

retourne seulement un aperçu neutre :

- titre : `LienLibre — lien sécurisé`
- description : `Ouvrir ce lien via LienLibre.`
- image : `og-image.png`

Elle ne contient pas :

- l’URL originale ;
- le domaine du média ;
- le titre de l’article ;
- la description de l’article ;
- l’image de l’article.

## Ouverture humaine

L’ouverture réelle se fait par action utilisateur :

```txt
POST /go/<id>
```

Les robots qui font seulement un GET ne voient donc pas la destination.

## Fichiers modifiés / ajoutés

- `index.html` : utilise maintenant `POST /api/create` et affiche le lien `/l/<id>`.
- `worker-opaque-neutral-mode.js` : Worker de référence pour le mode opaque neutre.
- `wrangler.example.toml` : ajoute le binding `LIENLIBRE_LINKS`.

## Cloudflare KV requis

```bash
wrangler kv namespace create LIENLIBRE_LINKS
```

Puis dans `wrangler.toml` :

```toml
[[kv_namespaces]]
binding = "LIENLIBRE_LINKS"
id = "VOTRE_ID_LIENS_OPAQUES"
```

## Déploiement rapide

Option simple pour tester :

```bash
cp worker-opaque-neutral-mode.js worker.js
npx wrangler deploy
```

Option recommandée : intégrer les fonctions du fichier dans ton `worker.js` existant pour conserver ta whitelist complète, tes stats et tes traductions.

## Important

Aucun code ne peut garantir qu’une plateforme ne fera jamais d’association par d’autres signaux :

- texte écrit dans la publication ;
- réputation du domaine ;
- comportement utilisateur ;
- signalements ;
- historique de liens ;
- analyse manuelle ou automatisée plus profonde.

Ce mode supprime cependant les signaux techniques les plus évidents : URL du média dans le lien, balises Open Graph de l’article, redirection GET directe et domaine cible dans le HTML partagé.
