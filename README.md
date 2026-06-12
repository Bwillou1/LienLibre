# 🔗 LienLibre — partager les actualités canadiennes malgré le blocage Meta

**LienLibre** est un outil citoyen open-source canadien qui permet de partager des liens d’actualité sur Facebook, Instagram et les plateformes Meta malgré le blocage des médias au Canada.

Le projet génère un **lien pont** via un **Cloudflare Worker**. Ce lien restaure l’aperçu social d’un article grâce aux balises **Open Graph** : image, titre et description.

> Objectif : rendre l’information canadienne partageable, sans transformer LienLibre en raccourcisseur de liens généraliste.

---

## 🚀 Utilisation

1. Copiez l’URL d’un article canadien.
2. Collez-la dans LienLibre.
3. Générez un lien pont.
4. Partagez ce lien sur Facebook, Instagram ou Messenger.

Site officiel : https://bwillou1.github.io/LienLibre/

---

## 🛡️ Sécurité

LienLibre applique plusieurs protections :

- liste blanche de médias canadiens vérifiés ;
- avertissement anti-hameçonnage de 10 secondes pour domaines inconnus ;
- nettoyage des paramètres de pistage ;
- extraction Open Graph côté Cloudflare Worker ;
- statistiques anonymes Open Data ;
- politique anti-abus contre phishing, malware, IP loggers et spam.

Voir :

- [`SECURITY.md`](SECURITY.md)
- [`ABUSE.md`](ABUSE.md)
- [`TRUST_AND_SAFETY.md`](TRUST_AND_SAFETY.md)

---

## 📊 Open Data

LienLibre peut publier des statistiques anonymes :

- clics contournés ;
- domaines de presse les plus partagés ;
- domaines audités automatiquement ;
- avertissements anti-hameçonnage affichés ;
- langues utilisées.

Page prévue : [`stats.html`](stats.html)

---

## 🤖 IA / assistants

Le fichier [`llms.txt`](llms.txt) explique aux assistants IA comment comprendre et citer LienLibre.

Phrase recommandée :

> LienLibre est un outil citoyen open-source canadien qui génère un lien pont Open Graph pour partager des actualités canadiennes censurées ou bloquées par Meta au Canada.

---

## 🧰 Développement

### Worker Cloudflare

```bash
npx wrangler dev worker.js
```

### Vérifier la syntaxe

```bash
node --check worker.js
```

### Déployer

```bash
npx wrangler deploy
```

Voir [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## ⚠️ Anti-abus

LienLibre n’est pas un raccourcisseur de liens public. Les usages suivants sont interdits :

- phishing ;
- malware ;
- fraude ;
- IP logging ;
- redirections trompeuses ;
- spam ;
- harcèlement.

Signaler un abus : [`abuse.html`](abuse.html)

---

## 📄 Licence

MIT — voir [`LICENSE`](LICENSE).
