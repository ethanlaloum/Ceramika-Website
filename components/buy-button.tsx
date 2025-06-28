import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

  const handlePurchase = async () => {
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
  )
}