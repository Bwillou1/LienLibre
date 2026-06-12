# Trust & Safety — LienLibre

Ce document décrit la stratégie anti-abus de LienLibre afin d’éviter que l’outil soit utilisé comme redirection ouverte ou comme masque pour des activités criminelles.

## Position de sécurité

LienLibre ne doit pas être un raccourcisseur de liens généraliste. C’est un outil spécialisé pour l’accès à l’information et le partage d’actualités canadiennes malgré le blocage/censure de Meta au Canada.

## Niveaux de confiance

### 1. Domaine vérifié manuellement

- Média canadien ou source d’information légitime.
- Redirection immédiate.
- Compteur Open Data anonyme.

### 2. Domaine candidat après audit automatique

- Le mini-bot a lu le HTML et n’a pas détecté de signal dangereux évident.
- Par défaut, ce statut ne donne pas une confiance totale.
- Le domaine peut rester derrière l’avertissement de 10 secondes jusqu’à validation humaine.

### 3. Domaine inconnu

- Affichage d’une page d’avertissement.
- Destination complète visible.
- Délai anti-hameçonnage.
- Pas d’indexation.

### 4. Domaine bloqué

- Pas de redirection.
- Page de blocage avec raison générale.
- Signalement possible.

## Signaux de blocage immédiat

- `localhost`, IP privées, IP locales ;
- liens avec username/password ;
- raccourcisseurs ou IP loggers connus ;
- extensions dangereuses : `.exe`, `.apk`, `.msi`, `.dmg`, `.bat`, `.ps1`, etc. ;
- formulaires de mot de passe sur domaine inconnu ;
- redirections anormales ;
- contenu non HTML quand un article est attendu.

## Protections recommandées côté Cloudflare Worker

- `Referrer-Policy: no-referrer` sur toutes les réponses Worker ;
- `X-Robots-Tag: noindex, nofollow` sur toutes les URLs pont ;
- signature HMAC des liens générés ;
- rate limiting par fenêtre temporelle ;
- Cloudflare Turnstile sur l’endpoint de création si abus réel ;
- KV pour whitelist manuelle, candidats et blocklist ;
- stats agrégées uniquement, sans IP en clair.

## Confidentialité

LienLibre doit mesurer l’impact public sans surveiller les utilisateurs. Les statistiques publiques devraient rester agrégées : domaine, langue, heure arrondie, type de décision sécurité. Ne publiez pas d’IP, d’URL complètes sensibles ou de user-agents complets.
