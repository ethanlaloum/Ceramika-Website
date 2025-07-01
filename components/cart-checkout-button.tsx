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

interface CartCheckoutButtonProps {
  total: number
  className?: string
  children?: React.ReactNode
}

export default function CartCheckoutButton({ 
  total,
  className,
  children 
}: CartCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMinOrderAlert, setShowMinOrderAlert] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    // Vérification du montant minimum
    if (total < ORDER_CONFIG.MINIMUM_AMOUNT) {
      setShowMinOrderAlert(true)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
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
        onClick={handleCheckout}
        disabled={isLoading}
        className={className}
        size="lg"
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
              Passer la commande - {total.toFixed(2)}€
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
