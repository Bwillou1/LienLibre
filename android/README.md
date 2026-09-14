# 📱 LienLibre Android App (Jetpack Compose & On-Device Edge AI)

Application Android native pour **LienLibre**, respectant les directives [Core App Quality Guidelines](https://developer.android.com/docs/quality-guidelines/core-app-quality) et [Google Android with AI](https://developers.google.com/solutions/pages/android-with-ai).

---

## ✨ Fonctionnalités Clés

1. **Intégration Feuille de Partage Système (`ACTION_SEND`)** :
   - Partagez n'importe quel article depuis Chrome, Reddit, Twitter/X, Mastodon ou Google News directement vers LienLibre sans copier-coller.
2. **Moteur Edge AI Embarqué (`OnDeviceAiEngine`)** :
   - **Détection des murs payants** (paywalls durs, abonnements obligatoires) en local sans envoyer vos données à des serveurs tiers.
   - **Détection des titres pièges à clics (clickbait)** et sensationalisme.
   - **Indice de Fiabilité Citoyenne** en temps réel.
   - Conforme à l'architecture **Gemini Nano** / Google AICore.
3. **Design Moderne & Multi-Appareils (Material 3)** :
   - Thème dynamique Material You (Material 3 Dynamic Colors sur Android 12+ / API 31+).
   - Affichage immersif **Edge-to-Edge** (`enableEdgeToEdge()`).
   - Adapté aux téléphones, pliables et tablettes.
4. **Mode Hors-Ligne & Réseau Maillé (Mesh / TXQR)** :
   - Générateur et diffuseur de flux **TXQR** animés pour transférer des articles complets d'écran à caméra sans Internet.
   - Formatage de paquets compacts **Meshtastic (LoRa 915 MHz)**.
5. **Passerelle Liseuse E-Ink à 4 Chiffres** :
   - Code PIN dynamique pour synchroniser instantanément vos lectures avec vos liseuses (Kindle, Kobo, Boox).
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
