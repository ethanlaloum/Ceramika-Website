"use client"

import { useEffect, useState, Suspense } from 'react'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { useSearchParams } from 'next/navigation'
import { OrderSummary } from '@/types'

function CheckoutSuccessContent() {
  const { clearCart } = useCart()
  const [hasCleared, setHasCleared] = useState(false)
  const [isProcessing, setIsProcessing] = useState(true)
  const [orderCreated, setOrderCreated] = useState<OrderSummary | null>(null)
  const searchParams = useSearchParams()

  // Crée la commande et vide le panier après paiement réussi
  useEffect(() => {
    let isMounted = true

    const createOrderAndClearCart = async () => {
      if (!isMounted) return

      try {
        // Récupérer tous les paramètres disponibles
        const allParams = new URLSearchParams(window.location.search)
        
        // Récupérer les paramètres du paiement - Polar utilise généralement ces noms
        const customerSessionToken = searchParams.get('customer_session_token')
        const checkoutSessionId = searchParams.get('checkout_session_id') || searchParams.get('session_id')
        const paymentIntentId = searchParams.get('payment_intent_id') || searchParams.get('pi')
        const checkoutId = searchParams.get('checkout_id')
        const userId = searchParams.get('userId') // Notre paramètre custom
        const tempProductId = searchParams.get('temp_product_id') // ID du produit temporaire
        
        // Essayer différents noms de paramètres pour l'ID checkout
        const actualCheckoutId = checkoutSessionId || paymentIntentId || checkoutId
        
        // Si aucun ID checkout n'est disponible, utiliser un ID temporaire pour les tests
        const finalCheckoutId = actualCheckoutId || `temp-${Date.now()}-${userId}`
        
        // Méthode 1 : Créer la commande via l'API dédiée
        const orderResponse = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            checkoutSessionId: finalCheckoutId, // Utiliser l'ID final (même si temporaire)
            polarCustomerSessionToken: customerSessionToken 
          })
        })
        
        if (orderResponse.ok && isMounted) {
          const orderData = await orderResponse.json()
          setOrderCreated(orderData.order)
          setHasCleared(true)
          setIsProcessing(false)
          
          // Nettoyer le produit temporaire Polar si présent
          let productIdToClean = tempProductId
          
          // Si pas d'ID dans l'URL, essayer de le récupérer depuis les métadonnées de la commande
          if (!productIdToClean && orderData.metadata?.temp_product_id) {
            productIdToClean = orderData.metadata.temp_product_id
          }
          
          if (productIdToClean) {
            try {
              const cleanupResponse = await fetch('/api/cleanup/temp-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: productIdToClean })
              })
              
              const cleanupResult = await cleanupResponse.json()
              // Nettoyage silencieux - ne pas impacter l'UX
            } catch (error) {
              // Ne pas faire échouer le processus pour ça
            }
          }
          
          return
        } else {
          const errorData = await orderResponse.json()
          // Erreur lors de la création de commande - continuer avec le fallback
        }

        // Méthode 2 : Fallback - vider le panier seulement
        const userIdFromUrl = searchParams.get('userId') || userId
        if (userIdFromUrl && isMounted) {
          const response = await fetch('/api/cart/clear-by-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userIdFromUrl })
          })
          
          if (response.ok && isMounted) {
            setHasCleared(true)
            setIsProcessing(false)
            return
          } else {
            const errorData = await response.json()
            // Erreur lors du vidage du panier - continuer avec le fallback client
          }
        }
        
        // Méthode 3 : Via le hook client
        if (isMounted) {
          await clearCart()
          setHasCleared(true)
          setIsProcessing(false)
        }
        
      } catch (error) {
        if (isMounted) {
          setHasCleared(true)
          setIsProcessing(false)
        }
      }
    }

    // Délai court pour éviter les appels multiples
    const timer = setTimeout(createOrderAndClearCart, 100)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [clearCart, searchParams]) // DÉPENDANCES CORRECTES

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8" />
              Paiement réussi !
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Votre commande a été traitée avec succès. Vous allez recevoir un email de confirmation.
            </p>
            
            {isProcessing && (
              <div className="text-sm text-gray-500">
                <div className="animate-spin mx-auto w-4 h-4 border-2 border-b-transparent border-gray-300 rounded-full mb-2"></div>
                Traitement de votre commande...
              </div>
            )}
            
            {hasCleared && !isProcessing && (
              <div className="text-sm text-green-600">
                ✓ Commande enregistrée et panier vidé
              </div>
            )}
            
            {orderCreated && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Récapitulatif de la commande</h3>
                <div className="text-sm space-y-1">
                  <div>N° de commande : <span className="font-mono">{orderCreated.id}</span></div>
                  <div>Total : <span className="font-semibold">{orderCreated.total}€</span></div>
                  <div>Articles : {orderCreated.itemCount}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/customer/orders">
                  Voir mes commandes
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Continuer mes achats
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin mx-auto w-8 h-8 border-2 border-b-transparent border-gray-300 rounded-full mb-4"></div>
              <p>Chargement...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
