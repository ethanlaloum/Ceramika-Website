import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CartService } from '@/lib/services/cart-service'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session)
        break
      
      default:
        // Type d'événement non géré
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Checkout completed
  
  const userId = session.metadata?.user_id
  const source = session.metadata?.source
  
  if (userId && source === 'cart_checkout') {
    // Vider le panier après un paiement réussi depuis le panier
    try {
      await CartService.clearCart(userId)
      // Panier vidé pour l'utilisateur
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error)
    }
  }
  
  // Ici vous pouvez ajouter d'autres logiques comme :
  // - Créer une commande dans votre base de données
  // - Envoyer un email de confirmation
  // - Mettre à jour l'inventaire
  // - Déclencher l'expédition
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Payment succeeded
  
  // Logique supplémentaire si nécessaire
  // Par exemple, mise à jour du statut de commande
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  // Checkout expired
  
  // Logique pour gérer les sessions expirées
  // Par exemple, libérer l'inventaire réservé
}
