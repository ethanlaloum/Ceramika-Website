#!/bin/bash

echo "⚡ Test rapide de l'upload en production"
echo "====================================="

# Démarrer le serveur de production en arrière-plan
echo "🚀 Démarrage du serveur de production..."
npm start &
SERVER_PID=$!

# Attendre que le serveur démarre
echo "⏳ Attente du démarrage du serveur (10 secondes)..."
sleep 10

# Fonction de nettoyage
cleanup() {
    echo "🛑 Arrêt du serveur..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Configurer le trap pour nettoyer à la sortie
trap cleanup INT TERM EXIT

# Test de l'API d'upload avec curl
echo "🧪 Test de l'API d'upload..."

# Créer un fichier image de test
echo "📄 Création d'un fichier de test..."
echo "Test image data" > test-image.txt

# Test de l'endpoint (sans authentification pour détecter l'erreur)
echo "📡 Test de connectivité à l'API..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/admin/upload \
  -F "file=@test-image.txt" \
  -o response.json)

HTTP_CODE="${RESPONSE: -3}"
echo "📊 Code de réponse HTTP: $HTTP_CODE"

if [ -f "response.json" ]; then
    echo "📋 Réponse de l'API:"
    cat response.json
    echo ""
fi

# Nettoyage
rm -f test-image.txt response.json

case $HTTP_CODE in
    401)
        echo "✅ API accessible - Erreur d'authentification normale"
        echo "🎯 L'API fonctionne, le problème est l'authentification en frontend"
        ;;
    404)
        echo "❌ API non trouvée - Problème de routing"
        echo "🔧 Solution: Vérifier que l'API route est correctement buildée"
        ;;
    500)
        echo "⚠️  Erreur serveur - Problème dans le code de l'API"
        echo "🔧 Solution: Vérifier les logs du serveur"
        ;;
    000)
        echo "❌ Serveur non accessible"
        echo "🔧 Solution: Vérifier que le serveur démarre correctement"
        ;;
    *)
        echo "ℹ️  Code inattendu: $HTTP_CODE"
        ;;
esac

echo ""
echo "🌐 Testez manuellement sur: http://localhost:3000/admin/test-upload"
echo "⌨️  Appuyez sur Ctrl+C pour arrêter le serveur"

# Garder le serveur en marche
wait $SERVER_PID
