"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { Loader2, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PolarCheckoutModal() {
  const { user } = useAuth()
  const { items, total } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

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

    setLoading(true)
    
    try {
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
      setCheckoutUrl(checkoutUrl)
      setIsOpen(true)
      
    } catch (error) {
      console.error('Erreur checkout:', error)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
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
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Procéder au paiement ({total.toFixed(2)}€)
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Finaliser votre commande</DialogTitle>
          <DialogDescription>
            Paiement sécurisé via Polar & Stripe
          </DialogDescription>
        </DialogHeader>
        
        {checkoutUrl && (
          <div className="flex-1 px-6 pb-6">
            <iframe
              src={checkoutUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Checkout Polar"
              allow="payment"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
