"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Mail, ArrowLeft } from 'lucide-react'
import { FadeIn } from '@/components/animations'
import { useToast } from '@/hooks/use-toast'

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(true)
  const [orderData, setOrderData] = useState<any>(null)
  
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      router.push('/checkout/cancel')
      return
    }

    // Créer la commande côté serveur en récupérant les données de la session Stripe
    const createOrder = async () => {
      try {
        const response = await fetch('/api/orders/create-from-stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkoutSessionId: sessionId,
            stripeSessionId: sessionId,
          }),
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setOrderData(result.order) // L'API retourne { success: true, order: {...} }
          
          // Vider le panier après succès
          localStorage.removeItem('cart')
          
          // Notification de succès
          toast({
            title: "Commande confirmée !",
            description: "Votre paiement a été traité avec succès.",
          })
        } else {
          console.error('Erreur lors de la création de la commande:', result)
          
          toast({
            title: "Erreur",
            description: result.error || "Une erreur est survenue lors de la création de votre commande.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Erreur réseau:', error)
        setIsProcessing(false)
      }
    }

    createOrder()
  }, [sessionId, router, toast])

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Traitement de votre commande...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Aucune donnée de commande trouvée.</p>
              <Link href="/">
                <Button className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Commande confirmée !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-muted-foreground">
                <p>Merci pour votre achat ! Votre paiement a été traité avec succès.</p>
                <p className="mt-2">
                  Numéro de commande : <span className="font-mono font-semibold">#{orderData.id.slice(-8)}</span>
                </p>
              </div>

              {/* Résumé de la commande */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Résumé de votre commande
                </h3>
                <div className="space-y-2">
                  {orderData.orderItems?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product?.name || 'Produit'} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                  {orderData.shipping > 0 && (
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span>Frais de livraison</span>
                      <span>{orderData.shipping.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{orderData.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Prochaines étapes */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Prochaines étapes
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Un email de confirmation a été envoyé à votre adresse</li>
                  <li>• Votre commande sera préparée dans les 24-48h</li>
                  <li>• Vous recevrez un email avec le numéro de suivi</li>
                  <li>• Livraison estimée : 3-5 jours ouvrés</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/customer/orders" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Voir mes commandes
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  )
}
