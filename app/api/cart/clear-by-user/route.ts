import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/lib/services/cart-service'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 })
    }
    
    await CartService.clearCart(userId)

    return NextResponse.json({ success: true, message: "Panier vidé avec succès" })
  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error)
    return NextResponse.json(
      { error: 'Erreur lors du vidage du panier' },
      { status: 500 }
    )
  }
}
