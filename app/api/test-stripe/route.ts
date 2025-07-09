import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test de connectivité avec l'API Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    // Récupération des informations du compte
    const account = await stripe.accounts.retrieve()
    
    const isLiveMode = !process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
    
    return NextResponse.json({
      success: true,
      mode: isLiveMode ? 'PRODUCTION' : 'TEST',
      accountId: account.id,
      country: account.country,
      email: account.email,
      displayName: account.display_name || account.business_profile?.name,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur test Stripe:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
