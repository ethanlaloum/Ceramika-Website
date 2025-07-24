#!/bin/bash

echo "🧪 Test de l'upload avec Vercel Blob Storage"
echo "============================================"

# Variables
API_URL="http://localhost:3000/api/admin/upload"
TEST_IMAGE="test-upload.jpg"

# Créer une image de test simple
echo "📝 Création d'une image de test..."
# Utilise ImageMagick pour créer une image de test (si disponible)
if command -v convert &> /dev/null; then
    convert -size 100x100 xc:blue "$TEST_IMAGE"
    echo "✅ Image de test créée: $TEST_IMAGE"
else
    echo "⚠️ ImageMagick non disponible, utilisation d'un fichier existant ou création manuelle nécessaire"
    # Créer un fichier image factice pour le test
    echo -e "\xFF\xD8\xFF\xE0\x00\x10JFIF" > "$TEST_IMAGE"
    echo "📝 Fichier de test basique créé"
fi

echo ""
echo "🚀 Test de l'upload vers Vercel Blob Storage..."
echo "URL: $API_URL"

# Test de l'upload
response=$(curl -s -w "\n%{http_code}" -X POST \
  -F "file=@$TEST_IMAGE" \
  "$API_URL")

# Séparer le body et le status code
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)

echo ""
echo "📊 Résultats du test:"
echo "Status Code: $http_code"
echo "Response Body:"
echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"

echo ""
if [ "$http_code" = "200" ]; then
    echo "✅ Upload réussi avec Vercel Blob Storage!"
    
    # Extraire l'URL de l'image
    image_url=$(echo "$response_body" | jq -r '.url' 2>/dev/null)
    if [ "$image_url" != "null" ] && [ "$image_url" != "" ]; then
        echo "🔗 URL de l'image: $image_url"
        
        # Tester l'accès à l'image
        echo ""
        echo "🌐 Test d'accès à l'image..."
        image_status=$(curl -s -w "%{http_code}" -o /dev/null "$image_url")
        if [ "$image_status" = "200" ]; then
            echo "✅ Image accessible publiquement!"
        else
            echo "❌ Image non accessible (Status: $image_status)"
        fi
    fi
elif [ "$http_code" = "401" ]; then
    echo "❌ Erreur d'authentification - Session expirée ou manquante"
elif [ "$http_code" = "403" ]; then
    echo "❌ Erreur de permissions - Accès administrateur requis"
elif [ "$http_code" = "500" ]; then
    echo "❌ Erreur serveur - Vérifier les logs et la configuration"
    
    # Analyser l'erreur
    error_code=$(echo "$response_body" | jq -r '.code' 2>/dev/null)
    if [ "$error_code" = "BLOB_UPLOAD_ERROR" ]; then
        echo "🔍 Erreur Vercel Blob Storage détectée"
        echo "💡 Vérifiez la variable BLOB_READ_WRITE_TOKEN"
    fi
else
    echo "❌ Erreur inattendue (Status: $http_code)"
fi

# Nettoyage
echo ""
echo "🧹 Nettoyage..."
rm -f "$TEST_IMAGE"
echo "✅ Fichier de test supprimé"

echo ""
echo "📋 Checklist post-test:"
echo "□ Variable BLOB_READ_WRITE_TOKEN configurée dans Vercel"
echo "□ Package @vercel/blob installé"
echo "□ Upload API migrée vers Vercel Blob"
echo "□ Images servies depuis Vercel Blob Storage"
echo "□ Front-end adapté pour les URLs Vercel Blob"
