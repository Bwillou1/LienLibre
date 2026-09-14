# 📱 LienLibre Android App (Jetpack Compose & On-Device Edge AI)

Application Android native pour **LienLibre**, respectant les directives [Core App Quality Guidelines](https://developer.android.com/docs/quality-guidelines/core-app-quality) et [Google Android with AI](https://developers.google.com/solutions/pages/android-with-ai).

---

## ⚖️ Principe Fondamental : Passerelle Neutre (Non-Lecteur / Sans Scraping Intégral)

LienLibre agit **exclusivement en tant que passerelle de routage citoyenne neutre** (*Neutral Gateway / Fair Dealing Carrier* - Art. 29 LDA / C-18) :
- **Aucun scraping ni stockage du texte intégral** : L'application ne télécharge, n'extrait et ne stocke jamais le corps ou le texte complet des articles sous droit d'auteur.
- **Métadonnées Open Graph uniquement** : Seules les balises publiques Open Graph fournies par l'éditeur d'origine (`og:title`, `og:description`, `og:image`, `canonical_url`) sont utilisées pour générer le lien de partage et la carte d'aperçu.
- **Redirection directe vers le navigateur** : Toute consultation complète se fait en ouvrant l'URL source officielle dans le navigateur web par défaut de l'utilisateur ou sur la liseuse.

---

## ✨ Fonctionnalités Clés

1. **Intégration Feuille de Partage Système (`ACTION_SEND`)** :
   - Partagez n'importe quel article depuis Chrome, Reddit, Twitter/X, Mastodon ou Google News directement vers LienLibre pour obtenir un lien propre et résistant.
2. **Moteur Edge AI Embarqué (`OnDeviceAiEngine`)** :
   - **Détection des murs payants** (paywalls durs, abonnements obligatoires) sur les métadonnées et en-têtes officiels sans envoyer vos données à des serveurs tiers.
   - **Détection des titres pièges à clics (clickbait)** sur les métadonnées Open Graph.
   - **Indice de Fiabilité Citoyenne** de la source en temps réel.
   - Conforme à l'architecture **Gemini Nano** / Google AICore.
3. **Design Moderne & Multi-Appareils (Material 3)** :
   - Thème dynamique Material You (Material 3 Dynamic Colors sur Android 12+ / API 31+).
   - Affichage immersif **Edge-to-Edge** (`enableEdgeToEdge()`).
   - Adapté aux téléphones, pliables et tablettes.
4. **Mode Hors-Ligne & Réseau Maillé (Mesh / TXQR)** :
   - Générateur et diffuseur de flux **TXQR** animés pour transférer les métadonnées de redirection d'écran à caméra sans Internet.
   - Formatage de paquets compacts **Meshtastic (LoRa 915 MHz)**.
5. **Passerelle Liseuse E-Ink à 4 Chiffres** :
   - Code PIN dynamique pour ouvrir directement l'URL chez l'éditeur dans le navigateur de la liseuse (Kindle, Kobo, Boox).
6. **Hub Alertes de Sécurité Civile & Météo** :
   - Notifications d'urgence locales et accès résilient aux avis officiels.

---

## 🛠️ Architecture & Dépendances

- **UI Framework** : Jetpack Compose + Material 3
- **Langage** : Kotlin 2.1 + Coroutines & Flow
- **Navigation** : AndroidX Navigation Compose
- **Réseau & Sérialisation** : Ktor Client + Kotlinx Serialization
- **Local Storage** : AndroidX DataStore Preferences
- **QR Engine** : ZXing Core

---

## 🚀 Compilation & Installation

```bash
# Se placer dans le répertoire android
cd android

# Compiler l'APK de débogage
./gradlew assembleDebug

# Installer sur un appareil ou émulateur connecté
./gradlew installDebug
```
