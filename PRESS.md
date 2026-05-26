# 📰 Kit Média / Press Kit — LienLibre

Ce document regroupe les informations nécessaires pour la presse, les journalistes et les blogueurs souhaitant couvrir le projet citoyen **LienLibre**.

---

## 📌 Sommaire du Projet

* **Nom du Projet** : LienLibre
* **Créateur** : William Guindon (14 ans, Développeur Full-Stack, Canada)
* **Objectif** : Rétablir le partage de l'information canadienne sur Facebook et Instagram de manière sécurisée, légale et gratuite.
* **Fonctionnalités Clés** :
  * Génération de liens "ponts" (proxy) contournant la censure de Meta.
  * Extraction à la volée des balises de miniature (Open Graph) pour afficher des visuels parfaits sur les fils d'actualité.
  * **Nettoyeur de Mouchards (Anti-Tracking)** : Suppression automatique des trackers publicitaires Meta/Google (ex: `fbclid`).
  * **Sécurité & Protection** : Écran d'avertissement contre le phishing avec affichage de l'adresse IP de l'utilisateur pour les liens non certifiés.
  * **Zéro base de données** : Respect absolu de la vie privée (pas d'historique de navigation enregistré).

---

## 💬 FAQ / Foire Aux Questions

### Pourquoi avoir créé LienLibre ?
Depuis la loi C-18, Meta bloque le partage d'actualités au Canada. Les Canadiens ne peuvent plus partager d'articles de presse locale avec leurs proches sur Facebook ou Instagram. LienLibre a été créé pour redonner cette liberté d'expression de manière simple et citoyenne.

### Comment fonctionne la technologie ?
LienLibre utilise une architecture "serverless" (Cloudflare Workers). Lorsqu'un lien est partagé sur Facebook, le robot de Facebook visite le lien LienLibre. Notre serveur va charger discrètement la page de presse originale, extraire son titre, son image et sa description, et les renvoyer au robot de Facebook. Lorsque c'est un humain qui clique sur le lien, il est instantanément redirigé vers le journal d'origine.

### Est-ce légal ?
Oui. Le service ne copie pas les articles de presse et n'enfreint pas le droit d'auteur. Il agit simplement comme un pont intelligent de redirection. De plus, il encourage le soutien à la presse locale grâce à une bannière invitant les utilisateurs à s'abonner aux journaux d'origine.

---

## 📄 Communiqué de Presse (Français)

**OBJET : Un adolescent canadien de 14 ans lance « LienLibre », un outil gratuit pour contourner le blocage des nouvelles sur Facebook et Instagram.**

**CANADA, le 25 mai 2026** — Alors que le blocage du partage des médias canadiens sur les plateformes de Meta (Facebook et Instagram) perdure en raison de la loi C-18, un jeune programmeur canadien de 14 ans, William Guindon, propose une solution citoyenne et open-source : **LienLibre**.

Disponible gratuitement et sans installation, LienLibre permet à n’importe quel citoyen de coller l’URL d’un média bloqué (comme La Presse, Radio-Canada ou des journaux régionaux) pour générer un lien "pont". Une fois partagé sur les réseaux sociaux, ce lien affiche correctement la miniature de l’article, puis redirige de façon invisible le lecteur vers le site du média d’origine.

**Protéger la vie privée et soutenir la presse locale**
En plus de contourner les restrictions, LienLibre intègre une dimension éthique et de cybersécurité :
* **Nettoyage des données de suivi** : L'outil supprime automatiquement les mouchards publicitaires (ex: `fbclid`) ajoutés par les géants du web pour pister les habitudes de lecture.
* **Soutien aux médias** : Chaque page de redirection affiche un message incitant les lecteurs à s'abonner et à soutenir financièrement les rédactions locales.
* **Sécurité anti-fraude** : Pour éviter que l'outil ne soit détourné, les sites non répertoriés comme médias officiels affichent un écran d'alerte contre le hameçonnage.

« Les nouvelles locales sont indispensables à notre démocratie. Le but de LienLibre est de redonner la liberté de partage aux Canadiens tout en ramenant des lecteurs et des abonnés vers nos salles de nouvelles locales », déclare William Guindon.

**Lien du projet** : https://bwillou1.github.io/LienLibre/  
**Code source** : https://github.com/Bwillou1/LienLibre

---

## 📄 Press Release (English)

**SUBJECT: A 14-year-old Canadian developer launches "LienLibre", a free open-source tool to bypass Meta’s news ban on Facebook and Instagram.**

**CANADA, May 25, 2026** — As the ban on sharing Canadian news links on Meta’s platforms (Facebook and Instagram) continues under Bill C-18, a 14-year-old Canadian developer, William Guindon, has launched a community-driven, open-source workaround: **LienLibre**.

Available completely free of charge and with no installation required, LienLibre allows anyone to paste a blocked news URL (such as CBC, La Presse, or local community newspapers) to generate a "bridge" link. When shared on social media, the link displays the article’s thumbnail, title, and summary as usual, then seamlessly redirects clicking users to the original news website.

**Privacy protection and support for local journalism**
LienLibre is designed with strong privacy and security principles:
* **Anti-Tracking Feature**: The tool automatically strips digital tracking parameters (like `fbclid` or `utm_*`) used by tech giants to track reading habits.
* **Supporting the Press**: The redirection page features a banner encouraging readers to disable ad-blockers or subscribe to support local newsrooms.
* **Phishing Protection**: To prevent bad actors from abusing the tool, any unverified domain will trigger a security warning displaying the user's IP and advising caution before allowing them to proceed.

"Local news is critical to our democracy. LienLibre aims to give Canadians their freedom of sharing back, while driving readers and subscribers back to our local newsrooms," says William Guindon.

**Project Link**: https://bwillou1.github.io/LienLibre/  
**Source Code**: https://github.com/Bwillou1/LienLibre
