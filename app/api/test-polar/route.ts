import { NextRequest, NextResponse } from 'next/server'
import polar from '@/lib/polar'

export async function GET() {
  try {
    
    // Essayer de récupérer la liste des produits (plus simple qu'un checkout)
    const products = await polar.products.list({})
    
    return NextResponse.json({ 
      success: true,
      products: products.result,
      message: 'Connexion Polar réussie'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: error
      },
      { status: 500 }
    )
  }
}
