"use client"

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ORDER_CONFIG } from '@/lib/constants'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function PolarCheckoutButton() {
  const { user } = useAuth()
  const { items, total } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showMinOrderAlert, setShowMinOrderAlert] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour finaliser votre achat",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier avant de procéder au paiement",
        variant: "destructive",
      })
      return
    }

    // Vérification du montant minimum
    if (total < ORDER_CONFIG.MINIMUM_AMOUNT) {
      setShowMinOrderAlert(true)
      return
    }

    setLoading(true)
    
    try {
      // Créer le checkout et rediriger directement vers l'URL de paiement externe
      const response = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
          customerEmail: user.email,
          customerName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.email || '',
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du checkout')
      }

      const { checkoutUrl } = await response.json()
      
      // Redirection directe vers la page de paiement externe
      window.location.href = checkoutUrl
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={handleCheckout} 
        disabled={loading || items.length === 0}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Chargement...
          </>
        ) : (
          'Procéder au paiement'
        )}
      </Button>

      <AlertDialog open={showMinOrderAlert} onOpenChange={setShowMinOrderAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Commande minimum requise</AlertDialogTitle>
            <AlertDialogDescription>
              Le montant minimum de commande est de <strong>{ORDER_CONFIG.MINIMUM_AMOUNT}€</strong>.
              <br />
              Votre panier actuel est de <strong>{total.toFixed(2)}€</strong>.
              <br />
              <br />
              Veuillez ajouter pour <strong>{(ORDER_CONFIG.MINIMUM_AMOUNT - total).toFixed(2)}€</strong> d'articles supplémentaires pour pouvoir passer votre commande.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowMinOrderAlert(false)}>
              J'ai compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
