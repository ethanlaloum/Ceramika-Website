import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CartService } from '@/lib/services/cart-service'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Validation stricte de la clé webhook
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error('❌ STRIPE_WEBHOOK_SECRET manquante - Configuration requise pour la production')
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('❌ Signature Stripe manquante dans les headers')
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Vérification de la signature webhook pour sécuriser les requêtes
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
    console.log('✅ Webhook Stripe vérifié:', event.type, 'ID:', event.id)
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('❌ Échec de vérification de signature webhook:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('📦 Traitement checkout.session.completed:', event.data.object.id)
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        console.log('💳 Traitement payment_intent.succeeded:', event.data.object.id)
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'checkout.session.expired':
        console.log('⏰ Traitement checkout.session.expired:', event.data.object.id)
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.payment_failed':
        console.log('❌ Traitement payment_intent.payment_failed:', event.data.object.id)
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      default:
        console.log('ℹ️ Événement non géré:', event.type)
        break
    }

    console.log('✅ Webhook traité avec succès:', event.type, event.id)
    return NextResponse.json({ received: true, processed: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('❌ Erreur lors du traitement du webhook:', errorMessage)
    console.error('📋 Détails de l\'événement:', event.type, event.id)
    
    return NextResponse.json(
      { 
        error: 'Error processing webhook',
        details: errorMessage,
        eventType: event.type,
        eventId: event.id
      },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('📦 Début traitement checkout.session.completed')
  
  const userId = session.metadata?.user_id
  const source = session.metadata?.source
  
  try {
    if (userId && source === 'cart_checkout') {
      // Vider le panier après un paiement réussi depuis le panier
      await CartService.clearCart(userId)
      console.log('✅ Panier vidé pour l\'utilisateur:', userId)
    }
    
    // TODO: Ajouter d'autres logiques comme :
    // - Créer une commande dans votre base de données
    // - Envoyer un email de confirmation
    // - Mettre à jour l'inventaire
    // - Déclencher l'expédition
    
    console.log('✅ Checkout complété traité avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du traitement du checkout complété:', error)
    throw error
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💳 Début traitement payment_intent.succeeded')
  
  try {
    // Logique supplémentaire si nécessaire
    // Par exemple, mise à jour du statut de commande
    console.log('✅ Payment intent succeeded traité avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du traitement du payment succeeded:', error)
    throw error
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  console.log('⏰ Début traitement checkout.session.expired')
  
  try {
    // Logique pour gérer les sessions expirées
    // Par exemple, libérer l'inventaire réservé
    console.log('✅ Checkout expiré traité avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du traitement du checkout expiré:', error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Début traitement payment_intent.payment_failed')
  
  try {
    // Logique pour gérer les paiements échoués
    // Par exemple, notifier l'utilisateur, libérer l'inventaire
    console.log('✅ Payment failed traité avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du traitement du payment failed:', error)
    throw error
  }
}
