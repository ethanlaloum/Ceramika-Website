// Script de debug pour tester l'API de création de commande
// À exécuter dans la console du navigateur sur la page de succès

console.log('🔍 Debug de l\'API de création de commande');

// 1. Afficher tous les paramètres URL
const urlParams = new URLSearchParams(window.location.search);
console.log('📋 Paramètres URL actuels:', Object.fromEntries(urlParams.entries()));

// 2. Tester différents noms de paramètres
const possibleCheckoutParams = [
  'checkout_session_id',
  'session_id', 
  'checkout_id',
  'payment_intent_id',
  'cs_',
  'pi_'
];

possibleCheckoutParams.forEach(param => {
  const value = urlParams.get(param);
  if (value) {
    console.log(`✅ Paramètre trouvé: ${param} = ${value}`);
  }
});

// 3. Fonction pour tester l'API manuellement
async function testCreateOrderAPI(checkoutId = null) {
  console.log('🧪 Test de l\'API de création de commande...');
  
  const testCheckoutId = checkoutId || urlParams.get('checkout_session_id') || urlParams.get('session_id') || 'test-checkout-id';
  
  try {
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        checkoutSessionId: testCheckoutId,
        polarCustomerSessionToken: urlParams.get('customer_session_token')
      })
    });
    
    const data = await response.json();
    console.log('📤 Réponse de l\'API:', {
      status: response.status,
      ok: response.ok,
      data
    });
    
    return data;
  } catch (error) {
    console.error('❌ Erreur lors du test API:', error);
    return null;
  }
}

// 4. Exécuter le test automatiquement
console.log('▶️ Exécution du test...');
testCreateOrderAPI();

// 5. Fonction helper pour test manuel
window.debugCreateOrder = testCreateOrderAPI;
