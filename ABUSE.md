# Signaler un abus — LienLibre

LienLibre est un projet citoyen conçu pour partager des liens d’actualité canadienne censurés ou bloqués par Meta au Canada. Il ne doit pas être utilisé pour masquer des liens de phishing, de fraude, de malware, de spam ou de harcèlement.

## Utilisations interdites

Il est interdit d’utiliser LienLibre pour :

- hameçonnage, faux formulaires de connexion, vol d’identifiants ;
- malware, téléchargement d’exécutables ou d’applications malveillantes ;
- arnaques crypto, faux concours, faux cadeaux, usurpation d’identité ;
- traçage IP, liens de type IP logger ou grabber ;
- redirections multiples visant à cacher la destination réelle ;
- campagnes de spam ou automatisation abusive ;
- contenu illégal ou visant directement à nuire à une personne.

## Mesures anti-abus prévues

Le Worker Cloudflare peut appliquer :

- une whitelist officielle de médias vérifiés ;
- une barrière anti-hameçonnage de 10 secondes pour les domaines inconnus ;
- un blocage strict des IP locales/privées, shorteners abusifs et fichiers dangereux ;
- une politique `Referrer-Policy: no-referrer` pour éviter d’associer LienLibre au trafic de sites tiers ;
- `X-Robots-Tag: noindex, nofollow` sur les URLs pont ;
- du rate limiting ;
- des liens signés HMAC ;
- une journalisation agrégée et anonymisée des événements de protection.

## Comment signaler un abus

Ouvrez une issue sur GitHub :

https://github.com/Bwillou1/LienLibre/issues/new?template=abuse_report.yml

Incluez si possible :

1. le lien LienLibre abusif ;
2. la destination affichée ;
3. une capture d’écran ;
4. pourquoi le lien semble dangereux ;
5. la date et l’heure approximative.

N’incluez pas d’informations personnelles sensibles dans une issue publique.

## Réponse possible

Selon le cas, le domaine peut être :

- bloqué immédiatement ;
- laissé uniquement avec avertissement de 10 secondes ;
- retiré d’une whitelist automatique ;
- ajouté à une liste de blocage ;
- signalé aux plateformes ou autorités compétentes si nécessaire.
