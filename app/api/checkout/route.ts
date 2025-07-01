import { NextRequest, NextResponse } from 'next/server'
import polar from '@/lib/polar'
import { prisma } from '@/lib/prisma'
import { ORDER_CONFIG, ERROR_MESSAGES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const { productId, customerId, successUrl, cancelUrl } = await request.json()
    
    console.log('Création checkout simple avec:', { productId, customerId })

    // Récupérer le produit depuis la base de données pour vérifier le prix
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Vérification du montant minimum
    if (product.price < ORDER_CONFIG.MINIMUM_AMOUNT) {
      return NextResponse.json({ 
        error: ERROR_MESSAGES.MINIMUM_ORDER_PRODUCT(product.price, ORDER_CONFIG.MINIMUM_AMOUNT)
      }, { status: 400 })
    }
    
    const checkout = await polar.checkouts.create({
      products: [productId], // Utiliser le même format que l'API cart
      customerId, // optionnel
    })
    
    return NextResponse.json({ 
      checkoutUrl: checkout.url,
      checkoutId: checkout.id 
    })
  } catch (error) {
    console.error('Erreur création checkout:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du checkout' },
      { status: 500 }
    )
  }
}