import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
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

interface BuyButtonProps {
  productId: string
  price: number
  currency?: string
  className?: string
  children?: React.ReactNode
}

export default function BuyButton({ 
  productId, 
  price, 
  currency = 'EUR',
  className,
  children 
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMinOrderAlert, setShowMinOrderAlert] = useState(false)
  const { toast } = useToast()

  const handlePurchase = async () => {
    // Vérification du montant minimum
    if (price < ORDER_CONFIG.MINIMUM_AMOUNT) {
      setShowMinOrderAlert(true)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du checkout')
      }

      const { checkoutUrl } = await response.json()
      
      // Redirection vers la page de paiement Polar
      window.location.href = checkoutUrl
      
    } catch (error) {
      console.error('Erreur:', error)
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
    <>
      <Button 
        onClick={handlePurchase}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redirection...
          </>
        ) : (
          children || (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Acheter - {price}€
            </>
          )
        )}
      </Button>

      <AlertDialog open={showMinOrderAlert} onOpenChange={setShowMinOrderAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Commande minimum requise</AlertDialogTitle>
            <AlertDialogDescription>
              Le montant minimum de commande est de <strong>{ORDER_CONFIG.MINIMUM_AMOUNT}€</strong>.
              <br />
              Ce produit coûte <strong>{price}€</strong>.
              <br />
              <br />
              Veuillez ajouter ce produit à votre panier et compléter avec d'autres articles pour atteindre le montant minimum de commande.
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