import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CartService } from '@/lib/services/cart-service'
import { StripeCheckoutService } from '@/lib/services/stripe-checkout-service'
import { ORDER_CONFIG, ERROR_MESSAGES } from '@/lib/constants'

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

    // Créer la session Stripe Checkout
    const checkoutResult = await StripeCheckoutService.createCheckoutSession({
      items: cartItems,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
      customerEmail: session.user.email || undefined,
      metadata: {
        user_id: session.user.id,
        source: 'cart_checkout',
      },
    })

    return NextResponse.json({ 
      url: checkoutResult.url,
      sessionId: checkoutResult.sessionId,
    })
  } catch (error) {
    console.error('Erreur création checkout Stripe:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du checkout',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
