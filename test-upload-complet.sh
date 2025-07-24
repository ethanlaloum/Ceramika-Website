#!/bin/bash

echo "🚀 Test complet du système d'upload d'images"
echo "=============================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Vérification des dépendances
print_status "Vérification des dépendances..."

if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

print_success "Node.js $(node --version) et npm $(npm --version) sont installés"

# 2. Vérification du projet
print_status "Vérification du projet..."

if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    print_warning "node_modules non trouvé, installation des dépendances..."
    npm install
fi

print_success "Projet vérifié"

# 3. Vérification des permissions sur le dossier d'upload
print_status "Vérification des permissions du dossier d'upload..."

UPLOAD_DIR="public/uploads/products"
if [ ! -d "$UPLOAD_DIR" ]; then
    print_warning "Dossier d'upload non trouvé, création..."
    mkdir -p "$UPLOAD_DIR"
fi

# Test d'écriture
TEST_FILE="$UPLOAD_DIR/test-permissions.txt"
if echo "test" > "$TEST_FILE" 2>/dev/null; then
    rm "$TEST_FILE"
    print_success "Permissions d'écriture OK sur $UPLOAD_DIR"
else
    print_error "Pas de permissions d'écriture sur $UPLOAD_DIR"
    exit 1
fi

# 4. Vérification de l'espace disque
print_status "Vérification de l'espace disque..."
df -h . | tail -n 1 | awk '{print $4 " disponible"}'

# 5. Test de compilation
print_status "Test de compilation TypeScript..."
if npm run build > /dev/null 2>&1; then
    print_success "Compilation réussie"
else
    print_error "Erreur de compilation"
    print_status "Tentative de compilation avec détails..."
    npm run build
    exit 1
fi

# 6. Démarrage du serveur de développement
print_status "Démarrage du serveur Next.js..."
print_warning "Le serveur va démarrer sur http://localhost:3000"
print_warning "Pour tester l'upload, allez sur /admin/products et ajoutez un produit"
print_warning "Appuyez sur Ctrl+C pour arrêter le serveur"

echo ""
echo "🔧 Instructions de test :"
echo "1. Ouvrez http://localhost:3000 dans votre navigateur"
echo "2. Connectez-vous en tant qu'admin"
echo "3. Allez sur /admin/products"
echo "4. Cliquez sur 'Ajouter un produit'"
echo "5. Testez l'upload d'une image"
echo "6. Surveillez la console de ce terminal pour les logs"
echo ""

# Capture des signaux pour un arrêt propre
trap 'echo ""; print_status "Arrêt du serveur..."; exit 0' INT TERM

# Démarrage avec logs détaillés
npm run dev
