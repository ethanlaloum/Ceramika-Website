"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    artist: {
      name: string
    }
  }
}

interface CartTotals {
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

// Définir une interface pour le produit complet
interface ProductToAdd {
  id: string
  name: string
  artist: string
  price: number
  image: string
  quantity: number
}

export function useCart() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [totals, setTotals] = useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Charger le panier
  const fetchCart = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        
        // Calculer le nombre total d'articles
        const itemCount = data.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        
        // Calculer les frais de livraison (0.40€ par article)
        const shippingCost = itemCount * 0.40;
        
        setItems(data.items)
        setTotals({
          subtotal: data.subtotal,
          tax: 0, // TVA à 0 comme demandé
          shipping: shippingCost, // 40 centimes par pièce
          total: data.subtotal + shippingCost, // Total = sous-total + livraison (sans TVA)
          itemCount: itemCount,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le panier",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Ajouter au panier
  const addToCart = async (productIdOrProduct: string | ProductToAdd, quantity = 1) => {
    if (!session?.user?.id) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      })
      return
    }

    try {
      // Déterminer si l'argument est un ID ou un objet produit
      let productId: string
      let qty: number = 1
      
      if (typeof productIdOrProduct === 'string') {
        productId = productIdOrProduct
        qty = quantity
      } else {
        productId = productIdOrProduct.id
        qty = productIdOrProduct.quantity || 1
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      })

      if (response.ok) {
        await fetchCart()
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté à votre panier",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      })
    }
  }

  // Mettre à jour la quantité
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      })
    }
  }

  // Supprimer du panier
  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCart()
        toast({
          title: "Produit supprimé",
          description: "Le produit a été retiré de votre panier",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      })
    }
  }

  // Vider le panier complètement
  const clearCart = async () => {
    try {
      // Appel à l'API pour vider tout le panier
      const response = await fetch("/api/cart", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      
      if (response.ok) {
        // Mettre à jour l'état local immédiatement
        setItems([])
        setTotals({
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          itemCount: 0,
        })
        
        // Forcer un refresh pour être sûr
        await fetchCart()
        
        toast({
          title: "Panier vidé",
          description: "Votre panier a été vidé avec succès",
        })
      } else {
        throw new Error('Échec de la suppression')
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCart()
  }, [session])

  return {
    items,
    ...totals,
    loading,
    isOpen,
    setIsOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  }
}
