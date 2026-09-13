# 🧩 Extension Chrome / Chromium — LienLibre

Générez instantanément des liens passerelles d'accès à l'information sécurisés, sans pistage, avec prévisualisation, partage natif et code QR en **1 clic** depuis n'importe quel média en ligne.

---

## 🚀 Installation rapide (Mode Développeur)

Cette extension fonctionne sur tous les navigateurs basés sur Chromium (**Google Chrome, Brave, Microsoft Edge, Arc, Opera, Vivaldi**).

### Option 1 : Depuis le fichier ZIP empaqueté (`lienlibre-extension.zip`)

1. **Téléchargez ou décompressez** l'archive `lienlibre-extension.zip`.
2. Ouvrez votre navigateur et accédez au gestionnaire d'extensions :
   - **Google Chrome / Brave** : `chrome://extensions/`
   - **Microsoft Edge** : `edge://extensions/`
   - **Arc** : `arc://extensions/`
3. Activez le **« Mode Développeur »** (interrupteur en haut à droite).
4. Cliquez sur **« Charger l'extension non empaquetée »** (*Load unpacked*).
5. Sélectionnez le dossier décompressé `extension/`.
6. ✨ L'icône **LienLibre** apparaît dans votre barre d'extensions ! Épinglez-la pour un accès en 1 clic.

---

## 💡 Fonctionnalités de l'extension

- ⚡ **Détection automatique en 1 clic** : Récupère l'URL de l'onglet actif et nettoie instantanément les mouchards de pistage (`utm_*`, `fbclid`, etc.).
- 📋 **Copie instantanée** : Copie le lien court ou miroir prêt à être partagé sur Facebook, Messenger, SMS ou Twitter/X.
- 📲 **Partage Natif** : Ouvre le menu de partage de votre système d'exploitation via la Web Share API.
- 📱 **Code QR intégré** : Génère un QR Code haute résolution scannable depuis un téléphone portable ou imprimable sur un tract citoyen.
- 🔒 **100% Respectueuse de la vie privée** : Aucune donnée de navigation n'est collectée ni envoyée à des tiers.

---

## 🛠️ Architecture technique

- **Manifest V3** : Conforme aux dernières normes de sécurité et de performances de Google Chromium.
- **Permissions minimales** : Uniquement `activeTab` (lecture de l'onglet au moment du clic) et `clipboardWrite`.
- **Moteur QR Code autonome** : Aucune dépendance externe ni requête CDN.
