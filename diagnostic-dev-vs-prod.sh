#!/bin/bash

echo "🔬 Comparaison Développement vs Production pour l'upload"
echo "====================================================="

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

echo "📊 DIAGNOSTIC COMPLET DES DIFFÉRENCES"
echo ""

# 1. Variables d'environnement
print_status "1. Variables d'environnement"
echo "NODE_ENV actuel: ${NODE_ENV:-'non défini'}"
echo "Next.js détecte automatiquement le mode selon la commande utilisée:"
echo "  - npm run dev → development"
echo "  - npm run build + npm start → production"

# 2. Structure des dossiers
print_status "2. Structure des dossiers"
echo "Dossier public/uploads/products:"
if [ -d "public/uploads/products" ]; then
    print_success "Existe"
    echo "Contenu:"
    ls -la public/uploads/products/ 2>/dev/null || echo "  Vide ou permissions insuffisantes"
else
    print_error "Manquant"
fi

# 3. Permissions
print_status "3. Test des permissions"
TEST_FILE="public/uploads/products/test-permissions-$(date +%s).txt"
if echo "test" > "$TEST_FILE" 2>/dev/null; then
    rm "$TEST_FILE"
    print_success "Permissions d'écriture OK"
else
    print_error "Pas de permissions d'écriture"
    echo "Permissions du dossier parent:"
    ls -la public/uploads/ 2>/dev/null || ls -la public/ 2>/dev/null
fi

# 4. Taille des fichiers de build
print_status "4. Taille des fichiers de build"
if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    print_success "Build existe: $BUILD_SIZE"
else
    print_warning "Pas de build (.next manquant)"
fi

# 5. Configuration Next.js
print_status "5. Configuration Next.js"
if [ -f "next.config.ts" ]; then
    print_success "Configuration trouvée"
    echo "Contenu pertinent pour les uploads:"
    grep -A 5 -B 5 "images\|upload\|body\|size" next.config.ts 2>/dev/null || echo "  Aucune configuration d'upload spécifique"
else
    print_warning "Pas de next.config.ts"
fi

# 6. API Routes
print_status "6. Vérification de l'API d'upload"
API_FILE="app/api/admin/upload/route.ts"
if [ -f "$API_FILE" ]; then
    print_success "API d'upload existe"
    echo "Configuration runtime:"
    grep -n "export const" "$API_FILE" 2>/dev/null || echo "  Aucune configuration runtime spécifique"
else
    print_error "API d'upload manquante"
fi

# 7. Dépendances critiques
print_status "7. Dépendances critiques pour l'upload"
CRITICAL_DEPS=("next" "@radix-ui/react-toast" "lucide-react")
for dep in "${CRITICAL_DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        VERSION=$(npm list "$dep" 2>/dev/null | grep "$dep@" | head -1 | cut -d@ -f2)
        print_success "$dep@$VERSION"
    else
        print_error "$dep manquant"
    fi
done

echo ""
echo "🎯 SOLUTIONS COMMUNES POUR LES PROBLÈMES PROD vs DEV:"
echo ""
print_status "Si l'upload fonctionne en dev mais pas en prod:"

echo "1. 📁 DOSSIERS MANQUANTS EN PRODUCTION"
echo "   Solution: mkdir -p public/uploads/products avant npm run build"

echo "2. 🚫 PERMISSIONS DIFFÉRENTES"
echo "   Solution: chmod 755 public/uploads/products"

echo "3. 🐛 VARIABLES D'ENVIRONNEMENT"
echo "   Solution: Vérifier que toutes les variables sont définies en production"

echo "4. 📏 LIMITES DE TAILLE"
echo "   Solution: Ajouter la configuration dans next.config.ts"

echo "5. 🔄 CACHE AGRESSIF"
echo "   Solution: Vider le cache navigateur (Ctrl+Shift+R)"

echo "6. 🛠️ RUNTIME DIFFÉRENT"
echo "   Solution: Ajouter 'export const runtime = \"nodejs\"' dans route.ts"

echo ""
echo "🧪 POUR TESTER MAINTENANT:"
echo "1. Mode développement: ./test-serveur.sh"
echo "2. Mode production: ./test-production.sh"
echo "3. Comparaison directe: tester les deux modes et comparer les logs"
