import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { StripeInvoiceService } from '@/lib/services/stripe-invoice-service'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('invoiceId')

    if (!invoiceId) {
      return NextResponse.json({ error: "ID de facture manquant" }, { status: 400 })
    }

    const result = {
      invoiceId,
      timestamp: new Date().toISOString(),
      tests: {} as any
    }

    // 1. Vérifier l'historique d'envoi
    try {
      const history = await StripeInvoiceService.getInvoiceEmailHistory(invoiceId)
      result.tests.emailHistory = {
        success: true,
        data: history
      }
    } catch (error) {
      result.tests.emailHistory = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }

    // 2. Récupérer les détails de la facture
    try {
      const invoice = await StripeInvoiceService.getInvoice(invoiceId)
      result.tests.invoiceDetails = {
        success: true,
        data: {
          status: invoice.status,
          customer_email: invoice.customer_email,
          amount_paid: invoice.amount_paid,
          currency: invoice.currency,
          created: invoice.created,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url
        }
      }
    } catch (error) {
      result.tests.invoiceDetails = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }

    // 3. Tester le renvoi d'email
    try {
      const resendResult = await StripeInvoiceService.resendInvoiceEmail(invoiceId)
      result.tests.resendEmail = {
        success: resendResult.success,
        data: resendResult.success ? {
          message: resendResult.message,
          invoice_status: resendResult.invoice?.status,
          invoice_id: resendResult.invoice?.id
        } : null,
        error: resendResult.success ? null : resendResult.error
      }
    } catch (error) {
      result.tests.resendEmail = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Erreur lors du diagnostic:', error)
    return NextResponse.json(
      { error: 'Erreur lors du diagnostic', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
