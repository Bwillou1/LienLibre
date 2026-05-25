# 🔗 LienLibre

LienLibre est une application web open-source et **100 % gratuite** conçue pour contourner le blocage du partage de liens d'actualité imposé par Meta (Facebook, Instagram) au Canada. Elle permet de générer un lien "pont" (proxy) personnalisé qui affiche correctement la miniature (Open Graph) d'un article tout en redirigeant instantanément l'utilisateur vers le média d'origine.

---

## 🛠️ Guide de Déploiement en 3 Étapes

Suivez ce guide rapide pour mettre en ligne votre propre instance de LienLibre en moins de 5 minutes, sans aucun frais.

### Étape 1 : Déployer le Backend sur Cloudflare Workers

1. Connectez-vous ou créez un compte gratuit sur [Cloudflare](https://dash.cloudflare.com/).
2. Dans le menu de gauche, accédez à **Workers & Pages** > **Overview** > cliquez sur **Create application**, puis sur **Create Worker**.
3. Nommez votre worker (ex: `lienlibre-api`) et cliquez sur **Deploy**.
4. Cliquez sur **Edit code** pour ouvrir l'éditeur en ligne de Cloudflare.
5. Remplacez tout le contenu par le code du fichier [`worker.js`](./worker.js) de ce projet, puis cliquez sur **Save and deploy**.
6. Copiez l'URL de votre Worker fraîchement déployé (ex: `https://lienlibre-api.votre-pseudo.workers.dev`).

---

### Étape 2 : Configurer et Déployer le Frontend

1. Ouvrez le fichier [`index.html`](./index.html) de ce projet.
2. À la ligne 185 du code (dans la section `<script>`), repérez la variable :
   ```javascript
   const WORKER_URL = 'https://ton-worker.workers.dev';
   ```
3. Remplacez `'https://ton-worker.workers.dev'` par l'URL de votre Worker copiée à l'étape précédente (ex: `'https://lienlibre-api.votre-pseudo.workers.dev'`). Enregistrez les modifications.
4. Créez un nouveau dépôt public ou privé sur **GitHub** (ex: `LienLibre`).
5. Importez votre fichier `index.html` modifié dans ce dépôt.
6. Allez dans les **Settings** (Paramètres) de votre dépôt GitHub > onglet **Pages** (dans le menu de gauche).
7. Sous **Build and deployment** > **Source**, sélectionnez **Deploy from a branch**.
8. Choisissez la branche `main` (ou `master`) et le dossier `/ (root)`, puis cliquez sur **Save**.
9. Après 1 à 2 minutes, votre page sera accessible à l'adresse fournie par GitHub (ex: `https://votre-pseudo.github.io/LienLibre/`).

---

### Étape 3 : Partager et Utiliser l'outil

1. Accédez à votre interface utilisateur déployée sur GitHub Pages.
2. Collez l'URL d'un article de presse canadien bloqué par Meta.
3. Cliquez sur **Générer mon LienLibre**.
4. Copiez le lien pont généré.
5. Vous pouvez désormais partager ce lien directement sur Facebook ou Instagram. L'aperçu (image, titre, résumé) s'affichera correctement pour vos contacts, et cliquer dessus les redirigera instantanément et de façon transparente vers l'article d'origine.

---

## 🔒 Confidentialité & Limitation

* **Zéro base de données** : Le Worker passe l'état directement dans les paramètres d'URL (`?url=...`). Aucun stockage de données de navigation n'est effectué, assurant un respect total de la vie privée des utilisateurs.
* **Résilience** : La logique du Worker intègre des mécanismes de spoofing de requêtes pour contourner les protections anti-scraping de base des éditeurs de presse et extrait de manière intelligente les métadonnées (fallbacks multiples).
