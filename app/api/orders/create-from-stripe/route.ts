import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

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
      where: { stripeSessionId }
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

    // Créer la commande dans la base de données
    const order = await prisma.order.create({
      data: {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        stripeSessionId: stripeSession.id,
        status: 'paid',
        total: totalAmount,
        subtotal: subtotalAmount,
        tax: 0, // TVA à 0 comme configuré
        shipping: shippingAmount,
        userId: session?.user?.id || 'guest_' + Math.random().toString(36).substr(2, 9),
      }
    })

    console.log('✅ Commande créée avec succès:', order.id)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        stripeSessionId: order.stripeSessionId,
        createdAt: order.createdAt
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
