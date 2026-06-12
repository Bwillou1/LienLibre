# Mise à jour whitelist médias canadiens

Source : `uploads/canada_media_domains.txt`  
Date : 2026-06-12

## Résultat du nettoyage

- Lignes source : 1351
- Domaines valides uniques : 1106
- Domaines après réduction par parent : 1105
- Domaines recommandés pour whitelist directe : 1079
- Domaines à vérifier avant confiance directe : 26
- Lignes rejetées : 1 (`http:`)

## Fichiers générés

| Fichier | Usage |
|---|---|
| `canada_media_domains_clean.txt` | Tous les domaines valides uniques nettoyés. |
| `canada_media_domains_reduced.txt` | Liste réduite : les sous-domaines couverts par un parent ont été retirés. |
| `canada_media_domains_direct_whitelist_recommended.txt` | Liste recommandée à intégrer dans `ALLOWED_DOMAINS`. |
| `canada_media_domains_review_first.txt` | Domaines à garder derrière l’avertissement 10 secondes jusqu’à validation. |
| `canada_media_domains_worker_block.txt` | Bloc prêt à coller dans `worker.js`. |
| `canada-media-whitelist.generated.js` | Module JS exportant les listes. |
| `merge-whitelist.mjs` | Script qui insère automatiquement la liste recommandée dans `worker.js`. |

## Intégration rapide

Copier dans le dépôt :

```txt
canada_media_domains_direct_whitelist_recommended.txt
canada_media_domains_review_first.txt
canada_media_domains_worker_block.txt
merge-whitelist.mjs
```

Puis dans le repo local :

```bash
node merge-whitelist.mjs
node --check worker.js
git add worker.js canada_media_domains_direct_whitelist_recommended.txt canada_media_domains_review_first.txt
git commit -m "Expand Canadian media whitelist"
git push origin main
```

## Pourquoi certains domaines sont en révision ?

Quelques entrées ressemblent à des agrégateurs, plateformes UGC, shorteners historiques, pages gouvernementales, fils de presse ou domaines génériques. Par prudence, elles ne devraient pas toutes éviter automatiquement l’avertissement anti-hameçonnage.

Liste en révision : voir `canada_media_domains_review_first.txt`.
