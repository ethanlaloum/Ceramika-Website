"use client"

import { XCircle, AlertTriangle, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckoutCancel() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const errorCode = searchParams?.get('error_code')
  const tempProductId = searchParams?.get('temp_product_id')

  // Nettoyer le produit temporaire si présent
  useEffect(() => {
    const cleanupTempProduct = async () => {
      if (tempProductId) {
        console.log('🗑️ Nettoyage du produit temporaire après annulation:', tempProductId)
        try {
          await fetch('/api/cleanup/temp-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: tempProductId })
          })
          console.log('✅ Produit temporaire nettoyé après annulation')
        } catch (error) {
          console.warn('⚠️ Erreur lors du nettoyage du produit temporaire:', error)
          // Ne pas faire échouer la page pour ça
        }
      }
    }

    cleanupTempProduct()
  }, [tempProductId])

  // Messages d'erreur spécifiques selon le code d'erreur Stripe
  const getErrorMessage = (code: string | null) => {
    switch (code) {
      case 'card_declined':
        return 'Votre carte a été refusée. Veuillez essayer avec une autre carte.'
      case 'expired_card':
        return 'Votre carte a expiré. Veuillez utiliser une carte valide.'
      case 'incorrect_cvc':
        return 'Le code de sécurité (CVC) est incorrect.'
      case 'insufficient_funds':
        return 'Fonds insuffisants sur votre carte.'
      case 'processing_error':
        return 'Une erreur de traitement est survenue. Veuillez réessayer.'
      case 'incorrect_number':
        return 'Le numéro de carte est invalide.'
      default:
        return error || 'Le paiement a été annulé ou a échoué.'
    }
  }

  const isDeclined = errorCode && ['card_declined', 'expired_card', 'incorrect_cvc', 'insufficient_funds'].includes(errorCode)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              isDeclined ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              {isDeclined ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              )}
            </div>
            <CardTitle className={`text-2xl font-bold ${
              isDeclined ? 'text-red-800' : 'text-orange-800'
            }`}>
              {isDeclined ? 'Paiement refusé' : 'Paiement annulé'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(errorCode)}
              </AlertDescription>
            </Alert>

            {errorCode && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Code d'erreur: {errorCode}
              </div>
            )}

            <p className="text-gray-600 text-center">
              {isDeclined 
                ? 'Votre commande n\'a pas été traitée. Aucun montant n\'a été débité.'
                : 'Votre commande a été annulée. Vous pouvez reprendre vos achats quand vous le souhaitez.'
              }
            </p>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/cart">
                  Retourner au panier
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">
                  Continuer les achats
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
