import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from '@/app/actions/email-actions'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const { checkoutSessionId, stripeSessionId } = await request.json()

    if (!checkoutSessionId || !stripeSessionId) {
      return NextResponse.json(
        { error: 'Session ID manquant' },
        { status: 400 }
      )
    }

    // Récupérer les détails de la session Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId, {
      expand: ['line_items', 'customer', 'payment_intent']
    })

    // Vérifier que le paiement a été effectué
    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Paiement non confirmé' },
        { status: 400 }
      )
    }

    // Vérifier si une commande existe déjà pour cette session
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    })

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        order: existingOrder,
        message: 'Commande déjà existante'
      })
    }

    // Calculer les montants
    const totalAmount = stripeSession.amount_total ? stripeSession.amount_total / 100 : 0
    const shippingAmount = parseFloat(stripeSession.metadata?.cart_shipping || '0')
    const subtotalAmount = parseFloat(stripeSession.metadata?.cart_subtotal || '0')

    // Récupérer les line_items avec les détails produit pour créer les OrderItems
    const lineItems = stripeSession.line_items?.data || []

    // Créer la commande ET les orderItems dans une transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          stripeSessionId: stripeSession.id,
          status: 'paid',
          total: totalAmount,
          subtotal: subtotalAmount,
          tax: 0,
          shipping: shippingAmount,
          userId: session?.user?.id || 'guest_' + Math.random().toString(36).substr(2, 9),
        }
      })

      // Créer les OrderItems à partir des line_items Stripe
      for (const item of lineItems) {
        const productId = item.price?.product
          ? (typeof item.price.product === 'string'
              ? (await stripe.products.retrieve(item.price.product)).metadata?.product_id
              : (item.price.product as { metadata?: { product_id?: string } }).metadata?.product_id)
          : null

        if (productId) {
          // Vérifier que le produit existe en base
          const productExists = await tx.product.findUnique({ where: { id: productId } })
          if (productExists) {
            await tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                productId: productId,
                quantity: item.quantity || 1,
                price: item.amount_total ? item.amount_total / 100 / (item.quantity || 1) : 0,
              }
            })
          }
        }
      }

      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          orderItems: {
            include: {
              product: {
                include: { artist: true }
              }
            }
          }
        }
      })
    })

    console.log('✅ Commande créée avec succès:', order?.id, `(${order?.orderItems.length} articles)`)

    // Préparer les données pour les emails
    const orderNumber = order!.id.slice(-8)
    const orderDate = new Date(order!.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    })

    // Récupérer les infos utilisateur
    const user = session?.user?.id
      ? await prisma.user.findUnique({ where: { id: session.user.id } })
      : null

    const customerName = user
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Client'
      : stripeSession.customer_details?.name || 'Client'
    const customerEmail = user?.email || stripeSession.customer_details?.email || ''

    const emailItems = order!.orderItems.map((item: any) => ({
      name: item.product?.name || 'Produit',
      artist: item.product?.artist?.name || 'Artiste',
      quantity: item.quantity,
      price: item.price,
    }))

    // Mode de livraison depuis les métadonnées
    const deliveryMode = (stripeSession.metadata?.delivery_mode || 'delivery') as 'delivery' | 'collect'

    // Adresse de livraison depuis les métadonnées ou Stripe
    const shippingDetails = stripeSession.shipping_details || stripeSession.customer_details
    const shippingAddress = stripeSession.metadata?.shipping_address
      ? {
          name: stripeSession.metadata.shipping_name || customerName,
          address: stripeSession.metadata.shipping_address || '',
          city: stripeSession.metadata.shipping_city || '',
          zipCode: stripeSession.metadata.shipping_zip || '',
          country: stripeSession.metadata.shipping_country || 'France',
        }
      : {
          name: shippingDetails?.name || customerName,
          address: shippingDetails?.address?.line1 || '',
          city: shippingDetails?.address?.city || '',
          zipCode: shippingDetails?.address?.postal_code || '',
          country: shippingDetails?.address?.country || 'France',
        }

    // Envoyer les emails en parallèle (sans bloquer la réponse)
    if (customerEmail) {
      sendOrderConfirmationEmail({
        email: customerEmail,
        userFirstname: user?.firstName || customerName,
        orderNumber,
        orderDate,
        items: emailItems,
        subtotal: order!.subtotal,
        tax: 0,
        shipping: order!.shipping,
        total: order!.total,
        shippingAddress,
      }).catch(err => console.error('❌ Erreur email client:', err))
    }

    sendNewOrderAdminEmail({
      orderNumber,
      orderDate,
      customerName,
      customerEmail,
      items: emailItems,
      subtotal: order!.subtotal,
      shipping: order!.shipping,
      total: order!.total,
      deliveryMode,
      shippingAddress,
    }).catch(err => console.error('❌ Erreur email admin:', err))

    return NextResponse.json({
      success: true,
      order: {
        id: order!.id,
        status: order!.status,
        total: order!.total,
        subtotal: order!.subtotal,
        shipping: order!.shipping,
        stripeSessionId: order!.stripeSessionId,
        createdAt: order!.createdAt,
        orderItems: order!.orderItems,
      }
    })

  } catch (error) {
    console.error('❌ Erreur lors de la création de commande:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création de la commande',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
