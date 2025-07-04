import { Resend } from 'resend'
import { StripeInvoiceEmail } from '@/emails/stripe-invoice-email'
import { StripeInvoiceService } from './stripe-invoice-service'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface InvoiceEmailData {
  customerEmail: string
  customerName: string
  invoiceNumber: string
  invoiceUrl: string
  invoicePdf: string
  amount: number
  currency: string
  dueDate?: string
  orderNumber?: string
}

export class InvoiceEmailService {
  /**
   * Envoie un email de facture via Resend avec les détails Stripe
   */
  static async sendInvoiceEmail(invoiceId: string, orderData?: any): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      // 1. Récupérer les détails de la facture Stripe
      const invoice = await StripeInvoiceService.getInvoice(invoiceId)
      
      if (!invoice) {
        return { success: false, error: 'Facture non trouvée' }
      }

      // 2. Préparer les données pour l'email
      const emailData: InvoiceEmailData = {
        customerEmail: invoice.customer_email || '',
        customerName: orderData?.customerName || invoice.customer_name || 'Client',
        invoiceNumber: invoice.number || invoiceId,
        invoiceUrl: invoice.hosted_invoice_url || '',
        invoicePdf: invoice.invoice_pdf || '',
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString('fr-FR') : undefined,
        orderNumber: orderData?.orderNumber || invoice.metadata?.order_id || ''
      }

      // 3. Vérifier que nous avons les données essentielles
      if (!emailData.customerEmail) {
        return { success: false, error: 'Email client manquant' }
      }

      if (!emailData.invoiceUrl && !emailData.invoicePdf) {
        return { success: false, error: 'URL de facture manquante' }
      }

      // 4. Envoyer l'email via Resend
      const result = await resend.emails.send({
        from: 'Ceramika <noreply@mail.cerami-ka.com>',
        to: [emailData.customerEmail],
        subject: `Votre facture Ceramika ${emailData.invoiceNumber}`,
        react: StripeInvoiceEmail({
          customerName: emailData.customerName,
          invoiceNumber: emailData.invoiceNumber,
          invoiceUrl: emailData.invoiceUrl,
          invoicePdf: emailData.invoicePdf,
          amount: emailData.amount,
          currency: emailData.currency,
          orderNumber: emailData.orderNumber
        }),
      })

      if (result.error) {
        console.error('Erreur Resend:', result.error)
        return { success: false, error: result.error.message }
      }

      // Email de facture envoyé avec succès
      return { 
        success: true, 
        messageId: result.data?.id 
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de facture:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }

  /**
   * Envoie un email de facture pour une commande spécifique
   */
  static async sendInvoiceEmailForOrder(orderId: string): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      // Récupérer la commande avec les détails nécessaires
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      if (!order || !order.invoiceId) {
        return { success: false, error: 'Commande ou facture non trouvée' }
      }

      const orderData = {
        customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
        orderNumber: order.id.slice(-8)
      }

      return await this.sendInvoiceEmail(order.invoiceId, orderData)

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email pour la commande:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  }
}
