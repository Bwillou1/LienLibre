# Politique de sécurité — LienLibre

LienLibre est un outil citoyen open-source. Sa sécurité est essentielle, car un service de lien pont peut être abusé par des acteurs malveillants s’il devient une redirection ouverte.

## Objectif de sécurité

LienLibre doit servir à partager l’actualité canadienne censurée ou bloquée par Meta au Canada — pas à masquer des liens de phishing, de fraude, de malware ou de spam.

## Protections recommandées

### 1. Anti-redirection ouverte

Le Cloudflare Worker doit appliquer plusieurs niveaux :

- whitelist officielle de médias vérifiés ;
- domaine inconnu = avertissement de 10 secondes ;
- domaine dangereux = blocage complet ;
- liens signés HMAC pour empêcher la modification d’une URL générée ;
- rate limiting pour réduire l’automatisation abusive.

### 2. Anti-hameçonnage

Le Worker peut bloquer ou forcer l’avertissement pour :

- liens avec username/password ;
- `localhost`, IP privées ou IP littérales ;
- raccourcisseurs connus et IP loggers ;
- fichiers exécutables ou applications ;
- pages avec formulaires de mot de passe sur domaine inconnu ;
- redirections multiples ou suspectes.

### 3. Referrer et indexation

Toutes les réponses du Worker devraient inclure :

```http
Referrer-Policy: no-referrer
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

Cela réduit le risque que le trafic vers un site abusif soit attribué à LienLibre ou que des URLs pont soient indexées comme contenu officiel.

### 4. Mini-auditeur automatique

Un mini-bot peut lire le HTML d’un domaine inconnu et produire une décision de risque. Par défaut, le mode prudent est recommandé : le domaine devient seulement `candidate` pour révision humaine, et ne reçoit pas immédiatement une confiance permanente.

### 5. Données et statistiques

Les statistiques publiques doivent rester agrégées : domaines, compteurs, langue, heure arrondie, type de décision sécurité. Ne pas publier d’IP, d’identifiants, d’URLs sensibles ou de user-agents complets.

## Signaler une vulnérabilité ou un abus

Pour signaler une vulnérabilité, un domaine abusif ou une erreur de blocage, ouvrez une issue :

https://github.com/Bwillou1/LienLibre/issues/new

N’incluez pas de données personnelles sensibles dans une issue publique.
