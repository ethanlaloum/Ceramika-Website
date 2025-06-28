import { NextRequest, NextResponse } from 'next/server'
import polar from '@/lib/polar'

export async function POST(request: NextRequest) {
  try {
    const { productId, customerId, successUrl, cancelUrl } = await request.json()
    
    console.log('Création checkout simple avec:', { productId, customerId })
    
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