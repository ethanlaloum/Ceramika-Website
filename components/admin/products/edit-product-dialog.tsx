"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { useToast } from "@/hooks/use-toast"
import type { Product, Artist, Collection, ProductFormData } from "./types"

interface EditProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  artists: Artist[]
  collections: Collection[]
  onSuccess: () => void
}

export function EditProductDialog({
  isOpen,
  onClose,
  product,
  artists,
  collections,
  onSuccess,
}: EditProductDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData | null>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        originalPrice: product.originalPrice || 0,
        stock: product.stock,
        category: product.category || "",
        features: product.features.join(", "),
        artistId: product.artist.id,
        collectionId: product.collection?.id || "",
        images: product.images,
      })
    }
  }, [product])

  const handleSubmit = async (formData: ProductFormData) => {
    if (!product || !formData.name || !formData.artistId) {
      toast({
        title: "Erreur",
        description: "Le nom du produit et l'artiste sont obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
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
          description: "Produit modifié avec succès",
        })
        onClose()
        onSuccess()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la modification")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de modifier le produit",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Produit</DialogTitle>
        </DialogHeader>
        <ProductForm
          initialData={formData}
          artists={artists}
          collections={collections}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Modifier le Produit"
        />
      </DialogContent>
    </Dialog>
  )
}
