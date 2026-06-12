# Contribuer à LienLibre

Merci de vouloir aider LienLibre. Le projet vise à fournir un outil citoyen, open-source et sécuritaire pour partager l’actualité canadienne censurée ou bloquée par Meta au Canada.

## Priorités du projet

1. Sécurité des utilisateurs.
2. Prévention du phishing et des usages criminels.
3. Accessibilité mobile et multilingue.
4. Transparence Open Data sans collecte de données personnelles.
5. Simplicité d’utilisation pour le public canadien.

## Types de contributions utiles

- Ajout ou correction de médias canadiens dans la whitelist.
- Amélioration des traductions.
- Corrections UI/UX ou accessibilité.
- Améliorations SEO/documentation.
- Signalement de bugs ou de vulnérabilités.
- Suggestions anti-abus pour le Cloudflare Worker.

## Ajouter un média à la whitelist

Ouvrez une issue avec :

- le domaine du média ;
- la province ou région ;
- un lien vers la page d’accueil ;
- pourquoi il s’agit d’une source d’information légitime ;
- si possible, une preuve éditoriale ou page À propos.

## Règles de sécurité

Ne proposez pas de modification qui transforme LienLibre en raccourcisseur généraliste. Les domaines inconnus doivent rester derrière une barrière anti-hameçonnage ou une validation humaine.

## Développement local

```bash
npm install
npx wrangler dev
```

Si le projet n’a pas encore de `package.json`, utilisez directement :

```bash
npx wrangler dev worker.js
```

## Avant de proposer une Pull Request

- Vérifier que `worker.js` passe `node --check worker.js`.
- Vérifier que le frontend reste responsive.
- Ne pas committer `.wrangler/`, `.env`, `.dev.vars` ou secrets.
- Documenter tout changement de sécurité dans `SECURITY.md` ou `TRUST_AND_SAFETY.md`.
