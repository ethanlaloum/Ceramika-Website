import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('products')
    const customerEmail = searchParams.get('customerEmail')
    const customerName = searchParams.get('customerName')
    
    // Extraire les métadonnées
    const cartTotal = searchParams.get('metadata[cartTotal]')
    const itemCount = searchParams.get('metadata[itemCount]')
    const cartId = searchParams.get('metadata[cartId]')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    console.log('🛒 Tentative de checkout:', {
      productId,
      customerEmail,
      customerName,
      cartTotal,
      itemCount,
      cartId
    })

    // Configuration Polar
    const polarAccessToken = process.env.POLAR_ACCESS_TOKEN
    const polarServerUrl = process.env.NEXT_PUBLIC_POLAR_SERVER_URL || 'https://api.polar.sh'
    const successUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/success`
    const cancelUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`

    if (!polarAccessToken) {
      throw new Error('POLAR_ACCESS_TOKEN manquant')
    }

    // Données pour créer le checkout Polar
    const checkoutData = {
      product_id: productId,
      success_url: successUrl + `?customer_session_token={CHECKOUT_CUSTOMER_SESSION_TOKEN}`,
      cancel_url: cancelUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(customerName && { customer_name: customerName }),
      metadata: {
        ...(cartTotal && { cartTotal }),
        ...(itemCount && { itemCount }),  
        ...(cartId && { cartId })
      }
    }

    console.log('📤 Données envoyées à Polar:', checkoutData)

    // Appel à l'API Polar pour créer le checkout
    const response = await fetch(`${polarServerUrl}/v1/checkouts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData)
    })

    console.log('📥 Réponse Polar status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur Polar:', errorText)
      throw new Error(`Polar API error: ${response.status} ${errorText}`)
    }

    const checkout = await response.json()
    console.log('✅ Checkout créé:', checkout.id)

    // Rediriger vers l'URL de checkout Polar
    return NextResponse.redirect(checkout.url)

  } catch (error) {
    console.error('❌ Erreur checkout:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du checkout' },
      { status: 500 }
    )
  }
}
