#!/bin/bash

echo "🔍 Diagnostic avancé des problèmes d'upload d'images"
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

# 1. Vérification du dossier d'upload
print_status "Vérification du dossier d'upload..."
UPLOAD_DIR="public/uploads/products"

if [ ! -d "$UPLOAD_DIR" ]; then
    print_warning "Dossier d'upload manquant, création..."
    mkdir -p "$UPLOAD_DIR"
    echo "test" > "$UPLOAD_DIR/.gitkeep"
fi

# Test des permissions
if echo "test permissions" > "$UPLOAD_DIR/test-permissions.txt" 2>/dev/null; then
    rm "$UPLOAD_DIR/test-permissions.txt"
    print_success "Permissions d'écriture OK sur $UPLOAD_DIR"
else
    print_error "Permissions d'écriture manquantes sur $UPLOAD_DIR"
    ls -la "$UPLOAD_DIR/.."
fi

# 2. Vérification des fichiers de l'API
print_status "Vérification des fichiers de l'API..."

API_FILE="app/api/admin/upload/route.ts"
if [ -f "$API_FILE" ]; then
    print_success "API d'upload trouvée: $API_FILE"
else
    print_error "API d'upload manquante: $API_FILE"
fi

# 3. Vérification du composant d'upload
COMPONENT_FILE="components/admin/products/image-upload.tsx"
if [ -f "$COMPONENT_FILE" ]; then
    print_success "Composant d'upload trouvé: $COMPONENT_FILE"
else
    print_error "Composant d'upload manquant: $COMPONENT_FILE"
fi

# 4. Vérification de la compilation TypeScript
print_status "Vérification de la compilation TypeScript..."
if npx tsc --noEmit --project . > /dev/null 2>&1; then
    print_success "Pas d'erreurs TypeScript"
else
    print_warning "Erreurs TypeScript détectées:"
    npx tsc --noEmit --project .
fi

# 5. Test de build
print_status "Test de build Next.js..."
if npm run build > build.log 2>&1; then
    print_success "Build réussi"
    rm build.log
else
    print_error "Erreurs de build détectées:"
    tail -20 build.log
    rm build.log
fi

# 6. Vérification de l'espace disque
print_status "Espace disque disponible:"
df -h . | tail -n 1

# 7. Vérification des dépendances
print_status "Vérification des dépendances critiques..."

REQUIRED_DEPS=("next" "react" "@radix-ui/react-toast" "lucide-react")
for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        print_success "Dépendance trouvée: $dep"
    else
        print_warning "Dépendance manquante: $dep"
    fi
done

echo ""
print_status "🎯 Prochaines étapes recommandées:"
echo "1. Démarrez le serveur avec: ./test-serveur.sh"
echo "2. Allez sur http://localhost:3000/admin/test-upload"
echo "3. Testez l'upload d'une image"
echo "4. Surveillez les logs dans la console du serveur et du navigateur"
echo ""
print_status "Si des erreurs persistent, vérifiez:"
echo "- Que vous êtes connecté en tant qu'admin"
echo "- La console du navigateur (F12 > Console)"
echo "- L'onglet Network pour voir les requêtes HTTP"
echo "- Les logs de ce terminal après démarrage du serveur"
