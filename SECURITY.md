# Politique de Sécurité — LienLibre (Security Policy)

La sécurité et la protection de nos utilisateurs sont au cœur du projet **LienLibre**.

L'ensemble de nos politiques officielles de sécurité (Security Airlock Protocol, défense en profondeur, filtrage NextDNS / Cloudflare, audit Mini-Bot Sentinel, conformité Loi 25 / LPRPDE et article 31.1 LDA) sont consultables dans le document maître :
👉 **[POLICIES.md](./POLICIES.md)**

---

## 🛡️ Mesures de protection intégrées

1. **Défense en profondeur & Filtrage DNS Protecteur :**
   - **Priorité 1 :** NextDNS Anti-Malware / Anti-Phishing avec ID de configuration durcie (`8d3993`) via DNS-over-HTTPS.
   - **Priorité 2 (Fallback) :** Cloudflare `1.1.1.3` (DNS Security & Malware Protection).
   - Tout domaine identifié comme malveillant est immédiatement bloqué avec un statut HTTP `403 Forbidden`.

2. **Sentinelle Mini-Bot & Sas de Sécurité (Airlock) :**
   - Les liens vers des domaines non vérifiés sont obligatoirement stoppés dans un sas de sécurité avec score indicatif.
   - **Interdiction stricte des images tierces** et hotlinking pour les domaines non vérifiés.
   - Bouton d'annulation et de retour en lieu sûr vers [Canada.ca](https://www.canada.ca/).
   - Liens de signalement direct vers le Centre antifraude du Canada et le Centre canadien pour la cybersécurité (CCCS).

3. **En-têtes de Sécurité HTTP & Assainissement :**
   - `Content-Security-Policy` stricte.
   - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin`.
   - Échappement systématique de toutes les données entrantes (`escapeHtml`) contre les failles XSS.

---

## 📞 Signaler une vulnérabilité (Divulgation responsable)

Nous appliquons les principes de divulgation responsable (RFC 9116) :
- **Security Advisory GitHub :** [Signaler une vulnérabilité en privé](https://github.com/Bwillou1/LienLibre/security/advisories/new)
- **Fichier de sécurité :** [`.well-known/security.txt`](./.well-known/security.txt)
- **Signalement d'abus / Avis et retrait :** Ouvrir une issue sur le dépôt GitHub avec l'étiquette `takedown` ou `privacy`.
