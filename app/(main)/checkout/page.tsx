"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    // Récupérer l'URL de checkout depuis les paramètres ou créer un nouveau checkout
    const createCheckout = async () => {
      try {
        const response = await fetch('/api/checkout/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            successUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: `${window.location.origin}/checkout/cancel`,
          })
        })

        if (response.ok) {
          const { checkoutUrl } = await response.json()
          setCheckoutUrl(checkoutUrl)
        }
      } catch (error) {
        console.error('Erreur création checkout:', error)
      } finally {
        setLoading(false)
      }
    }

    createCheckout()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Préparation du paiement...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                Paiement sécurisé via Stripe
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Lock className="w-4 h-4 text-green-600" />
                Données cryptées et protégées
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CreditCard className="w-4 h-4 text-green-600" />
                Toutes cartes acceptées
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!checkoutUrl) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Impossible de créer le checkout. Veuillez réessayer.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête intégré */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Finaliser votre commande</h1>
          <p className="text-gray-600">Paiement sécurisé via Polar & Stripe</p>
        </div>

        {/* Iframe de checkout avec hauteur adaptée */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Chargement du checkout sécurisé...</p>
                </div>
              </div>
            )}
            <iframe
              src={checkoutUrl}
              className="w-full h-[600px] border-0"
              title="Checkout Polar"
              allow="payment"
              onLoad={() => setIframeLoaded(true)}
              style={{
                minHeight: '600px',
                background: 'white',
                opacity: iframeLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          </CardContent>
        </Card>

        {/* Badges de confiance */}
        <div className="mt-6 flex justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span>SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-green-600" />
            <span>Cartes acceptées</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Chargement...
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function CheckoutIntegratedPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
