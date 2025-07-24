#!/bin/bash

# 🔍 DIAGNOSTIC UPLOAD D'IMAGES
echo "🔍 DIAGNOSTIC UPLOAD D'IMAGES"
echo "============================="

# Vérifier les permissions du dossier
echo "📁 Vérification des permissions..."
UPLOAD_DIR="public/uploads/products"

if [ -d "$UPLOAD_DIR" ]; then
    echo "✅ Dossier $UPLOAD_DIR existe"
    echo "   Permissions: $(ls -ld $UPLOAD_DIR)"
    echo "   Propriétaire: $(ls -ld $UPLOAD_DIR | awk '{print $3":"$4}')"
else
    echo "❌ Dossier $UPLOAD_DIR n'existe pas"
    echo "📁 Création du dossier..."
    mkdir -p "$UPLOAD_DIR"
    echo "✅ Dossier créé"
fi

# Test d'écriture
echo ""
echo "📝 Test d'écriture dans le dossier..."
TEST_FILE="$UPLOAD_DIR/test-write.txt"
if echo "test" > "$TEST_FILE" 2>/dev/null; then
    echo "✅ Écriture possible"
    rm -f "$TEST_FILE"
else
    echo "❌ Écriture impossible - problème de permissions"
    echo "🔧 Solution: Vérifiez les permissions du dossier"
fi

# Vérifier l'espace disque
echo ""
echo "💾 Vérification de l'espace disque..."
df -h . | head -2

# Vérifier les logs Next.js
echo ""
echo "📋 Recherche des erreurs récentes dans les logs..."
if [ -f ".next/server.log" ]; then
    echo "Dernières erreurs trouvées:"
    tail -20 .next/server.log | grep -i error || echo "Aucune erreur récente trouvée"
else
    echo "Fichier de log non trouvé (.next/server.log)"
fi

# Test de l'API
echo ""
echo "🌐 Test de connectivité vers l'API..."
if command -v curl >/dev/null 2>&1; then
    echo "Test GET sur /api/admin/upload (devrait retourner 405 Method Not Allowed):"
    curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/api/admin/upload || echo "❌ Serveur non accessible"
else
    echo "⚠️ curl non disponible - impossible de tester l'API"
fi

# Vérifier les modules Node.js
echo ""
echo "📦 Vérification des modules critiques..."
node -e "
try {
    require('fs/promises');
    console.log('✅ fs/promises disponible');
    require('path');
    console.log('✅ path disponible');
    require('fs');
    console.log('✅ fs disponible');
} catch(e) {
    console.log('❌ Module manquant:', e.message);
}
" 2>/dev/null || echo "❌ Erreur lors de la vérification des modules"

echo ""
echo "🎯 CONSEILS DE DÉPANNAGE:"
echo "========================"
echo "1. Vérifiez que le serveur Next.js fonctionne (npm run dev)"
echo "2. Ouvrez les DevTools (F12) → Console pour voir les erreurs détaillées"
echo "3. Vérifiez les logs serveur dans votre terminal"
echo "4. Essayez avec un fichier image plus petit (< 1MB)"
echo "5. Vérifiez que vous êtes connecté en tant qu'admin"

echo ""
echo "📞 Si le problème persiste:"
echo "- Partagez les logs de la console navigateur"
echo "- Partagez les logs du serveur Next.js"
echo "- Indiquez le type et la taille du fichier testé"
