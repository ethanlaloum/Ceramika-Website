import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CartService } from '@/lib/services/cart-service'
import { ORDER_CONFIG, ERROR_MESSAGES, PAYMENT_CONFIG, PRICE_UTILS } from '@/lib/constants'

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
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 })
    }

    // Vérification du montant minimum
    if (cartTotals.total < ORDER_CONFIG.MINIMUM_AMOUNT) {
      return NextResponse.json({ 
        error: ERROR_MESSAGES.MINIMUM_ORDER(cartTotals.total, ORDER_CONFIG.MINIMUM_AMOUNT)
      }, { status: 400 })
    }

    // Créer un produit temporaire sur Polar pour représenter tout le panier
    // Note: Polar force l'utilisation d'USD même en production, donc on convertit EUR → USD
    // Le client voit les prix en euros, mais Polar traite en USD en arrière-plan
    const cartProductData = {
      name: `Commande Ceramika - ${cartItems.length} article${cartItems.length > 1 ? 's' : ''}`,
      description: cartItems.map(item => `${item.quantity}x ${item.product.name}`).join(', '),
      recurring_interval: null, // Champ requis mais null pour les produits one-time
      prices: [{
        type: 'one_time',
        amount_type: 'fixed',
        price_amount: PRICE_UTILS.euroToPolarCents(cartTotals.total), // EUR → USD centimes
        price_currency: PAYMENT_CONFIG.POLAR_CURRENCY // Force 'usd' par Polar
      }]
    }

    // Informations du checkout avec conversion EUR → USD
    const cartCheckoutInfo = {
      ...cartProductData,
      total_eur: cartTotals.total,
      total_usd: PRICE_UTILS.euroToUsd(cartTotals.total),
      total_usd_cents: PRICE_UTILS.euroToPolarCents(cartTotals.total),
    }

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
      throw new Error(`Erreur création produit temporaire: ${productResponse.status} ${errorData}`)
    }

    const tempProduct = await productResponse.json()

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
      throw new Error(`Erreur API Polar: ${response.status} ${errorData}`)
    }

    const checkout = await response.json()

    return NextResponse.json({ 
      checkoutUrl: checkout.url,
      checkoutId: checkout.id 
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du checkout',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
