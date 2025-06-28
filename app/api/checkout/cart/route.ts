import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CartService } from '@/lib/services/cart-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { successUrl, cancelUrl } = await request.json()
    
    // Récupérer les articles du panier et calculer le total
    const cartItems = await CartService.getCart(session.user.id)
    const cartTotals = await CartService.getCartTotal(session.user.id)
    
    console.log('Articles du panier:', cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      productName: item.product.name,
      price: item.product.price,
      polarId: item.product.polarId
    })))
    
    console.log('Totaux du panier:', cartTotals)
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 })
    }

    // Créer un produit temporaire sur Polar pour représenter tout le panier
    // Cela permet un paiement unique au lieu de paiements séparés
    const cartProductData = {
      name: `Commande Ceramika - ${cartItems.length} article${cartItems.length > 1 ? 's' : ''}`,
      description: cartItems.map(item => `${item.quantity}x ${item.product.name}`).join(', '),
      recurring_interval: null, // Champ requis mais null pour les produits one-time
      prices: [{
        type: 'one_time',
        amount_type: 'fixed',
        price_amount: Math.round(cartTotals.total * 100), // Polar attend les centimes
        price_currency: 'usd' // Polar n'accepte que USD pour le moment
      }]
    }

    console.log('Création d\'un produit temporaire pour le panier:', {
      ...cartProductData,
      total_eur: cartTotals.total,
      total_usd_cents: Math.round(cartTotals.total * 100)
    })

    // Créer le produit temporaire sur Polar
    const productResponse = await fetch(`${process.env.NEXT_PUBLIC_POLAR_SERVER_URL}/v1/products/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartProductData),
    })

    if (!productResponse.ok) {
      const errorData = await productResponse.text()
      console.error('Erreur création produit temporaire:', productResponse.status, errorData)
      throw new Error(`Erreur création produit temporaire: ${productResponse.status} ${errorData}`)
    }

    const tempProduct = await productResponse.json()
    console.log('Produit temporaire créé:', { id: tempProduct.id, name: tempProduct.name })

    // Utiliser le produit temporaire pour créer le checkout
    const checkoutData = {
      products: [tempProduct.id],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/success?userId=${session.user.id}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
      metadata: {
        user_id: session.user.id,
        cart_items_count: cartItems.length.toString(),
        cart_subtotal: cartTotals.subtotal.toString(),
        cart_tax: cartTotals.tax.toString(),
        cart_shipping: cartTotals.shipping.toString(),
        cart_total: cartTotals.total.toString(),
        temp_product_id: tempProduct.id, // Pour référence historique
        cart_items: JSON.stringify(cartItems.map(item => ({
          productId: item.productId,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          polarId: item.product.polarId
        })))
      }
    }
    
    console.log('Données de checkout avec produit temporaire:', checkoutData)
    console.log('URL utilisée:', `${process.env.NEXT_PUBLIC_POLAR_SERVER_URL}/v1/checkouts/`)
    console.log('Token utilisé:', process.env.POLAR_ACCESS_TOKEN?.substring(0, 20) + '...')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_POLAR_SERVER_URL}/v1/checkouts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erreur API Polar:', response.status, errorData)
      throw new Error(`Erreur API Polar: ${response.status} ${errorData}`)
    }

    const checkout = await response.json()
    console.log('Checkout créé avec succès:', checkout)

    return NextResponse.json({ 
      checkoutUrl: checkout.url,
      checkoutId: checkout.id 
    })
  } catch (error) {
    console.error('Erreur création checkout panier détaillée:', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du checkout',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
