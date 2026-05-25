#!/bin/bash
# Script de déploiement automatique LienLibre sur GitHub Pages et Cloudflare Workers
set -e

# S'assurer qu'on est dans le bon dossier
cd "$(dirname "$0")"

echo "==========================================="
echo " 🚀 DÉPLOIEMENT AUTOMATIQUE GITHUB + CLOUDFLARE "
echo "==========================================="
echo ""
echo "Étape 1 : Connexion à votre compte Cloudflare (Gratuit)..."
echo "Une fenêtre de votre navigateur va s'ouvrir."
echo "Veuillez cliquer sur 'Autoriser'."
echo ""

# Connexion à Cloudflare
npx wrangler login

echo ""
echo "Étape 2 : Déploiement du Backend (Worker)..."
echo "Déploiement en cours sur Cloudflare..."
echo ""

# Lancer le déploiement et capturer la sortie
DEPLOY_OUT=$(npx wrangler deploy worker.js --name lienlibre-api)
echo "$DEPLOY_OUT"

# Extraire l'URL générée (.workers.dev)
WORKER_URL=$(echo "$DEPLOY_OUT" | grep -o -E "https://[a-zA-Z0-9.-]+\.workers\.dev" | head -n 1)

if [ -z "$WORKER_URL" ]; then
  echo ""
  echo "❌ Erreur : Impossible de récupérer l'URL du Worker."
  exit 1
fi

echo ""
echo "✅ Backend déployé sur : $WORKER_URL"
echo ""
echo "Étape 3 : Mise à jour automatique de index.html..."

# Mettre à jour l'URL dans index.html
sed -i '' "s|const WORKER_URL = '.*';|const WORKER_URL = '$WORKER_URL';|g" index.html

echo "✅ Fichier index.html configuré."
echo ""
echo "Étape 4 : Push automatique sur votre GitHub Pages..."

# Pousser sur GitHub
git add index.html
git commit -m "Configure WORKER_URL to $WORKER_URL"
git push origin main

echo ""
echo "==========================================="
echo "       🎉 LIENLIBRE EST EN LIGNE !         "
echo "==========================================="
echo "Votre site web est maintenant en ligne sur :"
echo "👉 https://bwillou1.github.io/LienLibre/"
echo ""
echo "Vous pouvez l'ouvrir sur votre mobile, il fonctionne de manière 100% autonome !"
echo "==========================================="
