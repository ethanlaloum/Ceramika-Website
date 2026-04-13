import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CartService } from '@/lib/services/cart-service'
import { StripeCheckoutService } from '@/lib/services/stripe-checkout-service'
import { ORDER_CONFIG, ERROR_MESSAGES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { successUrl, cancelUrl, deliveryMode, shippingAddress } = await request.json()
    
    // Récupérer les articles du panier et calculer le total
    const cartItems = await CartService.getCart(session.user.id)
    const cartTotals = await CartService.getCartTotal(session.user.id)
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 })
    }

    // Vérification du stock pour chaque article
    const productIds = cartItems.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true, inStock: true },
    })

    const stockErrors: string[] = []
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId)
      if (!product || !product.inStock || product.stock <= 0) {
        stockErrors.push(`"${item.product.name}" est en rupture de stock`)
      } else if (item.quantity > product.stock) {
        stockErrors.push(`Stock insuffisant pour "${item.product.name}" (${product.stock} disponible${product.stock > 1 ? 's' : ''})`)
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json({ error: stockErrors.join(', ') }, { status: 400 })
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
      deliveryMode: deliveryMode || 'delivery',
      shippingAddress,
      metadata: {
        user_id: session.user.id,
        source: 'cart_checkout',
        delivery_mode: deliveryMode || 'delivery',
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
