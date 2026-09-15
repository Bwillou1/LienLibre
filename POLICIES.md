# LIENLIBRE — POLITIQUES JURIDIQUES, DE CONFIDENTIALITÉ ET DE SÉCURITÉ

**Plateforme :** LienLibre — Passerelle citoyenne d’information et recherche Open Graph  
**URLs officielles :** [https://bwillou1.github.io/LienLibre](https://bwillou1.github.io/LienLibre) · [https://lienlibre.acces-presse.workers.dev](https://lienlibre.acces-presse.workers.dev)  
**Nature :** Outil citoyen, éducatif, bénévole, *open source* et à but non lucratif  
**Version du document :** 1.0  
**Date d’entrée en vigueur :** 13 septembre 2026  
**Droit applicable :** Canada (fédéral) et Québec  
**Langue faisant foi :** Le français. Une version anglaise de courtoisie peut être ajoutée ; en cas de divergence, le français prévaut.

> **Avertissement liminaire.** Le présent document constitue un cadre contractuel et informationnel destiné à la publication. Il ne crée pas de relation avocat-client avec les utilisateurs. Il ne constitue pas un avis juridique personnalisé. Les éditeurs, contributeurs et hébergeurs sont invités à le faire réviser par leur propre conseil avant toute mise en production définitive.

---

## TABLE DES MATIÈRES

1. [Conditions générales d’utilisation et mentions légales](#1-conditions-générales-dutilisation-et-mentions-légales)
2. [Politique de confidentialité](#2-politique-de-confidentialité)
3. [Déclaration de conformité au droit d’auteur et aux médias d’information](#3-déclaration-de-conformité-au-droit-dauteur-et-aux-médias-dinformation)
4. [Politique officielle de sécurité, de quarantaine et de traitement des liens tiers (Security Airlock Protocol)](#4-politique-officielle-de-sécurité-de-quarantaine-et-de-traitement-des-liens-tiers-security-airlock-protocol)
5. [Coordonnées, avis et retrait, signalement de vulnérabilités](#5-coordonnées-avis-et-retrait-signalement-de-vulnérabilités)
6. [Annexes](#6-annexes)

---

# 1. CONDITIONS GÉNÉRALES D’UTILISATION ET MENTIONS LÉGALES

## 1.1 Identification de l’éditeur et du service

**Dénomination du service :** LienLibre  

**Description :** LienLibre est une passerelle technique citoyenne permettant de faciliter le *partage de liens* vers des médias d’information canadiens. Le service :

- reçoit une URL d’article de presse en paramètre ;
- valide le nom de domaine au regard d’une liste blanche de médias canadiens vérifiés et d’un protocole de sécurité (sas / *airlock*) ;
- effectue, le cas échéant, une **redirection technique directe** vers le site de l’éditeur d’origine ;
- **invite activement** l’utilisateur à s’abonner au média source.

LienLibre **n’est pas** un agrégateur de contenus, **n’est pas** un moteur de recherche d’articles intégraux, **n’est pas** un service de contournement de paywall, et **n’est pas** un intermédiaire éditorial.

**Statut :** projet *open source*, bénévole, à but non lucratif, à vocation éducative et civique.

**Hébergement et infrastructure (indicative) :** pages statiques GitHub Pages ; *edge workers* (Cloudflare Workers) ; résolution DNS via NextDNS (configuration durcie principale et repli NextDNS de secours avec mode liste blanche stricte).

## 1.2 Acceptation

L’accès, la consultation ou l’utilisation de LienLibre emporte acceptation pleine et entière des présentes conditions, de la politique de confidentialité, de la déclaration de droit d’auteur et du protocole de sécurité.

Si vous n’acceptez pas ces termes, vous devez cesser immédiatement toute utilisation.

L’utilisation par un mineur suppose l’autorisation d’un titulaire de l’autorité parentale. LienLibre n’est pas destiné aux enfants de moins de 14 ans au sens de la *Loi 25* (Québec).

## 1.3 Objet et limites du service

LienLibre fournit exclusivement :

1. une **validation de nom de domaine** ;
2. une **redirection HTTP/HTTPS** vers l’URL cible lorsque les conditions de sécurité et de liste blanche sont réunies ;
3. à défaut, un **sas de quarantaine** (page tampon) exigeant un consentement manuel explicite ;
4. des **invitations à s’abonner** aux médias d’origine ;
5. éventuellement, l’affichage de métadonnées Open Graph **uniquement** pour les domaines de la liste blanche officielle, dans les limites de l’utilisation équitable et sans reproduction de l’œuvre intégrale.

LienLibre **ne fournit pas** :

- la reproduction, le stockage ou la mise à disposition d’articles de presse intégraux ;
- le contournement de mesures techniques de protection (paywalls, DRM, *paywall cookies*, *walled gardens*) ;
- la modification, la traduction ou l’adaptation du contenu cible ;
- un avis, une recommandation ou une garantie quant à l’exactitude, la licéité ou la qualité des contenus tiers ;
- un service de compte utilisateur, de profilage ou de publicité comportementale.

## 1.4 Statut de simple intermédiaire technique — conduit pur

**1.4.1 Qualification.** LienLibre agit exclusivement en qualité de **simple intermédiaire technique** et de **conduit pur** (*mere conduit*). Il n’exerce aucun contrôle éditorial sur les contenus des sites cibles. Il n’initie pas la transmission, ne sélectionne pas le destinataire au-delà de la redirection demandée par l’utilisateur, et ne sélectionne ni ne modifie les informations transmises.

**1.4.2 Exonération — Loi sur le droit d’auteur, L.R.C. (1985), ch. C-42, article 31.1.**  
Conformément à l’**article 31.1** de la *Loi sur le droit d’auteur* du Canada, un fournisseur de services réseau n’enfreint pas le droit d’auteur du seul fait qu’il fournit les moyens de télécommunication nécessaires pour que l’œuvre soit transmise. LienLibre se prévaut de cette exonération :

- aucune copie permanente de l’œuvre n’est effectuée aux fins de mise à disposition du public ;
- toute copie technique, le cas échéant, est transitoire, accessoire, automatique et essentielle au fonctionnement du réseau ;
- LienLibre ne modifie pas le contenu de la transmission.

**1.4.3 Absence de connaissance et d’autorité.** LienLibre n’a ni la connaissance réelle ni le contrôle des contenus hébergés par les éditeurs tiers. Toute responsabilité civile ou pénale relative à ces contenus incombe exclusivement à l’éditeur d’origine et, le cas échéant, à l’utilisateur qui choisit de les consulter ou de les partager.

**1.4.4 Utilisation équitable — article 29.** Dans la mesure où LienLibre affiche un titre, une URL, un nom de domaine ou, pour les seuls domaines listés, des métadonnées limitées, cette utilisation s’inscrit dans le cadre de l’**utilisation équitable** (*fair dealing*) aux fins de **recherche**, d’**étude privée** et d’**éducation** (y compris l’éducation civique), au sens de l’article 29 de la *Loi sur le droit d’auteur*, et, le cas échéant, des articles 29.1 et 29.2 (critique, compte rendu, communication de nouvelles), sans préjudice des droits moraux.

Les facteurs d’appréciation (objet, nature, ampleur, solutions de rechange, effet sur le marché) sont respectés : l’ampleur est minimale ; le marché de l’éditeur n’est pas substitué ; l’utilisateur est orienté vers le site source et invité à s’abonner.

## 1.5 Obligations de l’utilisateur

L’utilisateur s’engage à :

- n’utiliser LienLibre qu’à des fins licites, civiques, éducatives ou d’information ;
- ne pas tenter de contourner le sas de sécurité, la liste blanche, le filtrage DNS, les en-têtes de sécurité ou toute mesure technique ;
- ne pas soumettre d’URL malveillantes, de charges utiles, de schémas `javascript:`, de fichiers exécutables ou de protocoles non HTTP(S) ;
- ne pas automatiser massivement le service (scraping abusif, déni de service) sans autorisation écrite ;
- ne pas se présenter comme étant LienLibre, ni utiliser ses signes distinctifs de manière trompeuse ;
- assumer **l’entière responsabilité** de ses consultations, partages de liens et clics de sortie du sas.

**Clause de non-responsabilité (disclaimer).**  
L’UTILISATEUR CONSULTE, PARTAGE ET SUIT LES LIENS **À SES SEULS RISQUES**. LienLibre, ses contributeurs, mainteneurs, hébergeurs et donateurs déclinent toute responsabilité quant aux dommages directs, indirects, spéciaux, consécutifs ou punitifs, pertes de données, préjudices moraux, atteintes à la réputation, fraudes, hameçonnage, maliciel ou contenus illicites provenant de sites tiers. Dans toute la mesure permise par le droit québécois (notamment les articles 1474 et suivants du *Code civil du Québec*) et le droit fédéral, la responsabilité, si elle était retenue, serait limitée au montant de zéro dollar canadien (0,00 CAD), le service étant gratuit.

Rien dans les présentes n’exclut la responsabilité pour faute lourde ou intentionnelle, ni les droits d’ordre public du consommateur lorsque la *Loi sur la protection du consommateur* (Québec) s’applique — ce qui n’est généralement pas le cas d’un outil bénévole non commercial.

## 1.6 Propriété intellectuelle de LienLibre

Le code source de LienLibre, sa documentation, ses listes blanches (en tant que compilations), son habillage et ses textes originaux sont protégés par le droit d’auteur. Sauf licence *open source* distincte publiée dans le dépôt Git, tous droits sont réservés.

Les marques, logos et contenus des médias cibles demeurent la propriété exclusive de leurs titulaires. Aucune licence n’est concédée à l’utilisateur sur ces éléments.

## 1.7 Disponibilité

Le service est fourni « tel quel » (*as is*) et « selon disponibilité ». Aucune garantie de continuité, d’absence d’erreur ou d’adéquation à un usage particulier n’est donnée. Des interruptions, mises en quarantaine de domaines ou retraits de liste blanche peuvent survenir sans préavis.

## 1.8 Modification et résiliation

Les présentes peuvent être modifiées. La version en vigueur est celle publiée à la date indiquée en tête. L’usage continu après modification vaut acceptation.

LienLibre peut cesser le service, retirer un domaine ou bloquer une URL à tout moment, notamment sur avis d’un titulaire de droits, d’un éditeur, d’une autorité ou sur signal de sécurité.

## 1.9 Droit applicable et for

Les présentes sont régies par les lois du **Québec** et les lois fédérales du **Canada** qui s’y appliquent.

Sous réserve des règles impératives de compétence, les tribunaux du district judiciaire de **Montréal (Québec)** sont compétents.

Les litiges de consommation transfrontaliers, le cas échéant, restent soumis aux dispositions d’ordre public applicables.

## 1.10 Mentions légales complémentaires

- **Loi canadienne anti-pourriel (LCAP / CASL) :** LienLibre n’envoie pas de messages commerciaux électroniques non sollicités.
- **Accessibilité :** des efforts raisonnables sont déployés ; les signalements d’obstacle sont bienvenus à l’adresse de contact.
- **Langues :** interface prioritairement en français, conformément à la *Charte de la langue française* (Québec), sans exclusion de l’anglais.
- **Liens sortants :** les sites `canada.ca`, centres antifraude et médias cibles sont indépendants.

---

# 2. POLITIQUE DE CONFIDENTIALITÉ

*Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé (Québec, « Loi 25 », L.R.Q., c. P-39.1, telle que modernisée) et à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE / PIPEDA, L.C. 2000, ch. 5).*

## 2.1 Responsable de la protection des renseignements personnels

Un **responsable de la protection des renseignements personnels** (RPRP) est désigné pour LienLibre.

**Contact RPRP / vie privée :** Issues du dépôt GitHub [Bwillou1/LienLibre](https://github.com/Bwillou1/LienLibre/issues), étiquette `privacy` ou contact via `security.txt`.  
**Contact de secours :** GitHub Security Advisories du projet LienLibre.

Le RPRP répond aux demandes d’accès, de rectification, de retrait de consentement et de plainte dans les délais légaux (en principe **30 jours** au Québec).

Plainte auprès de la **Commission d’accès à l’information du Québec (CAI)** : [https://www.cai.gouv.qc.ca](https://www.cai.gouv.qc.ca)  
Plainte fédérale : **Commissariat à la protection de la vie privée du Canada** : [https://www.priv.gc.ca](https://www.priv.gc.ca)

## 2.2 Principes directeurs

1. **Minimisation** — Aucune base de données d’utilisateurs n’est constituée. Aucun compte. Aucun profil.
2. **Finalité déterminée** — Les données techniques transitoires ne servent qu’à l’acheminement réseau, la sécurité (DDoS, abus) et le fonctionnement de la redirection.
3. **Limitation de conservation** — Pas de conservation nominative. Journaux d’infrastructure, s’il en existe chez les sous-traitants, selon leurs politiques (Cloudflare, GitHub, NextDNS).
4. **Pas de vente, pas de publicité comportementale, pas de cookies de traçage publicitaire.**
5. **Transparence** et **sécurité** dès la conception (*privacy by design* / DevSecOps).

## 2.3 Renseignements personnels traités — et ceux qui ne le sont pas

LienLibre **ne collecte pas** :

- nom, prénom, courriel, téléphone, adresse postale ;
- identifiants de connexion ;
- données biométriques ;
- historique de navigation persisté par LienLibre ;
- listes de favoris côté serveur ;
- données de paiement.

LienLibre **peut traiter de façon éphémère** :

| Donnée | Base / finalité | Conservation | Lieu de traitement |
|---|---|---|---|
| Adresse IP publique | Acheminement TCP/TLS, prévention DDoS, limitation d’abus | **Mémoire vive (RAM)** côté CDN / *edge* ; pas de base LienLibre | Cloudflare (réseau mondial) — voir 2.5 |
| URL demandée (paramètre) | Validation de domaine, redirection ou sas | Transitoire, durée de la requête | *Worker* / navigateur |
| En-têtes techniques (User-Agent, Accept, Referer) | Fonctionnement HTTP, diagnostics d’abus | Transitoire | *Edge* |
| Choix manuel « Quitter à mes risques » | Preuve de consentement de sortie du sas (côté client) | Non stocké côté LienLibre, sauf journal d’infrastructure du CDN | Navigateur |

**Cookies :** LienLibre n’utilise **aucun cookie de traçage publicitaire**. Des cookies strictement techniques de fournisseurs d’infrastructure (p. ex. atténuation de bot Cloudflare) peuvent être déposés par ces tiers ; ils ne sont pas utilisés par LienLibre à des fins de profilage.

**Journalisation locale navigateur :** si une préférence est mémorisée, elle l’est en `localStorage` / mémoire de session **sur l’appareil de l’utilisateur**, sous son contrôle.

## 2.4 Traitement de l’adresse IP

L’adresse IP publique de l’utilisateur **n’est pas enregistrée par LienLibre dans une base de données applicative**.

Elle est traitée **en mémoire vive**, de manière **éphémère**, par le CDN **Cloudflare** (et, le cas échéant, GitHub Pages) aux seules fins :

- d’acheminement réseau (routage anycast, terminaison TLS) ;
- de prévention et mitigation des attaques par déni de service (DDoS) ;
- de filtrage de trafic manifestement abusif.

Ce traitement est nécessaire à la **fourniture du service** et à un **intérêt légitime de sécurité**, compatible avec le critère de nécessité de la Loi 25 et les principes 4.3 / 4.5 de l’annexe 1 de la LPRPDE.

LienLibre ne recoupe pas les IP avec d’autres fichiers, ne les vend pas et ne les utilise pas à des fins de publicité.

## 2.5 Transferts hors Québec / hors Canada

L’infrastructure *edge* (Cloudflare, GitHub) peut entraîner un traitement transitoire hors Québec et hors Canada. Conformément à la Loi 25, une **évaluation des facteurs relatifs à la vie privée (EFVP)** est recommandée et, le cas échéant, une information sur le risque lié au droit applicable dans l’État d’accueil.

Mesures : chiffrement TLS en transit ; minimisation ; absence de base nominative LienLibre ; clauses contractuelles des sous-traitants (DPA Cloudflare / GitHub).

## 2.6 Droits des personnes

Sous réserve que LienLibre **ne détienne pas** de fichier nominatif permettant l’identification :

- **Droit d’accès et de rectification** (Loi 25 ; LPRPDE principe 4.9) — si des données vous concernant étaient exceptionnellement conservées, vous pouvez en demander communication et correction.
- **Droit de retirer votre consentement** pour les traitements non essentiels (il n’y en a pas côté LienLibre).
- **Droit à la cessation de diffusion / déindexation** dans les limites de la loi québécoise, lorsque applicable.
- **Portabilité** — non applicable en l’absence de compte.

Pour exercer vos droits : contact du RPRP (section 2.1). Joindre suffisamment d’éléments pour localiser le traitement, le cas échéant. Une vérification d’identité raisonnable peut être exigée.

## 2.7 Incidents de confidentialité

En cas d’incident présentant un risque de préjudice sérieux, LienLibre s’engage à aviser la CAI et les personnes concernées, conformément à la Loi 25, et, si le seuil fédéral est atteint, selon le régime LPRPDE.

## 2.8 Mineurs

Pas de collecte consciente auprès des moins de 14 ans. Les titulaires de l’autorité parentale peuvent écrire au RPRP.

## 2.9 Modifications

La politique peut être mise à jour. La date d’entrée en vigueur figure en tête du document.

---

# 3. DÉCLARATION DE CONFORMITÉ AU DROIT D’AUTEUR ET AUX MÉDIAS D’INFORMATION

## 3.1 Engagement envers les éditeurs

LienLibre reconnaît que le journalisme professionnel canadien constitue un bien public qui repose sur des modèles économiques légitimes (abonnements, licences, publicité de l’éditeur). Le service **oriente** l’utilisateur vers le site de l’éditeur et l’**invite à s’abonner**. Il ne se substitue pas au marché de l’œuvre.

## 3.2 Ce que LienLibre ne fait pas

LienLibre déclare solennellement :

1. **Aucune reproduction d’articles intégraux** — pas de copie, miroir, cache public, PDF, ou republication du texte de l’œuvre.
2. **Aucun contournement de verrous numériques** — pas de *paywall bypass*, pas de relais authentifié, pas de *proxy* de contenu payant, pas de suppression de mesures techniques de protection au sens des articles 41 et suivants de la *Loi sur le droit d’auteur*.
3. **Aucune modification de contenu** — le conduit est passif.
4. **Pas de hotlinking d’images** pour les domaines non vérifiés (voir Politique de sécurité).
5. **Pas d’extraction / proxying** de favicons ou d’images Open Graph non autorisées hors liste blanche.

## 3.3 Utilisation équitable (*fair dealing*)

Les extraits strictement nécessaires (titre, URL, nom du média, éventuellement une vignette Open Graph **uniquement** pour un domaine de la liste blanche, lorsque fournie par l’éditeur via ses propres balises publiques) sont justifiés par :

- la recherche et l’étude privée ;
- l’éducation civique et l’accès à l’information d’intérêt public ;
- le compte rendu / la communication de nouvelles, le cas échéant.

Cette utilisation est **non concurrentielle**, **minimale** et **attributive** (le lien pointe toujours vers la source).

## 3.4 Article 31.1 — intermédiaire réseau

Réitération : LienLibre est un fournisseur de moyens de télécommunication au sens de l’article 31.1. L’exonération s’applique tant que LienLibre n’a pas de rôle actif dans le choix ou la modification du contenu.

## 3.5 Procédure d’avis et retrait (*notice and takedown*) — exclusion de nom de domaine

Tout **titulaire de droits**, **éditeur de presse**, mandataire ou ayant cause peut demander l’**exclusion de son nom de domaine** (et de ses sous-domaines) de la liste blanche et, le cas échéant, le **blocage** de toute redirection LienLibre vers ce domaine.

### 3.5.1 Contenu de l’avis

L’avis écrit doit comporter :

1. identification du demandeur (raison sociale, nom du mandataire, coordonnées) ;
2. nom(s) de domaine visé(s) (FQDN) ;
3. qualité (éditeur, titulaire de droits, représentant) ;
4. description précise de la demande : retrait de liste blanche / interdiction de redirection / interdiction d’affichage de métadonnées ;
5. déclaration de bonne foi et, si allégation de contrefaçon, description de l’œuvre et de l’atteinte alléguée ;
6. signature (électronique admise).

### 3.5.2 Canal

- Issue GitHub dédiée sur [Bwillou1/LienLibre](https://github.com/Bwillou1/LienLibre/issues) : étiquette `takedown` / `legal`  
- GitHub Security Advisory : [https://github.com/Bwillou1/LienLibre/security/advisories/new](https://github.com/Bwillou1/LienLibre/security/advisories/new)

### 3.5.3 Traitement

- **Accusé de réception** dans les **cinq (5) jours ouvrables** suivant la réception d’un avis complet.
- **Mesure conservatoire** : retrait ou mise en quarantaine du domaine dans un délai raisonnable, en principe **soixante-douze (72) heures** pour un avis clair et complet émanant d’un éditeur identifiable.
- LienLibre n’est **pas tenu de trancher** un litige de fond entre tiers ; en cas de doute sérieux, le domaine est **retiré par précaution** jusqu’à clarification.
- Un **contre-avis** de l’utilisateur n’a pas pour effet de rétablir un domaine retiré à la demande de l’éditeur : le respect de la volonté de l’éditeur prime.

Cette procédure est **volontaire et plus protectrice** que le seul régime de l’avis-avis (*notice-and-notice*) prévu aux articles 41.25 et suivants de la *Loi sur le droit d’auteur*. LienLibre n’est pas un FSI au sens de ces dispositions, mais s’aligne sur leur esprit de coopération.

### 3.5.4 Abus de notices

Les avis manifestement infondés, diffamatoires ou de mauvaise foi peuvent être ignorés et, le cas échéant, signalés.

## 3.6 Marques de commerce

Les noms des médias sont utilisés de façon nominative pour identifier la destination du lien, sans laisser croire à un partenariat, un endossement ou une affiliation, sauf mention contraire écrite de l’éditeur.

## 3.7 *Bill C-18* / *Loi sur les nouvelles en ligne* et régimes connexes

LienLibre n’est pas une « plateforme numérique » au sens des seuils d’assujettissement typiques de la *Loi sur les nouvelles en ligne* (L.C. 2023, ch. 23) : absence de mise en marché de contenus d’actualité, absence de publicité, absence de reproduction. Si un éditeur estime qu’une interaction particulière pose problème, la procédure 3.5 s’applique.

---

# 4. POLITIQUE OFFICIELLE DE SÉCURITÉ, DE QUARANTAINE ET DE TRAITEMENT DES LIENS TIERS  
## (*Security Airlock Protocol*)

*Document DevSecOps — défense en profondeur. Complète les CGU. En cas de conflit entre fluidité d’usage et sécurité, la sécurité prévaut.*

## 4.1 Objectif et périmètre

**Objectif.** Protéger les citoyennes et citoyens contre le hameçonnage, le maliciel, l’usurpation de médias, le hotlinking non autorisé et l’injection de contenu, tout en préservant la mission civique de LienLibre.

**Périmètre.** Toute URL soumise à LienLibre (paramètre de requête, formulaire, API interne, lien partagé). S’applique aux interfaces GitHub Pages et Cloudflare Workers, aux listes blanches, au mini-bot et au sas.

**Hors périmètre.** La sécurité des sites cibles eux-mêmes (responsabilité de l’éditeur) ; les postes des utilisateurs ; les extensions de navigateur tierces.

**Classification.** Politique publique. Les identifiants de configuration DNS ci-dessous sont volontairement publiés (transparence) ; les secrets opérationnels (jetons d’admin, clés de signature) ne le sont pas.

## 4.2 Architecture de défense en profondeur

Trois lignes de défense indépendantes : **DNS → Mini-Bot (heuristique) → Sas de quarantaine**. Aucune ligne ne dispense des autres.

```
[Utilisateur]
    │  URL
    ▼
[Filtrage schéma / longueur / caractères]
    │
    ▼
[Double DNS protecteur] ── malveillant ──► HTTP 403
    │
    ▼
[Sentinelle Mini-Bot — score /100]
    │
    ├── domaine ∈ liste blanche médias CA ──► redirection directe
    │         + invitation à l'abonnement
    │         + OG limitado autorisé
    │
    └── domaine ∉ liste blanche ──► SAS DE SÉCURITÉ (airlock)
              │
              ├── INTERDICTION images / extraits / favicons tiers
              ├── action manuelle « Quitter à mes risques »
              ├── bouton Canada.ca
              └── signalement antifraude / CCCS
```

### 4.2.1 Ligne 1 — Double filtrage DNS protecteur

| Priorité | Résolveur | Rôle |
|---|---|---|
| **1 (principal)** | **NextDNS Anti-Malware / Anti-Phishing**, configuration durcie principale, via **DNS-over-HTTPS (DoH)** | Blocage maliciel, hameçonnage, domaines newly-registered à risque selon politiques NextDNS |
| **2 (secours)** | **NextDNS Anti-Malware / Anti-Phishing**, configuration durcie secondaire de repli, via **DNS-over-HTTPS (DoH)** | Disponibilité et basculement automatique si profil principal saturé ou indisponible (repli sur liste blanche stricte en cas de panne globale) |

**Règle dure.** Tout nom de domaine identifié comme malveillant par le résolveur retenu est **immédiatement bloqué** avec une réponse **HTTP 403 Forbidden**. Aucune redirection. Aucun sas cliquable vers la cible. Message d’erreur explicite + liens vers `canada.ca` et le signalement.

Le trafic DNS applicatif de résolution des cibles **ne doit pas** utiliser un résolveur « ouvert » non filtré (`8.8.8.8`, `1.1.1.1` standard, FAI) pour la décision d’autorisation.

### 4.2.2 Ligne 2 — Sentinelle Mini-Bot (analyse heuristique légère)

Audit **en temps réel**, sans exécution du contenu distant (pas de headless browser lourd, pas de téléchargement d’exécutables) :

| Signal | Effet |
|---|---|
| HTTPS/TLS valide (chaîne de certificats, pas d’erreur fatale) | positif |
| Schéma autre que `https:` (ou `http:` en dépréciation) | négatif / blocage selon politique |
| Adresse IPv4/IPv6 **brute** dans l’hôte | négatif fort — **pas de redirection directe** |
| TLD à haut risque (liste maintenue : p. ex. certains ccTLD abusifs, TLD « cheap ») | négatif |
| Extension / chemin exécutable ou dangereux (`.exe`, `.scr`, `.bat`, `.cmd`, `.com`, `.pif`, `.msi`, `.dll`, `.js` servi comme pièce, `.hta`, `.apk`, `.iso`, `.img`, `.vbs`, `.ps1`, `.jar`) | **blocage 403** |
| Homoglyphes / punycode trompeur imitant un média canadien | négatif fort + sas obligatoire |
| Longueur d’URL excessive, identifiants d’hameçonnage, `@` userinfo | négatif / normalisation stricte |

**Score de confiance /100.** Tout score strictement inférieur à **75/100** entraîne le **blocage immédiat (HTTP 403)** de la requête sans aucun accès au sas de sécurité. Pour un domaine hors liste blanche atteignant ou dépassant le seuil de 75/100, l'accès est strictement cantonné au **sas de sécurité actif** avec consentement manuel explicite. Un score élevé ne dispense jamais du sas pour un domaine non répertorié.

### 4.2.3 Ligne 3 — Sas de sécurité actif (*Airlock*) pour domaines non listés

Si le domaine **ne figure pas** dans la **liste blanche officielle des médias d’information canadiens vérifiés** :

1. **Aucune redirection automatique** (ni `302` immédiat, ni meta-refresh court, ni `window.location` sans geste).
2. L’internaute est **obligatoirement arrêté** sur une **page tampon de quarantaine** (« Sas de Sécurité »).
3. La page affiche : l’URL cible en clair (punycode décodé + forme brute), les alertes Mini-Bot, le score indicatif, l’absence de garantie.
4. **Consentement manuel explicite** : bouton distinct, non précoché, libellé non ambigu **« Quitter à mes risques »** (ou équivalent). Un simple défilement ou une temporisation **ne suffit pas**.
5. **Bouton de retour immédiat** vers le portail officiel de sécurité / information du gouvernement du Canada : [https://www.canada.ca/](https://www.canada.ca/).
6. **Bouton de signalement** vers le **Centre antifraude du Canada** et/ou le **Centre canadien pour la cybersécurité (CCRS / CCCS)** :
   - Antifraude : [https://www.antifraudcentre-centreantifraude.ca/](https://www.antifraudcentre-centreantifraude.ca/)
   - CCCS : [https://www.cyber.gc.ca/](https://www.cyber.gc.ca/)
   - Signalement maliciel / hameçonnage CCCS selon les canaux publiés (p. ex. `https://www.cyber.gc.ca/fr/incident`).

### 4.2.4 Interdiction stricte des images et extraits tiers (domaines non vérifiés)

Pour tout domaine **hors liste blanche**, LienLibre **interdit formellement** :

- l’extraction de métadonnées visuelles (images Open Graph, Twitter Cards) ;
- le *proxying* d’images ;
- l’affichage de favicons externes non fiables ;
- tout hotlinking vers des ressources du site non vérifié.

**Motifs :** éviter le hotlinking non autorisé, la violation de propriété intellectuelle, le pistage par l’éditeur malveillant (balises espionnes), et l’injection (SVG/XSS, images piégées).

Sur le sas, seuls des **pictogrammes locaux** (première partie, dépôt LienLibre) sont utilisés.

Pour les domaines **en liste blanche**, l’affichage OG demeure **facultatif**, **limité**, et **cessera** sur avis de l’éditeur (procédure 3.5).

## 4.3 Gestion des risques et protection de l’infrastructure

| Risque | Traitement |
|---|---|
| XSS via paramètre URL | Encodage de sortie strict, CSP, interdiction `javascript:` |
| Open redirect abusif | Liste blanche + sas ; allowlist de schémas `https` |
| SSRF depuis le Worker | Pas de fetch aveugle de contenu ; timeouts ; blocage IP privées (RFC1918, link-local, metadata cloud) |
| DDoS | Cloudflare ; pas d’état serveur lourd |
| Empoisonnement de cache | Cache-Control sur pages de sas : `no-store` |
| Supply chain (dépendances) | Pinning, revue, SBOM sommaire dans le dépôt |
| Usurpation de marque LienLibre | URLs officielles documentées ; `security.txt` |
| Contournement paywall involontaire | Jamais de fetch du body article ; pas de cookies d’éditeur rejoués |

**En-têtes recommandés (Workers / Pages) :**  
`Content-Security-Policy` (default-src `'self'` ; interdiction d’images tierces hors allowlist), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` ou `strict-origin`, `Permissions-Policy` restrictive, `X-Frame-Options: DENY`, HSTS lorsque le domaine canonique le permet.

**Secrets.** Aucune clé dans le dépôt public. Rotation documentée.

**Journalisation de sécurité.** Minimiser ; pas d’URL complètes contenant des jetons dans les logs persistants.

## 4.4 Médias non encore répertoriés — procédure d’audit pour intégration à la liste blanche

Un domaine peut être proposé pour intégration s’il s’agit d’un **média d’information canadien** (presse écrite, audiovisuelle, numérique d’intérêt public) identifiable.

**Dossier minimal :**

1. FQDN canonique et variantes (`www`, sections) ;
2. raison sociale / statut (société de presse, coopérative, organisme) ;
3. preuve d’établissement au Canada (siège, immatriculation, salle de rédaction) ;
4. URL de la politique de confidentialité et des CGU de l’éditeur ;
5. confirmation HTTPS valide ;
6. contact éditorial pour avis et retrait ;
7. déclaration qu’il ne s’agit pas d’un site de désinformation impersonnant un média établi.

**Critères de refus :** maliciel DNS, homographe, contenu principalement UGC non édité se faisant passer pour un média, sites adultes, pharmacies illégales, crypto-escroqueries, *typosquatting*.

**Décision.** Discrétionnaire, bénévole, révocable. L’inscription **n’est pas un endossement éditorial**.

**Retrait.** Automatique sur avis 3.5, sur signal DNS malveillant, ou sur perte de critères.

## 4.5 Divulgation responsable et `security.txt`

LienLibre encourage la **divulgation responsable** des vulnérabilités.

**Ne pas** : exécuter un déni de service, accéder à des données de tiers, modifier des données, exfiltrer, ou tester des systèmes hors du périmètre LienLibre.

**Délai de grâce suggéré :** 90 jours avant divulgation publique, sauf exploitation active.

Fichier publié à la racine et sur `.well-known/security.txt` :

```
Contact: https://github.com/Bwillou1/LienLibre/security/advisories/new
Expires: 2027-09-13T00:00:00.000Z
Preferred-Languages: fr, en
Canonical: https://bwillou1.github.io/LienLibre/.well-known/security.txt
Policy: https://bwillou1.github.io/LienLibre/POLICIES.md
Acknowledgments: https://github.com/Bwillou1/LienLibre/security/advisories
```

---

# 5. COORDONNÉES, AVIS ET RETRAIT, SIGNALEMENT DE VULNÉRABILITÉS

| Objet | Canal |
|---|---|
| RPRP / vie privée | Issues GitHub [Bwillou1/LienLibre](https://github.com/Bwillou1/LienLibre/issues) (étiquette `privacy`) |
| Avis et retrait éditeurs / droit d’auteur | Issues GitHub [Bwillou1/LienLibre](https://github.com/Bwillou1/LienLibre/issues) (étiquette `takedown` / `legal`) |
| Sécurité / vulnérabilités | [GitHub Security Advisories](https://github.com/Bwillou1/LienLibre/security/advisories/new) · `.well-known/security.txt` |
| Sas — fraude | [Centre antifraude du Canada](https://www.antifraudcentre-centreantifraude.ca/) |
| Cybersécurité nationale | [cyber.gc.ca](https://www.cyber.gc.ca/) |
| Portail gouvernemental | [canada.ca](https://www.canada.ca/) |
| CAI (Québec) | [cai.gouv.qc.ca](https://www.cai.gouv.qc.ca) |
| Commissariat vie privée Canada | [priv.gc.ca](https://www.priv.gc.ca) |

---

# 6. ANNEXES

## Annexe A — Définitions

**Liste blanche :** compilation de noms de domaine de médias d’information canadiens vérifiés par les mainteneurs.  
**Sas / Airlock :** page tampon sans redirection automatique.  
**Conduit pur :** transmission technique sans sélection ni modification du contenu.  
**Éditeur d’origine :** titulaire du site cible.  
**Mini-Bot :** module heuristique léger, non signataire d’une certification de confiance.

## Annexe B — Références normatives (indicatives)

- *Loi sur le droit d’auteur*, L.R.C. (1985), ch. C-42, art. 29, 29.1, 29.2, 31.1, 41 et s., 41.25 et s.  
- *Loi sur la protection des renseignements personnels dans le secteur privé*, RLRQ c. P-39.1 (Loi 25).  
- *LPRPDE*, L.C. 2000, ch. 5.  
- *Code civil du Québec*, notamment art. 1457, 1470, 1471, 1474.  
- *Charte de la langue française*, RLRQ c. C-11.  
- *Loi canadienne anti-pourriel*, L.C. 2010, ch. 23.  
- NIST SSDF / pratiques OWASP ASVS (référentiels techniques, non contraignants).  
- RFC 9116 (`security.txt`).

## Annexe C — Clause de langue

Les parties ont expressément exigé que le présent document soit rédigé en français. *The parties have requested that this document be drawn up in French.* Une traduction anglaise de courtoisie pourra être jointe.

## Annexe D — Licence de ce document juridique

Sauf mention contraire, le présent texte de politiques est publié pour usage du projet LienLibre. La reproduction fidèle sur les URLs officielles est autorisée. Il ne s’agit pas d’un modèle générique garanti pour d’autres services.

---

**Fin du document — LienLibre POLICIES.md v1.0 — 2026-09-13**

*Rédigé dans un esprit de conformité Loi 25 / LPRPDE, d’exonération 31.1 LDA, d’utilisation équitable art. 29, de procédure d’avis et retrait volontaire, et de défense en profondeur (Double Bouclier NextDNS / Mini-Bot / Airlock / Failsafe Liste Blanche).*
