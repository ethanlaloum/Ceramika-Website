"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { useToast } from "@/hooks/use-toast"
import type { Artist, Collection, ProductFormData } from "./types"

interface AddProductDialogProps {
  isOpen: boolean
  onClose: () => void
  artists: Artist[]
  collections: Collection[]
  onSuccess: () => void
}

export function AddProductDialog({ isOpen, onClose, artists, collections, onSuccess }: AddProductDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialFormData: ProductFormData = {
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
    category: "",
    features: "",
    artistId: "",
    collectionId: "",
    images: [],
  }

  const handleSubmit = async (formData: ProductFormData) => {
    if (!formData.name || !formData.artistId) {
      toast({
        title: "Erreur",
        description: "Le nom du produit et l'artiste sont obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: formData.features
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f),
          originalPrice: formData.originalPrice || null,
          collectionId: formData.collectionId || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit ajouté avec succès",
        })
        onClose()
        onSuccess()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'ajout")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le produit",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
        </DialogHeader>
        <ProductForm
          initialData={initialFormData}
          artists={artists}
          collections={collections}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Ajouter le Produit"
        />
      </DialogContent>
    </Dialog>
  )
}
