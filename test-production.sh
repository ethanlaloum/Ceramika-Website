#!/bin/bash

echo "🏭 Test de l'upload en mode PRODUCTION"
echo "===================================="

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

# 1. Nettoyer les builds précédents
print_status "Nettoyage des builds précédents..."
rm -rf .next
rm -rf out

# 2. Créer le dossier d'upload avant le build
print_status "Préparation du dossier d'upload..."
mkdir -p public/uploads/products
echo "test" > public/uploads/products/.gitkeep

# 3. Build en mode production
print_status "Build en mode production..."
if npm run build; then
    print_success "Build réussi"
else
    print_error "Erreur lors du build"
    exit 1
fi

# 4. Vérifier que le dossier existe après le build
print_status "Vérification du dossier après build..."
if [ -d "public/uploads/products" ]; then
    print_success "Dossier d'upload présent après build"
else
    print_warning "Dossier d'upload manquant après build, recréation..."
    mkdir -p public/uploads/products
fi

# 5. Test des permissions
print_status "Test des permissions en mode production..."
if echo "test permissions production" > "public/uploads/products/test-prod.txt" 2>/dev/null; then
    rm "public/uploads/products/test-prod.txt"
    print_success "Permissions d'écriture OK en production"
else
    print_error "Problème de permissions en production"
    ls -la public/uploads/
fi

# 6. Démarrage en mode production
print_status "Démarrage du serveur en mode PRODUCTION..."
print_warning "Le serveur va démarrer en mode production sur http://localhost:3000"
print_warning "Ce mode utilise les optimisations de production et peut se comporter différemment"

echo ""
echo "🔍 DIFFÉRENCES EN MODE PRODUCTION :"
echo "- Optimisations JavaScript et CSS"
echo "- Pas de hot reload"
echo "- Cache plus agressif"
echo "- Variables d'environnement de production"
echo "- Gestion des erreurs différente"
echo ""
echo "🎯 TESTS À EFFECTUER :"
echo "1. Connectez-vous en tant qu'admin"
echo "2. Allez sur http://localhost:3000/admin/test-upload"
echo "3. Testez l'authentification puis l'upload"
echo "4. Surveillez la console pour les logs spécifiques à la production"
echo "5. Vérifiez les onglets Network et Console du navigateur"
echo ""
echo "🛑 Appuyez sur Ctrl+C pour arrêter"
echo ""

# Capture des signaux pour un arrêt propre
trap 'echo ""; print_status "Arrêt du serveur de production..."; exit 0' INT TERM

# Démarrage en mode production
NODE_ENV=production npm start
