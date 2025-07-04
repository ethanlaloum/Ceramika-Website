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

    // Vérifier l'historique d'envoi de la facture
    const emailHistory = await StripeInvoiceService.getInvoiceEmailHistory(invoiceId)

    return NextResponse.json({
      success: true,
      data: emailHistory,
      message: emailHistory.emailsSent 
        ? "Email(s) envoyé(s) avec succès" 
        : "Aucun email envoyé trouvé"
    })

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'historique email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de la vérification', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { action, invoiceId } = await request.json()

    if (!invoiceId) {
      return NextResponse.json({ error: "ID de facture manquant" }, { status: 400 })
    }

    if (!action) {
      return NextResponse.json({ error: "Action manquante" }, { status: 400 })
    }

    if (action === 'check') {
      // Vérifier l'historique d'envoi de la facture
      const emailHistory = await StripeInvoiceService.getInvoiceEmailHistory(invoiceId)

      return NextResponse.json({
        success: true,
        emailInfo: emailHistory,
        message: emailHistory.emailsSent 
          ? "Email(s) envoyé(s) avec succès" 
          : "Aucun email envoyé trouvé"
      })
    }

    if (action === 'resend') {
      // Renvoyer l'email de facture
      const result = await StripeInvoiceService.resendInvoiceEmail(invoiceId)

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: "Email renvoyé avec succès",
          invoice: result.invoice
        })
      } else {
        return NextResponse.json(
          { error: "Erreur lors du renvoi", details: result.error },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ error: "Action non supportée" }, { status: 400 })

  } catch (error) {
    console.error('Erreur lors du traitement de l\'email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors du traitement de l\'email', details: errorMessage },
      { status: 500 }
    )
  }
}
