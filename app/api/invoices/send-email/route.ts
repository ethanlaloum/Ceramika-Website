import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { InvoiceEmailService } from '@/lib/services/invoice-email-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { invoiceId, orderId, action } = await request.json()

    if (!invoiceId && !orderId) {
      return NextResponse.json({ error: "ID de facture ou de commande manquant" }, { status: 400 })
    }

    if (!action || !['send', 'resend'].includes(action)) {
      return NextResponse.json({ error: "Action invalide (send ou resend)" }, { status: 400 })
    }

    let result

    if (orderId) {
      // Envoyer l'email pour une commande spécifique
      result = await InvoiceEmailService.sendInvoiceEmailForOrder(orderId)
    } else {
      // Envoyer l'email pour une facture spécifique
      result = await InvoiceEmailService.sendInvoiceEmail(invoiceId)
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email envoyé avec succès via Resend",
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi", details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi d\'email via Resend:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi d\'email', details: errorMessage },
      { status: 500 }
    )
  }
}
