import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { StripeCheckoutService } from '@/lib/services/stripe-checkout-service'
import { ORDER_CONFIG, ERROR_MESSAGES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    const { productId, quantity = 1, successUrl, cancelUrl } = await request.json()

    // Récupérer le produit depuis la base de données
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        artist: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Vérification du montant minimum
    const total = product.price * quantity + (quantity * 0.40) // prix + frais de livraison
    if (total < ORDER_CONFIG.MINIMUM_AMOUNT) {
      return NextResponse.json({ 
        error: ERROR_MESSAGES.MINIMUM_ORDER_PRODUCT(product.price, ORDER_CONFIG.MINIMUM_AMOUNT)
      }, { status: 400 })
    }

    // Créer un article de panier temporaire pour le checkout
    const cartItem = {
      id: 'temp',
      userId: session?.user?.id || 'guest',
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        artist: {
          name: product.artist.name,
        },
      },
    }

    // Créer la session Stripe Checkout
    const checkoutResult = await StripeCheckoutService.createCheckoutSession({
      items: [cartItem],
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
      customerEmail: session?.user?.email || undefined,
      metadata: {
        user_id: session?.user?.id || 'guest',
        source: 'direct_product_purchase',
        product_id: productId,
      },
    })

    return NextResponse.json({ 
      url: checkoutResult.url,
      sessionId: checkoutResult.sessionId,
    })
  } catch (error) {
    console.error('Erreur création checkout produit Stripe:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du checkout',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
