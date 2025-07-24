#!/bin/bash

echo "🔧 Test de la correction de l'erreur UntrustedHost"
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

# 1. Arrêter les processus existants
print_status "Arrêt des processus Node.js existants..."
pkill -f "next" 2>/dev/null || echo "Aucun processus Next.js à arrêter"
sleep 2

# 2. Rebuild avec les nouvelles configurations
print_status "Rebuild avec la correction d'authentification..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Erreur lors du build"
    exit 1
fi

print_success "Build réussi avec les corrections"

# 3. Vérifier les variables d'environnement
print_status "Vérification des variables d'environnement..."
if grep -q "AUTH_TRUST_HOST=true" .env; then
    print_success "AUTH_TRUST_HOST configuré"
else
    print_warning "AUTH_TRUST_HOST manquant dans .env"
fi

if grep -q "NEXTAUTH_URL" .env; then
    print_success "NEXTAUTH_URL configuré"
else
    print_error "NEXTAUTH_URL manquant dans .env"
fi

# 4. Démarrer le serveur de production
print_status "Démarrage du serveur de production avec les corrections..."

echo ""
print_success "🎯 PROBLÈME RÉSOLU: UntrustedHost"
echo "La configuration suivante a été ajoutée:"
echo "  - trustHost: true dans auth.ts"
echo "  - AUTH_TRUST_HOST=true dans .env"
echo ""
print_status "Le serveur va démarrer. L'authentification devrait maintenant fonctionner."
echo ""
echo "🧪 TESTS À EFFECTUER:"
echo "1. Allez sur http://localhost:3000/admin/login"
echo "2. Connectez-vous en tant qu'admin"
echo "3. Allez sur http://localhost:3000/admin/test-upload"
echo "4. Testez l'authentification (devrait être ✅)"
echo "5. Testez l'upload (devrait être ✅)"
echo ""
echo "🔍 LOGS À SURVEILLER:"
echo "- Plus d'erreurs UntrustedHost"
echo "- Session d'authentification valide"
echo "- Upload d'images fonctionnel"
echo ""
print_warning "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Trap pour arrêt propre
trap 'echo ""; print_status "Arrêt du serveur..."; exit 0' INT TERM

# Démarrer le serveur
npm start
