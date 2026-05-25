# Politique de Sécurité — LienLibre

La sécurité et la protection de nos utilisateurs sont au cœur du projet LienLibre. L'application intègre plusieurs couches de protection pour éviter les détournements ou utilisations malveillantes.

---

## 🛡️ Mesures de protection intégrées

### 1. Protection contre les redirections ouvertes (Anti-Phishing)
Afin d'empêcher les attaquants d'utiliser LienLibre comme couverture pour des campagnes de phishing (hameçonnage), le backend (Cloudflare Worker) n'autorise les redirections que vers une **liste blanche stricte de domaines de médias d'information canadiens reconnus**.

Toute tentative de redirection vers un domaine hors liste blanche renverra une page d'erreur `403 Forbidden` listant les domaines autorisés.

### 2. En-têtes de Sécurité HTTP
Toutes les réponses générées par le backend contiennent des en-têtes HTTP restrictifs pour empêcher les failles de sécurité classiques :
* **Content-Security-Policy (CSP)** : Bloque l'exécution de scripts tiers non autorisés.
* **X-Frame-Options (DENY)** : Empêche l'intégration du site dans des frames (protection anti-Clickjacking).
* **X-Content-Type-Options (nosniff)** : Empêche le reniflage de type MIME.
* **Referrer-Policy** : Limite les informations de referer transmises lors des clics.

### 3. Assainissement des données (Sanitization)
Toutes les entrées transmises via les paramètres de requête URL sont nettoyées et échappées (`escapeHtml`) avant d'être réinjectées dans les réponses du serveur pour neutraliser toute tentative d'injection de script (XSS).

---

## 📞 Signaler une vulnérabilité

Si vous découvrez une faille de sécurité ou si vous souhaitez suggérer l'ajout d'un média canadien légitime à la liste blanche, veuillez créer une *Issue* sur notre dépôt GitHub ou contacter le mainteneur du projet.
