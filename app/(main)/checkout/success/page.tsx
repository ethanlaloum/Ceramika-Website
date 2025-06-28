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
        // Récupérer tous les paramètres disponibles pour debug
        const allParams = new URLSearchParams(window.location.search)
        console.log('🔍 Tous les paramètres URL:', Object.fromEntries(allParams.entries()))
        
        // Récupérer les paramètres du paiement - Polar utilise généralement ces noms
        const customerSessionToken = searchParams.get('customer_session_token')
        const checkoutSessionId = searchParams.get('checkout_session_id') || searchParams.get('session_id')
        const paymentIntentId = searchParams.get('payment_intent_id') || searchParams.get('pi')
        const checkoutId = searchParams.get('checkout_id')
        const userId = searchParams.get('userId') // Notre paramètre custom
        const tempProductId = searchParams.get('temp_product_id') // ID du produit temporaire
        
        console.log('📋 Paramètres de paiement détectés:', {
          customerSessionToken,
          checkoutSessionId,
          paymentIntentId,
          checkoutId,
          userId,
          tempProductId
        })
        
        // Essayer différents noms de paramètres pour l'ID checkout
        const actualCheckoutId = checkoutSessionId || paymentIntentId || checkoutId
        console.log('🎯 ID checkout final utilisé:', actualCheckoutId)
        
        // Si aucun ID checkout n'est disponible, utiliser un ID temporaire pour les tests
        const finalCheckoutId = actualCheckoutId || `temp-${Date.now()}-${userId}`
        console.log('🆔 ID checkout pour création de commande:', finalCheckoutId)
        
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
          console.log('✅ Commande créée avec succès:', orderData)
          setOrderCreated(orderData.order)
          setHasCleared(true)
          setIsProcessing(false)
          
          // Nettoyer le produit temporaire Polar si présent
          let productIdToClean = tempProductId
          
          // Si pas d'ID dans l'URL, essayer de le récupérer depuis les métadonnées de la commande
          if (!productIdToClean && orderData.metadata?.temp_product_id) {
            productIdToClean = orderData.metadata.temp_product_id
            console.log('🔍 ID produit temporaire récupéré depuis les métadonnées:', productIdToClean)
          }
          
          if (productIdToClean) {
            console.log('🗑️ Nettoyage du produit temporaire:', productIdToClean)
            try {
              const cleanupResponse = await fetch('/api/cleanup/temp-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: productIdToClean })
              })
              
              const cleanupResult = await cleanupResponse.json()
              if (cleanupResult.success) {
                console.log('✅ Produit temporaire supprimé avec succès')
              } else {
                console.warn('⚠️ Échec de suppression du produit temporaire:', cleanupResult)
              }
            } catch (error) {
              console.warn('⚠️ Erreur lors du nettoyage du produit temporaire:', error)
              // Ne pas faire échouer le processus pour ça
            }
          } else {
            console.log('ℹ️ Aucun ID de produit temporaire trouvé')
          }
          
          return
        } else {
          const errorData = await orderResponse.json()
          console.error('❌ Erreur lors de la création de commande:', {
            status: orderResponse.status,
            error: errorData
          })
        }

        // Méthode 2 : Fallback - vider le panier seulement
        const userIdFromUrl = searchParams.get('userId') || userId
        if (userIdFromUrl && isMounted) {
          console.log('🔄 Fallback: Tentative de vidage du panier pour userId:', userIdFromUrl)
          const response = await fetch('/api/cart/clear-by-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userIdFromUrl })
          })
          
          if (response.ok && isMounted) {
            console.log('✅ Panier vidé via fallback')
            setHasCleared(true)
            setIsProcessing(false)
            return
          } else {
            const errorData = await response.json()
            console.error('❌ Erreur lors du vidage du panier:', errorData)
          }
        }
        
        // Méthode 3 : Via le hook client
        if (isMounted) {
          await clearCart()
          setHasCleared(true)
          setIsProcessing(false)
        }
        
      } catch (error) {
        console.error('Erreur lors de la création de commande:', error)
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
  }, []) // DÉPENDANCES VIDES - execute UNE SEULE FOIS

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
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🔄 Création de votre commande en cours...
                </p>
              </div>
            )}
            
            {orderCreated && !isProcessing && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-2">
                  ✅ Commande créée avec succès !
                </p>
                <div className="text-xs text-green-700 space-y-1">
                  <p>• Numéro de commande : {orderCreated.id}</p>
                  <p>• Total : {orderCreated.total}€</p>
                  <p>• Articles : {orderCreated.itemCount}</p>
                  <p>• Statut : {orderCreated.status}</p>
                </div>
              </div>
            )}
            
            {hasCleared && !isProcessing && !orderCreated && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Paiement validé et panier vidé, mais commande non enregistrée
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/customer/dashboard">
                  Voir mes commandes
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">
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

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600 mx-auto"></div>
              <p className="mt-4 text-stone-600">Traitement de votre commande...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
