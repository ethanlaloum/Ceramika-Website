import { stripe } from '@/lib/stripe'
import { CartItem } from '@/lib/services/cart-service'
import { PRICE_UTILS } from '@/lib/constants'

export interface StripeCheckoutParams {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}

export interface StripeCheckoutResult {
  sessionId: string
  url: string
}

export class StripeCheckoutService {
  /**
   * Crée une session de checkout Stripe avec validation stricte
   */
  static async createCheckoutSession(params: StripeCheckoutParams): Promise<StripeCheckoutResult> {
    const { items, successUrl, cancelUrl, customerEmail, metadata = {} } = params

    // Validation des paramètres
    if (!items || items.length === 0) {
      throw new Error('Aucun article dans le panier')
    }

    if (!successUrl || !cancelUrl) {
      throw new Error('URLs de redirection manquantes')
    }

    // Validation des prix pour éviter les manipulations
    for (const item of items) {
      if (item.product.price <= 0) {
        throw new Error(`Prix invalide pour le produit ${item.product.name}`)
      }
      if (item.quantity <= 0) {
        throw new Error(`Quantité invalide pour le produit ${item.product.name}`)
      }
    }

    // Conversion des articles du panier en line_items Stripe avec validation
    const lineItems = items.map(item => {
      const unitAmount = PRICE_UTILS.euroToStripeCents(item.product.price)
      
      // Double validation du prix
      if (unitAmount <= 0) {
        throw new Error(`Prix invalide pour ${item.product.name}: ${item.product.price}€`)
      }
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product.name,
            images: item.product.images?.length ? [item.product.images[0]] : undefined,
            metadata: {
              artist: item.product.artist.name,
              product_id: item.product.id,
            },
          },
          unit_amount: unitAmount, // Prix en centimes, validé
        },
        quantity: item.quantity,
      }
    })

    // Calcul des totaux pour les métadonnées avec validation
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const shipping = itemCount * 0.40 // 40 centimes par article
    const total = subtotal + shipping

    // Validation des montants
    if (subtotal <= 0 || total <= 0) {
      throw new Error('Montants invalides calculés')
    }

    console.log('💰 Création session Stripe:', {
      items: items.length,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'DE', 'IT', 'ES', 'NL'],
      },
      billing_address_collection: 'auto',
      automatic_tax: {
        enabled: false, // TVA à 0 comme demandé
      },
      metadata: {
        cart_items_count: itemCount.toString(),
        cart_subtotal: subtotal.toFixed(2),
        cart_shipping: shipping.toFixed(2),
        cart_total: total.toFixed(2),
        ...metadata,
      },
      // Configuration pour les frais de livraison
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: PRICE_UTILS.euroToStripeCents(shipping), // Frais de livraison en centimes
              currency: 'eur',
            },
            display_name: 'Livraison standard',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    })

    // Vérification que la session a une URL
    if (!session.url) {
      throw new Error('Erreur lors de la création de la session Stripe')
    }

    console.log('✅ Session Stripe créée:', session.id)

    return {
      sessionId: session.id,
      url: session.url,
    }
  }

  /**
   * Récupère une session de checkout
   */
  static async getCheckoutSession(sessionId: string) {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    })
  }

  /**
   * Vérifie le statut d'un paiement
   */
  static async verifyPayment(sessionId: string) {
    const session = await this.getCheckoutSession(sessionId)
    return {
      paid: session.payment_status === 'paid',
      session,
    }
  }
}
