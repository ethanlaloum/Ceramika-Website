// Script de test pour vérifier la connexion à l'API Iabako
const username = process.env.IABAKO_USERNAME || '82bf31c2-89ae-4410-9448-69695c6ff425';
const password = process.env.IABAKO_PASSWORD || '9XEPL5rbDmCBOXgtWI-TtVdRDZzNf9kOHHAaKg';

async function testIabako() {
  console.log('🔄 Test 1: Authentification...');
  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

  const authRes = await fetch('https://api.iabako.com/oauth/token', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': `Basic ${basicAuth}`,
    },
  });

  console.log('  Status:', authRes.status);

  if (!authRes.ok) {
    console.log('  ❌ Échec authentification');
    return;
  }

  const tokens = await authRes.json();
  console.log('  ✅ Authentification réussie !');
  console.log('  Access token:', tokens.access_token?.substring(0, 30) + '...');

  const accessToken = tokens.access_token;

  // Test 2: Créer un produit de test
  console.log('\n🔄 Test 2: Création produit test...');
  const productRes = await fetch('https://api.iabako.com/products', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      externalId: 'test-ceramika-002',
      name: 'Produit Test Ceramika',
      description: 'Test integration',
      stockQuantity: 10,
      priceUnit: 'unit',
      priceAfterTax: 49.99,
      tags: ['ceramika', 'test'],
    }),
  });

  console.log('  Status:', productRes.status);
  if (productRes.ok) {
    const product = await productRes.json();
    console.log('  ✅ Produit créé/récupéré:', JSON.stringify(product, null, 2).substring(0, 200));
  } else {
    const error = await productRes.text();
    console.log('  ❌ Erreur:', error.substring(0, 200));
  }

  // Test 3: Créer un client de test
  console.log('\n🔄 Test 3: Récupération client existant...');
  const customerGetRes = await fetch('https://api.iabako.com/customers/external-id/test-ceramika-customer-001', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${accessToken}`,
    },
  });

  console.log('  Status:', customerGetRes.status);
  if (customerGetRes.ok) {
    const customer = await customerGetRes.json();
    console.log('  ✅ Client trouvé:', JSON.stringify(customer, null, 2).substring(0, 200));
  } else {
    console.log('  Client n\'existe pas, création...');
    const customerRes = await fetch('https://api.iabako.com/customers', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        externalId: 'test-ceramika-customer-001',
        customerType: 'individual',
        firstName: 'Test',
        lastName: 'Ceramika',
        email: 'test@ceramika.com',
        tags: ['ceramika', 'test'],
      }),
    });
    console.log('  Status:', customerRes.status);
    const body = await customerRes.text();
    console.log('  Réponse:', body.substring(0, 200));
  }

  // Test 4: Créer une commande de test
  console.log('\n🔄 Test 4: Création commande test...');
  const orderBody = {
    externalId: 'test-ceramika-order-002',
    orderDate: new Date().toISOString(),
    customer: {
      externalId: 'test-ceramika-customer-001',
      customerType: 'individual',
      firstName: 'Test',
      lastName: 'Ceramika',
    },
    lines: [{
      productExternalId: 'test-ceramika-002',
      productName: 'Produit Test Ceramika',
      quantity: 2,
      unitPriceAfterTax: 49.99,
    }],
    internalNote: 'Test integration Ceramika',
  };
  console.log('  Body envoyé:', JSON.stringify(orderBody, null, 2));
  const orderRes = await fetch('https://api.iabako.com/orders', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderBody),
  });

  console.log('  Status:', orderRes.status);
  if (orderRes.ok) {
    const order = await orderRes.json();
    console.log('  ✅ Commande créée:', JSON.stringify(order, null, 2).substring(0, 200));
  } else {
    const error = await orderRes.text();
    console.log('  ❌ Erreur:', error.substring(0, 200));
  }

  console.log('\n✨ Tests terminés !');
}

testIabako().catch(console.error);
