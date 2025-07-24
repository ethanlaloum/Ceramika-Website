#!/bin/bash

echo "🚀 Démarrage du serveur de test pour l'upload d'images"
echo "===================================================="

# Vérification que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

echo "📁 Dossier courant: $(pwd)"
echo "📦 Vérification des dépendances..."

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

echo "🔧 Construction du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "🌟 INSTRUCTIONS POUR TESTER L'UPLOAD :"
echo "1. Ouvrez http://localhost:3000 dans votre navigateur"
echo "2. Connectez-vous en tant qu'admin"
echo "3. Allez sur http://localhost:3000/admin/test-upload pour tester l'upload"
echo "4. Ou allez sur http://localhost:3000/admin/products pour tester dans l'interface normale"
echo "5. Surveillez cette console pour les logs du serveur"
echo ""
echo "🔍 Pour diagnostiquer les erreurs :"
echo "- Appuyez sur F12 dans le navigateur pour voir la console"
echo "- Regardez l'onglet Network pour voir les requêtes HTTP"
echo "- Surveillez cette console pour les logs côté serveur"
echo ""
echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrage du serveur en mode développement
npm run dev
