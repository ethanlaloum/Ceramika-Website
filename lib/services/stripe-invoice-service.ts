import { stripe } from '@/lib/stripe'

export interface InvoiceData {
  customerEmail: string
  customerName: string
  customerAddress?: {
    line1: string
    line2?: string
    city: string
    postal_code: string
    country: string
  }
  items: Array<{
    description: string
    quantity: number
    unit_amount: number // en centimes
  }>
  metadata?: Record<string, string>
  dueDate?: Date
  notes?: string
}

export interface InvoiceResult {
  invoiceId: string
  invoiceUrl: string
  invoicePdf: string
  status: string
}

export class StripeInvoiceService {
  /**
   * Crée un client Stripe si nécessaire
   */
  static async createOrGetCustomer(email: string, name: string, address?: any) {
    // Rechercher un client existant
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]
    }

    // Créer un nouveau client
    return await stripe.customers.create({
      email: email,
      name: name,
      address: address,
    })
  }

  /**
   * Crée une facture Stripe
   */
  static async createInvoice(invoiceData: InvoiceData): Promise<InvoiceResult> {
    const {
      customerEmail,
      customerName,
      customerAddress,
      items,
      metadata = {},
      dueDate,
      notes
    } = invoiceData

    // 1. Créer ou récupérer le client
    const customer = await this.createOrGetCustomer(
      customerEmail,
      customerName,
      customerAddress
    )

    // 2. Créer les éléments de facture
    const invoiceItems = await Promise.all(
      items.map(item =>
        stripe.invoiceItems.create({
          customer: customer.id,
          amount: item.unit_amount * item.quantity, // Montant total en centimes
          currency: 'eur',
          description: item.description,
        })
      )
    )

    // 3. Créer la facture
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 30,
      metadata: {
        order_source: 'ceramika_website',
        ...metadata,
      },
      footer: notes || 'Merci pour votre commande !',
      auto_advance: true, // Finalise automatiquement la facture
    })

    // 4. Finaliser la facture
    if (!invoice.id) {
      throw new Error('Erreur lors de la création de la facture')
    }

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

    // 5. Envoyer la facture par email
    if (finalizedInvoice.id) {
      await stripe.invoices.sendInvoice(finalizedInvoice.id)
    }

    return {
      invoiceId: finalizedInvoice.id || '',
      invoiceUrl: finalizedInvoice.hosted_invoice_url || '',
      invoicePdf: finalizedInvoice.invoice_pdf || '',
      status: finalizedInvoice.status || 'draft',
    }
  }

  /**
   * Récupère une facture existante
   */
  static async getInvoice(invoiceId: string) {
    return await stripe.invoices.retrieve(invoiceId)
  }

  /**
   * Marque une facture comme payée (pour les paiements hors-ligne)
   */
  static async markInvoiceAsPaid(invoiceId: string) {
    return await stripe.invoices.pay(invoiceId, {
      paid_out_of_band: true,
    })
  }

  /**
   * Annule une facture
   */
  static async voidInvoice(invoiceId: string) {
    return await stripe.invoices.voidInvoice(invoiceId)
  }

  /**
   * Vérifie l'historique d'envoi d'une facture
   */
  static async getInvoiceEmailHistory(invoiceId: string) {
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId, {
        expand: ['customer']
      })
      
      // Récupérer les événements liés à cette facture
      const events = await stripe.events.list({
        type: 'invoice.sent',
        limit: 10,
      })
      
      // Filtrer les événements pour cette facture spécifique
      const invoiceEvents = events.data.filter(event => 
        event.type.includes('invoice') && 
        (event.data.object as any)?.id === invoiceId
      )
      
      return {
        invoice,
        emailsSent: invoiceEvents.length > 0,
        emailEvents: invoiceEvents,
        customerEmail: invoice.customer_email,
        lastEmailSent: invoiceEvents.length > 0 ? invoiceEvents[0].created : null
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'historique email:', error)
      throw error
    }
  }

  /**
   * Renvoie manuellement une facture par email
   */
  static async resendInvoiceEmail(invoiceId: string) {
    try {
      const result = await stripe.invoices.sendInvoice(invoiceId)
      return {
        success: true,
        invoice: result,
        message: 'Email renvoyé avec succès'
      }
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  /**
   * Crée une facture pour une commande existante
   */
  static async createInvoiceForOrder(order: any, customerData: any): Promise<InvoiceResult> {
    const items = order.orderItems.map((item: any) => ({
      description: `${item.product.name} - ${item.product.artist.name}`,
      quantity: item.quantity,
      unit_amount: Math.round(item.price * 100), // Prix en centimes
    }))

    // Ajouter les frais de livraison si applicable
    if (order.shipping > 0) {
      items.push({
        description: 'Frais de livraison',
        quantity: 1,
        unit_amount: Math.round(order.shipping * 100),
      })
    }

    return await this.createInvoice({
      customerEmail: customerData.email,
      customerName: `${customerData.firstName} ${customerData.lastName}`,
      customerAddress: customerData.address,
      items,
      metadata: {
        order_id: order.id,
        stripe_session_id: order.stripeSessionId,
      },
      notes: `Facture pour la commande #${order.id.slice(-8)}`,
    })
  }
}