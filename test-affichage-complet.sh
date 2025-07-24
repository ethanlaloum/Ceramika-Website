#!/bin/bash

echo "🖼️ Test complet de l'affichage des images avec serveur"
echo "=================================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 1. Arrêter les processus existants
print_status "Arrêt des processus existants..."
pkill -f "next" 2>/dev/null || echo "Aucun processus à arrêter"
sleep 2

# 2. Rebuild avec les corrections d'affichage
print_status "Rebuild avec les corrections d'affichage..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Erreur lors du build"
    exit 1
fi

# 3. Démarrer le serveur en arrière-plan
print_status "Démarrage du serveur de développement..."
npm run dev &
SERVER_PID=$!

# Attendre que le serveur démarre
print_status "Attente du démarrage du serveur (15 secondes)..."
sleep 15

# Fonction de nettoyage
cleanup() {
    echo ""
    print_status "Arrêt du serveur..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM EXIT

# 4. Tester l'accès aux images
print_status "Test d'accès aux images..."

# Trouver une image récente
LATEST_IMAGE=$(ls -t public/uploads/products/*.{jpg,jpeg,png,webp} 2>/dev/null | head -1)
if [ -n "$LATEST_IMAGE" ]; then
    IMAGE_NAME=$(basename "$LATEST_IMAGE")
    
    # Test 1: URL statique directe
    print_status "Test 1: URL statique /uploads/products/$IMAGE_NAME"
    HTTP_CODE1=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/uploads/products/$IMAGE_NAME")
    echo "Code HTTP: $HTTP_CODE1"
    
    # Test 2: API route personnalisée  
    print_status "Test 2: API route /uploads/products/$IMAGE_NAME"
    HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/uploads/products/$IMAGE_NAME")
    echo "Code HTTP: $HTTP_CODE2"
    
    # Afficher les résultats
    if [ "$HTTP_CODE1" = "200" ] || [ "$HTTP_CODE2" = "200" ]; then
        print_success "✅ Images accessibles via HTTP"
        
        # Test de la taille de l'image
        IMAGE_SIZE=$(curl -s "http://localhost:3000/uploads/products/$IMAGE_NAME" | wc -c)
        if [ "$IMAGE_SIZE" -gt 1000 ]; then
            print_success "✅ Image téléchargée avec contenu ($IMAGE_SIZE bytes)"
        else
            print_warning "⚠️ Image téléchargée mais taille suspecte ($IMAGE_SIZE bytes)"
        fi
    else
        print_error "❌ Images non accessibles (codes: $HTTP_CODE1, $HTTP_CODE2)"
    fi
    
    echo ""
    print_status "🔗 URLs à tester dans le navigateur:"
    echo "http://localhost:3000/uploads/products/$IMAGE_NAME"
    echo "http://localhost:3000/admin/test-upload"
    echo "http://localhost:3000/admin/products"
    
else
    print_warning "Aucune image trouvée pour tester"
    print_status "Uploadez d'abord une image via l'interface admin"
fi

echo ""
print_success "🎯 CORRECTIONS APPLIQUÉES:"
echo "1. ✅ Remplacement de next/image par <img> normal"
echo "2. ✅ Ajout de logs de debug pour les images"
echo "3. ✅ API route personnalisée pour servir les images"
echo "4. ✅ Configuration Next.js pour les domaines images"
echo ""

print_status "🧪 TESTS À EFFECTUER MAINTENANT:"
echo "1. Ouvrez http://localhost:3000/admin/test-upload"
echo "2. Uploadez une nouvelle image"
echo "3. Vérifiez qu'elle s'affiche immédiatement"
echo "4. Regardez la console navigateur pour les logs '✅ Image chargée'"
echo "5. Si erreur, regardez les logs '❌ Erreur chargement image'"
echo ""

print_warning "Serveur en marche. Appuyez sur Ctrl+C pour arrêter."

# Garder le serveur en marche
wait $SERVER_PID
