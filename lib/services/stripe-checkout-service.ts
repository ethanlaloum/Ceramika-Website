import { stripe } from '@/lib/stripe'
import { CartItem } from '@/lib/services/cart-service'

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
   * Crée une session de checkout Stripe
   */
  static async createCheckoutSession(params: StripeCheckoutParams): Promise<StripeCheckoutResult> {
    const { items, successUrl, cancelUrl, customerEmail, metadata = {} } = params

    // Conversion des articles du panier en line_items Stripe
    const lineItems = items.map(item => ({
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
        unit_amount: Math.round(item.product.price * 100), // Prix en centimes
      },
      quantity: item.quantity,
    }))

    // Calcul des totaux pour les métadonnées
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const shipping = itemCount * 0.40 // 40 centimes par article
    const total = subtotal + shipping

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
              amount: Math.round(shipping * 100), // Frais de livraison en centimes
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

    return {
      sessionId: session.id,
      url: session.url!,
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
