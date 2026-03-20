"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { ORDER_CONFIG } from '@/lib/constants'
import { FadeIn } from '@/components/animations'
import { ArrowLeft, Loader2, Truck, Store, Shield, Lock, CreditCard, MapPin } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const COLLECT_ADDRESS = "10 rue Solférino, 06220 Vallauris"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, subtotal, shipping, total, itemCount } = useCart()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [showMinOrderAlert, setShowMinOrderAlert] = useState(false)
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'collect'>('delivery')
  const [address, setAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    country: 'France',
  })

  const effectiveShipping = deliveryMode === 'collect' ? 0 : shipping
  const effectiveTotal = subtotal + effectiveShipping

  if (!user) {
    router.push('/customer')
    return null
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const isAddressValid = deliveryMode === 'collect' || (
    address.firstName.trim() &&
    address.lastName.trim() &&
    address.addressLine1.trim() &&
    address.city.trim() &&
    address.zipCode.trim() &&
    address.country.trim()
  )

  const handleCheckout = async () => {
    if (effectiveTotal < ORDER_CONFIG.MINIMUM_AMOUNT) {
      setShowMinOrderAlert(true)
      return
    }

    if (!isAddressValid) {
      toast({
        title: "Adresse incomplète",
        description: "Veuillez remplir tous les champs obligatoires de l'adresse de livraison.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
          deliveryMode,
          shippingAddress: deliveryMode === 'delivery' ? address : {
            firstName: address.firstName || user?.firstName || '',
            lastName: address.lastName || user?.lastName || '',
            addressLine1: COLLECT_ADDRESS,
            addressLine2: '',
            city: 'Vallauris',
            zipCode: '06220',
            country: 'France',
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du checkout')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de procéder au paiement. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild size="sm">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au panier
              </Link>
            </Button>
            <div>
              <h1 className="font-playfair text-3xl font-bold text-stone-800 dark:text-stone-100">
                Finaliser la commande
              </h1>
              <p className="text-stone-600 dark:text-stone-300 text-sm">
                {itemCount} {itemCount === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode de livraison */}
            <FadeIn delay={0.1}>
              <Card className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                <CardHeader>
                  <CardTitle className="text-lg text-stone-800 dark:text-stone-100">
                    Mode de retrait
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryMode}
                    onValueChange={(v) => setDeliveryMode(v as 'delivery' | 'collect')}
                    className="space-y-3"
                  >
                    <label
                      htmlFor="delivery"
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        deliveryMode === 'delivery'
                          ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-700/50'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                          <span className="font-semibold text-stone-800 dark:text-stone-100">Livraison à domicile</span>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          Livraison en 3 à 7 jours ouvrés — {shipping.toFixed(2)} €
                        </p>
                      </div>
                    </label>

                    <label
                      htmlFor="collect"
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        deliveryMode === 'collect'
                          ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-700/50'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <RadioGroupItem value="collect" id="collect" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Store className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                          <span className="font-semibold text-stone-800 dark:text-stone-100">Click & Collect</span>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          Retrait gratuit à l'atelier — {COLLECT_ADDRESS}
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Adresse de livraison */}
            {deliveryMode === 'delivery' && (
              <FadeIn delay={0.2}>
                <Card className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={address.firstName}
                          onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                          placeholder="Prénom"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={address.lastName}
                          onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                          placeholder="Nom"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Adresse *</Label>
                      <Input
                        id="addressLine1"
                        value={address.addressLine1}
                        onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                        placeholder="Numéro et nom de rue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Complément d'adresse</Label>
                      <Input
                        id="addressLine2"
                        value={address.addressLine2}
                        onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                        placeholder="Bâtiment, étage, code d'accès..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Code postal *</Label>
                        <Input
                          id="zipCode"
                          value={address.zipCode}
                          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                          placeholder="06220"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="Vallauris"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Pays *</Label>
                      <Input
                        id="country"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        placeholder="France"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {/* Info Click & Collect */}
            {deliveryMode === 'collect' && (
              <FadeIn delay={0.2}>
                <Card className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Point de retrait
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-stone-50 dark:bg-stone-700/50 rounded-lg p-4">
                      <p className="font-semibold text-stone-800 dark:text-stone-100">Atelier Ceramika</p>
                      <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">{COLLECT_ADDRESS}</p>
                      <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
                        Vous recevrez un email lorsque votre commande sera prête à être retirée.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>

          {/* Résumé de commande */}
          <div>
            <FadeIn delay={0.3}>
              <Card className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg text-stone-800 dark:text-stone-100 mb-4">
                    Résumé de la commande
                  </h2>

                  {/* Articles */}
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-stone-600 dark:text-stone-300 truncate mr-2">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-stone-800 dark:text-stone-100 font-medium whitespace-nowrap">
                          {(item.product.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-200 dark:border-stone-700 pt-3 space-y-2">
                    <div className="flex justify-between text-stone-600 dark:text-stone-300">
                      <span>Sous-total (HT)</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-300">
                      <span>
                        {deliveryMode === 'collect' ? 'Click & Collect' : 'Livraison'}
                      </span>
                      <span>
                        {deliveryMode === 'collect' ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                        ) : (
                          `${effectiveShipping.toFixed(2)} €`
                        )}
                      </span>
                    </div>
                    <div className="border-t border-stone-200 dark:border-stone-700 pt-2">
                      <div className="flex justify-between text-lg font-bold text-stone-800 dark:text-stone-100">
                        <span>Total (HT)</span>
                        <span>{effectiveTotal.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Payer */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading || !isAddressValid}
                    className="w-full mt-6 bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Redirection vers le paiement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payer {effectiveTotal.toFixed(2)} €
                      </>
                    )}
                  </Button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Données cryptées</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      <AlertDialog open={showMinOrderAlert} onOpenChange={setShowMinOrderAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Commande minimum requise</AlertDialogTitle>
            <AlertDialogDescription>
              Le montant minimum de commande est de <strong>{ORDER_CONFIG.MINIMUM_AMOUNT} €</strong>.
              <br />
              Votre panier actuel est de <strong>{effectiveTotal.toFixed(2)} €</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowMinOrderAlert(false)}>
              J'ai compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
