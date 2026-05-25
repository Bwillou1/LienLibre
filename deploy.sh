#!/bin/bash
# Script de déploiement automatique LienLibre
set -e

# S'assurer qu'on est dans le bon dossier
cd "$(dirname "$0")"

echo "==========================================="
echo "   🚀 DÉPLOIEMENT AUTOMATIQUE LIENLIBRE   "
echo "==========================================="
echo ""
echo "Étape 1 : Connexion et déploiement du Backend (Worker)..."
echo "Une fenêtre de votre navigateur va s'ouvrir pour vous connecter à Cloudflare."
echo "Veuillez cliquer sur 'Autoriser' dans votre navigateur."
echo ""

# Lancer le déploiement et capturer la sortie
DEPLOY_OUT=$(npx wrangler deploy worker.js --name lienlibre-api)

# Afficher la sortie pour l'utilisateur
echo "$DEPLOY_OUT"

# Extraire l'URL générée par Wrangler (.workers.dev)
WORKER_URL=$(echo "$DEPLOY_OUT" | grep -o -E "https://[a-zA-Z0-9.-]+\.workers\.dev" | head -n 1)

if [ -z "$WORKER_URL" ]; then
  echo ""
  echo "❌ Erreur : Impossible de récupérer l'URL du Worker."
  echo "Assurez-vous d'avoir validé l'autorisation dans votre navigateur."
  exit 1
fi

echo ""
echo "✅ Backend déployé avec succès sur : $WORKER_URL"
echo ""
echo "Étape 2 : Configuration automatique du Frontend..."

# Mettre à jour l'URL dans index.html en remplaçant la ligne const WORKER_URL
# Utilisation de sed compatible macOS
sed -i '' "s|const WORKER_URL = '.*';|const WORKER_URL = '$WORKER_URL';|g" index.html

echo "✅ Fichier index.html configuré avec l'URL du Worker."
echo ""
echo "Étape 3 : Déploiement du Frontend (Cloudflare Pages)..."
echo "Votre site web est en cours de publication..."
echo ""

npx wrangler pages deploy . --project-name lienlibre

echo ""
echo "==========================================="
echo "       🎉 LIENLIBRE EST EN LIGNE !         "
echo "==========================================="
echo "Ouvrez le lien du projet Cloudflare Pages ci-dessus sur votre mobile pour tester !"
echo "Aucune autre configuration n'est nécessaire."
echo "==========================================="
