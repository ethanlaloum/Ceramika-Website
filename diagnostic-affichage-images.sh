#!/bin/bash

echo "🖼️ Diagnostic du problème d'affichage des images"
echo "==============================================="

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

# 1. Vérifier les images uploadées
print_status "Vérification des images uploadées..."
UPLOAD_DIR="public/uploads/products"

if [ -d "$UPLOAD_DIR" ]; then
    IMAGE_COUNT=$(ls -1 "$UPLOAD_DIR"/*.{jpg,jpeg,png,webp} 2>/dev/null | wc -l)
    if [ $IMAGE_COUNT -gt 0 ]; then
        print_success "$IMAGE_COUNT images trouvées dans $UPLOAD_DIR"
        echo "Images disponibles:"
        ls -la "$UPLOAD_DIR"/*.{jpg,jpeg,png,webp} 2>/dev/null | head -5
    else
        print_warning "Aucune image trouvée dans $UPLOAD_DIR"
    fi
else
    print_error "Dossier $UPLOAD_DIR non trouvé"
fi

# 2. Tester une image spécifique
print_status "Test d'accès à une image..."
LATEST_IMAGE=$(ls -t "$UPLOAD_DIR"/*.{jpg,jpeg,png,webp} 2>/dev/null | head -1)
if [ -n "$LATEST_IMAGE" ]; then
    IMAGE_NAME=$(basename "$LATEST_IMAGE")
    IMAGE_URL="http://localhost:3000/uploads/products/$IMAGE_NAME"
    print_status "Test de l'URL: $IMAGE_URL"
    
    # Test avec curl
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL" 2>/dev/null || echo "000")
    case $HTTP_CODE in
        200)
            print_success "Image accessible via HTTP (code: $HTTP_CODE)"
            ;;
        404)
            print_error "Image non trouvée via HTTP (code: $HTTP_CODE)"
            print_status "Tentative avec l'API route personnalisée..."
            ;;
        000)
            print_warning "Serveur non accessible (démarrez avec npm run dev)"
            ;;
        *)
            print_warning "Code HTTP inattendu: $HTTP_CODE"
            ;;
    esac
else
    print_warning "Aucune image à tester"
fi

# 3. Vérifier la configuration Next.js
print_status "Vérification de la configuration Next.js..."
if grep -q "remotePatterns" next.config.ts; then
    print_success "Configuration images trouvée dans next.config.ts"
else
    print_warning "Configuration images manquante dans next.config.ts"
fi

# 4. Vérifier l'API route personnalisée
API_ROUTE="app/uploads/products/[...path]/route.ts"
if [ -f "$API_ROUTE" ]; then
    print_success "API route personnalisée créée: $API_ROUTE"
else
    print_warning "API route personnalisée manquante: $API_ROUTE"
fi

echo ""
print_status "🎯 SOLUTIONS POSSIBLES POUR L'AFFICHAGE:"
echo ""

echo "1. 🔧 PROBLÈME DE SERVEUR STATIQUE"
echo "   Si code HTTP = 404:"
echo "   → Le serveur Next.js ne sert pas les fichiers du dossier uploads"
echo "   → Solution: API route personnalisée créée"

echo "2. 🖼️ PROBLÈME NEXT/IMAGE"
echo "   Si images présentes mais non affichées:"
echo "   → next/image strict sur les domaines"
echo "   → Solution: Remplacement par <img> normal"

echo "3. 🔗 PROBLÈME D'URL"
echo "   Si URLs incorrectes:"
echo "   → Vérifier que l'URL commence par /uploads/products/"
echo "   → Solution: Debug des URLs dans le composant"

echo "4. 🚫 PROBLÈME DE CACHE"
echo "   Si anciennes versions affichées:"
echo "   → Vider le cache navigateur (Ctrl+Shift+R)"
echo "   → Solution: Redémarrer le serveur"

echo ""
print_status "🧪 TESTS À EFFECTUER:"
echo "1. Démarrez le serveur: npm run dev"
echo "2. Allez sur l'admin et uploadez une image"
echo "3. Vérifiez la console navigateur pour les logs d'images"
echo "4. Testez l'URL directe d'une image dans le navigateur"
echo "5. Inspectez l'élément image avec F12"

echo ""
if [ -n "$LATEST_IMAGE" ]; then
    print_status "🔗 URL de test rapide:"
    echo "http://localhost:3000/uploads/products/$(basename "$LATEST_IMAGE")"
fi
