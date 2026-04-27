import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [showMinOrderAlert, setShowMinOrderAlert] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = () => {
    // Vérification du montant minimum
    if (total < ORDER_CONFIG.MINIMUM_AMOUNT) {
      setShowMinOrderAlert(true)
      return
    }
    
    router.push('/checkout')
  }

  return (
    <>
      <Button 
        onClick={handleCheckout}
        className={className}
        size="lg"
      >
        {children || (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Passer la commande {total.toFixed(2)} €
          </>
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
