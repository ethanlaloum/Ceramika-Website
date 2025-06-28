"use client"

import { PolarCheckoutButton } from '@/components/polar-checkout-button'
import { PolarCheckoutModal } from '@/components/polar-checkout-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function CheckoutTestPage() {
  const { items, addToCart } = useCart()
  const { user } = useAuth()

  const addTestProduct = async () => {
    // Ajouter un produit de test au panier
    await addToCart('cmbt7gz8w00ois6f39tbyyonm', 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* État du test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Checkout Polar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">État utilisateur :</h3>
              <p className="text-sm text-gray-600">
                {user ? `Connecté: ${user.email}` : 'Non connecté'}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Panier :</h3>
              <p className="text-sm text-gray-600">
                {items.length} produit(s) dans le panier
              </p>
              {items.length === 0 && (
                <button
                  onClick={addTestProduct}
                  className="mt-2 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                >
                  Ajouter un produit de test
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Options de checkout */}
        <Card>
          <CardHeader>
            <CardTitle>Options de checkout disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Option 1: Page intégrée */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">✅ Page intégrée (Recommandé)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Checkout dans une page qui respecte votre navigation
              </p>
              <PolarCheckoutButton />
              <p className="text-xs text-gray-500 mt-2">
                Redirige vers: /checkout (avec navigation visible)
              </p>
            </div>

            {/* Option 2: Modal */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">🎯 Modal popup</h3>
              <p className="text-sm text-gray-600 mb-3">
                Checkout dans un modal qui reste sur la page
              </p>
              <PolarCheckoutModal />
              <p className="text-xs text-gray-500 mt-2">
                S'ouvre dans un modal overlay
              </p>
            </div>

            {/* Option 3: Lien direct */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">🔗 Page dédiée simple</h3>
              <p className="text-sm text-gray-600 mb-3">
                Page de checkout simple sans fioritures
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/checkout">
                  Aller au checkout simple
                </Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Page /checkout avec iframe intégré
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Guide de test */}
        <Card>
          <CardHeader>
            <CardTitle>Guide de test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>Cartes de test Stripe :</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>• <code>4000000000000002</code> - Carte déclinée</div>
              <div>• <code>4000000000000069</code> - Carte expirée</div>
              <div>• <code>4000000000000341</code> - Fonds insuffisants</div>
              <div>• <code>4242424242424242</code> - Succès</div>
            </div>
            <div className="text-xs text-gray-500">
              Date: 12/25, CVC: 123, Code postal: 12345
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
