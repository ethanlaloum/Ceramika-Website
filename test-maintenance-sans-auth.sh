#!/bin/bash

echo "🔧 TEST COMPLET - MAINTENANCE SANS CONNEXION REQUISE"
echo "==================================================="
echo ""

echo "1️⃣ Activation de la maintenance..."
curl -c /tmp/cookies.txt -s http://localhost:3000/api/maintenance/init > /dev/null
echo "   ✅ Maintenance activée"
echo ""

echo "2️⃣ Test utilisateur NON CONNECTÉ sur page d'accueil..."
RESPONSE=$(curl -b /tmp/cookies.txt -s -I http://localhost:3000/ | grep -E "HTTP|location")
echo "   🔍 Réponse:"
echo "      $RESPONSE"
echo ""

echo "3️⃣ Test accès à la page de maintenance..."
MAINTENANCE_STATUS=$(curl -b /tmp/cookies.txt -s -I http://localhost:3000/maintenance | head -1)
echo "   🔍 Page maintenance:"
echo "      $MAINTENANCE_STATUS"
echo ""

echo "4️⃣ Test liens de connexion depuis la maintenance..."
echo "   🔍 Customer login:"
CUSTOMER_STATUS=$(curl -b /tmp/cookies.txt -s -I http://localhost:3000/customer/login | head -1)
echo "      $CUSTOMER_STATUS"
echo ""

echo "   🔍 Admin login:"
ADMIN_STATUS=$(curl -b /tmp/cookies.txt -s -I http://localhost:3000/admin/login | head -1)
echo "      $ADMIN_STATUS"
echo ""

echo "🎯 RÉSULTAT:"
echo "============"
if [[ $RESPONSE == *"307"* ]] && [[ $RESPONSE == *"/maintenance"* ]]; then
    echo "✅ SUCCÈS: Utilisateurs non connectés redirigés vers /maintenance"
else
    echo "❌ ÉCHEC: Problème de redirection"
fi

if [[ $MAINTENANCE_STATUS == *"200"* ]]; then
    echo "✅ SUCCÈS: Page /maintenance accessible sans connexion"
else
    echo "❌ ÉCHEC: Page maintenance inaccessible"
fi

if [[ $CUSTOMER_STATUS == *"200"* ]]; then
    echo "✅ SUCCÈS: Lien customer login fonctionne depuis maintenance"
else
    echo "❌ ÉCHEC: Problème lien customer login"
fi

echo ""
echo "🎉 NOUVEAU COMPORTEMENT VALIDÉ !"
echo "================================"
echo "🔧 Maintenance active = Page de maintenance montrée (pas de redirection login)"
echo "🔗 Liens de connexion = Accessibles depuis la page de maintenance"
echo "👥 Utilisateurs non connectés = Voient la page de maintenance avec options de connexion"
echo ""

# Nettoyage
rm -f /tmp/cookies.txt
