import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { StripeInvoiceService } from '@/lib/services/stripe-invoice-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, customerEmail, customerName, items, metadata } = body

    // Cas 1: Création de facture pour une commande existante
    if (orderId) {
      // Récupérer la commande avec tous les détails
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          orderItems: {
            include: {
              product: {
                include: {
                  artist: true,
                },
              },
            },
          },
        },
      })

      if (!order) {
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 })
      }

      // Vérifier que l'utilisateur est propriétaire de la commande
      if (order.userId !== session.user.id) {
        return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
      }

      // Créer la facture avec Stripe
      const invoiceResult = await StripeInvoiceService.createInvoiceForOrder(order, order.user)

      // Sauvegarder l'ID de la facture dans la commande
      await prisma.order.update({
        where: { id: orderId },
        data: {
          invoiceId: invoiceResult.invoiceId,
        },
      })

      return NextResponse.json({
        success: true,
        invoice: invoiceResult,
        message: "Facture créée et envoyée par email",
      })
    }

    // Cas 2: Création de facture directe (pour les tests)
    if (customerEmail && customerName && items) {
      const invoiceResult = await StripeInvoiceService.createInvoice({
        customerEmail,
        customerName,
        items,
        metadata: {
          test: 'true',
          ...metadata,
        },
      })

      return NextResponse.json({
        success: true,
        invoice: invoiceResult,
        message: "Facture de test créée et envoyée par email",
      })
    }

    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })

  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const invoiceId = searchParams.get('invoiceId')

    // Cas 1: Récupération via ID de commande
    if (orderId) {
      // Récupérer la commande
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          userId: true,
          invoiceId: true,
        },
      })

      if (!order) {
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 })
      }

      // Vérifier que l'utilisateur est propriétaire de la commande
      if (order.userId !== session.user.id) {
        return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
      }

      if (!order.invoiceId) {
        return NextResponse.json({ error: "Aucune facture trouvée pour cette commande" }, { status: 404 })
      }

      // Récupérer la facture depuis Stripe
      const invoice = await StripeInvoiceService.getInvoice(order.invoiceId)

      return NextResponse.json({
        success: true,
        invoice: {
          id: invoice.id,
          url: invoice.hosted_invoice_url,
          pdf: invoice.invoice_pdf,
          status: invoice.status,
          amount: invoice.amount_due,
          currency: invoice.currency,
        },
      })
    }

    // Cas 2: Récupération directe via ID de facture (pour les tests)
    if (invoiceId) {
      const invoice = await StripeInvoiceService.getInvoice(invoiceId)

      return NextResponse.json({
        success: true,
        invoice: {
          id: invoice.id,
          url: invoice.hosted_invoice_url,
          pdf: invoice.invoice_pdf,
          status: invoice.status,
          amount: invoice.amount_due,
          currency: invoice.currency,
          customer_email: invoice.customer_email,
        },
      })
    }

    return NextResponse.json({ error: "ID de commande ou de facture manquant" }, { status: 400 })

  } catch (error) {
    console.error('Erreur lors de la récupération de la facture:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la facture', details: errorMessage },
      { status: 500 }
    )
  }
}