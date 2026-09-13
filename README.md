# 🔗 LienLibre — Passerelle Citoyenne & Recherche en Interopérabilité Web

LienLibre est une application web progressive (PWA) open-source et **100 % gratuite** développée à des fins de **recherche académique, d'éducation citoyenne et d'interopérabilité des protocoles de métadonnées web (Open Graph / Schema.org)**.

Le projet permet d'étudier l'extraction de métadonnées visuelles et de préserver l'accès public aux alertes de sécurité civile (météo, urgences locales, santé publique) et aux actualités canadiennes d'intérêt général.

---

## 🛡️ Cadre Juridique, Safe Harbor & Clause de Non-Responsabilité

1. **Recherche Éducative & Utilisation Équitable (*Fair Dealing*)** :
   Ce projet relève des dispositions de l'**article 29 de la *Loi sur le droit d'auteur du Canada*** (L.R.C. (1985), ch. C-42), autorisant l'utilisation équitable à des fins d'étude privée, de recherche, d'éducation, de parodie, de satire, de critique ou de compte rendu.

2. **Non-Applicabilité de la Loi C-18 (*Loi sur les nouvelles en ligne*)** :
   La Loi C-18 s'applique exclusivement aux transactions commerciales entre les grandes entreprises exploitantes d'intermédiaires de nouvelles numériques et les éditeurs de presse. **LienLibre n'est pas un intermédiaire commercial, ne monétise aucun contenu et ne contourne aucune disposition législative.** Le blocage de liens sur des plateformes privées relève de décisions contractuelles unilatérales et ne constitue pas une interdiction légale faite aux citoyens de consulter ou de partager des adresses web publiques.

3. **Intermédiaire Technique Neutre (*Simple Conduit*)** :
   Conformément à l'**article 31.1 de la *Loi sur le droit d'auteur***, LienLibre agit comme simple transmetteur technique automatisé. Le service n'héberge ni ne modifie aucun article journalistique et redirige directement vers l'éditeur d'origine.

4. **Exonération Totale de Responsabilité** :
   L'outil est fourni **« EN L'ÉTAT » (« AS IS »)**, sans garantie d'aucune sorte. Le développeur et les contributeurs déclinent toute responsabilité quant à l'usage de l'outil par des tiers. L'utilisateur est seul responsable des URLs qu'il choisit de traiter.

5. **Confidentialité Absolue (*Privacy by Design & Zero-Log*)** :
   Zéro cookie de pistage, zéro conservation d'adresse IP et nettoyage systématique des marqueurs de suivi publicitaire (`fbclid`, `utm_*`).

---

## 🚀 Fonctionnalités Techniques

- **Extraction Open Graph & Schema.org** : Rendu fidèle des miniatures et résumés pour les réseaux sociaux et moteurs de recherche.
- **Redirection transparente et instantanée** vers les sources vérifiées.
- **Application Web Progressive (PWA)** installable sur mobile et ordinateur avec support hors ligne via Service Worker.
- **Protection Anti-Hameçonnage & Bouclier DNS** : Double validation par DNS-over-HTTPS (NextDNS) et règles heuristiques.
- **Accessibilité Universelle** : Intégration complète du widget d'accessibilité Sienna (dyslexie, contraste élevé, zoom de texte).
- **Multilingue (10 langues)** : Français, Anglais, Arabe (RTL), Espagnol, Italien, Chinois, Cri (Nēhiyawēwin), Inuktitut, Innu-aimun, Mohawk (Kanien'kéha).

---

## 🚀 Déployer votre propre Miroir / Fork (100% Autonome & Gratuit)

LienLibre est conçu pour être entièrement décentralisé. Lorsque vous forkez ce dépôt, vous disposez de votre propre instance indépendante sans dépendre des serveurs ni des quotas de quiconque.

### Étape 1 : Forker le dépôt GitHub
Cliquez sur le bouton **Fork** en haut à droite du dépôt `Bwillou1/LienLibre` sur GitHub pour créer votre copie personnelle.

### Étape 2 : Activer GitHub Pages
1. Dans votre nouveau dépôt forké, allez dans **Settings > Pages**.
2. Sous **Build and deployment > Branch**, sélectionnez la branche `main` et cliquez sur **Save**.
3. Votre interface miroir est disponible sur `https://<votre-pseudo>.github.io/<nom-du-repo>/`.

### Étape 3 : Créer votre profil NextDNS gratuit
1. Rendez-vous sur [nextdns.io](https://nextdns.io) et créez un compte gratuit (300 000 requêtes gratuites/mois).
2. Notez votre identifiant de profil à 6 caractères (ex: `9d8318` ou `ab12cd`).
3. Vous pouvez configurer des listes de blocage de sécurité (Security, Parental Control) selon vos préférences.

### Étape 4 : Déployer votre Cloudflare Worker
1. Créez un compte gratuit sur [Cloudflare](https://dash.cloudflare.com/) (100 000 requêtes gratuites/jour).
2. Dans votre copie locale du projet :
   ```bash
   # Copier le fichier d'exemple
   cp wrangler.toml.example wrangler.toml
   ```
3. Éditez `wrangler.toml` pour renseigner vos variables :
   ```toml
   [vars]
   NEXTDNS_ID_PRIMARY = "votre_id_nextdns" # ex: "9d8318"
   NEXTDNS_ID_BACKUP = "votre_id_secours"
   CONTACT_EMAIL = "votre-courriel@exemple.com"
   GITHUB_REPO = "votre-pseudo/votre-depot"
   ```
4. Déployez votre worker :
   ```bash
   npx wrangler deploy
   ```
   *Note : Vous pouvez aussi simplement coller le contenu de `worker.js` directement dans l'éditeur du tableau de bord Cloudflare Workers et ajouter vos variables dans Settings > Variables.*

### Étape 5 : Connecter votre Miroir Web
Sur votre site GitHub Pages miroir :
1. Cliquez sur **« Créer un miroir »** dans la barre de navigation.
2. À l'étape 4, entrez l'URL de votre worker déployé (ex: `https://mon-worker.workers.dev`) et cliquez sur **Enregistrer**.
3. Vos liens seront désormais générés et traités exclusivement par votre propre infrastructure !

---

## 📄 Licence
Projet open-source distribué sous licence [MIT](LICENSE).
Widget d'accessibilité basé sur Sienna Accessibility Widget par Benny Luk (Licence MIT).
