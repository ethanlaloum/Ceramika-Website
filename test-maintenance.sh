#!/bin/bash

# 🧪 Script de test du système de maintenance

echo "🧪 TEST DU SYSTÈME DE MAINTENANCE"
echo "================================"
echo ""

echo "1️⃣ Activation manuelle du cache de maintenance..."
curl -X GET "http://localhost:3000/api/maintenance/init"
echo ""
echo ""

echo "2️⃣ Vérification de l'état de maintenance..."
curl -X GET "http://localhost:3000/api/maintenance/status"
echo ""
echo ""

echo "3️⃣ Test d'accès à la page d'accueil..."
echo "Réponse HTTP pour '/':"
curl -I "http://localhost:3000/" 2>/dev/null | head -1
echo ""

echo "4️⃣ Test d'accès aux produits..."
echo "Réponse HTTP pour '/products':"
curl -I "http://localhost:3000/products" 2>/dev/null | head -1
echo ""

echo "5️⃣ Test d'accès à la page de maintenance..."
echo "Réponse HTTP pour '/maintenance':"
curl -I "http://localhost:3000/maintenance" 2>/dev/null | head -1
echo ""

echo "6️⃣ Test d'accès à l'admin login..."
echo "Réponse HTTP pour '/admin/login':"
curl -I "http://localhost:3000/admin/login" 2>/dev/null | head -1
echo ""

echo "✅ Tests terminés!"
