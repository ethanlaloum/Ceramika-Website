#!/bin/bash

echo "🔧 Debug Upload API"
echo "==================="

echo "1. Vérification du fichier API d'upload..."
if [ -f "app/api/admin/upload/route.ts" ]; then
    echo "✅ Fichier API trouvé"
    echo "📋 Première lignes:"
    head -10 app/api/admin/upload/route.ts
else
    echo "❌ Fichier API non trouvé"
fi

echo ""
echo "2. Vérification des imports Vercel Blob..."
grep -n "import.*@vercel/blob" app/api/admin/upload/route.ts || echo "❌ Import Vercel Blob non trouvé"

echo ""
echo "3. Vérification des appels mkdir (ne devrait pas exister)..."
grep -n "mkdir" app/api/admin/upload/route.ts && echo "❌ Appel mkdir trouvé (problème!)" || echo "✅ Aucun appel mkdir"

echo ""
echo "4. Vérification des appels writeFile (ne devrait pas exister)..."
grep -n "writeFile" app/api/admin/upload/route.ts && echo "❌ Appel writeFile trouvé (problème!)" || echo "✅ Aucun appel writeFile"

echo ""
echo "5. Vérification des appels put (Vercel Blob)..."
grep -n "put(" app/api/admin/upload/route.ts && echo "✅ Appel put trouvé (correct)" || echo "❌ Appel put non trouvé"

echo ""
echo "6. Vérification du cache Next.js..."
if [ -d ".next" ]; then
    echo "⚠️ Cache Next.js existe - peut contenir l'ancienne version"
    echo "💡 Solution: rm -rf .next && npm run dev"
else
    echo "✅ Pas de cache Next.js"
fi

echo ""
echo "🏁 Debug terminé"
