import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CartService } from '@/lib/services/cart-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    
    const { checkoutSessionId, stripeSessionId } = body

    // Accepter même un ID temporaire pour permettre la création de commande
    if (!checkoutSessionId) {
      return NextResponse.json({ error: "ID de checkout manquant" }, { status: 400 })
    }

    // Si l'ID commence par "temp-", c'est un ID temporaire que nous avons généré
    const isTemporaryId = checkoutSessionId.startsWith('temp-')
    if (isTemporaryId) {
    }

    // Récupérer les articles du panier avant de le vider
    const cartItems = await CartService.getCart(session.user.id)
    const cartTotals = await CartService.getCartTotal(session.user.id)


    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 })
    }

    // Créer la commande en transaction pour garantir la cohérence
    const order = await prisma.$transaction(async (tx) => {
      // 1. Créer la commande
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total: cartTotals.total,
          subtotal: cartTotals.subtotal,
          tax: cartTotals.tax,
          shipping: cartTotals.shipping,
          status: 'completed',
          stripeSessionId: stripeSessionId || checkoutSessionId, // Stocker l'ID session Stripe
        }
      })

      // 2. Créer les articles de commande
      const orderItems = await Promise.all(
        cartItems.map(item =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            }
          })
        )
      )

      // 3. Vider le panier
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id }
      })

      return { ...newOrder, orderItems }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: cartItems.length
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande', details: errorMessage },
      { status: 500 }
    )
  }
}
