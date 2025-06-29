"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Artist, Collection, ProductFormData } from "./types"

interface ProductFormProps {
  initialData: ProductFormData
  artists: Artist[]
  collections: Collection[]
  onSubmit: (data: ProductFormData) => void
  isSubmitting: boolean
  submitLabel: string
}

export function ProductForm({
  initialData,
  artists,
  collections,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nom du produit *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom du produit"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Catégorie"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description détaillée du produit..."
          rows={4}
          className="min-h-[100px] resize-y"
        />
        <p className="text-xs text-muted-foreground">
          Décrivez les caractéristiques, matériaux et particularités de ce produit.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">Prix (€) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="Prix"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice" className="text-sm font-medium">Prix original (€)</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
            placeholder="Prix original"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-sm font-medium">Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            placeholder="Quantité en stock"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="artist" className="text-sm font-medium">Artiste *</Label>
          <Select
            value={formData.artistId}
            onValueChange={(value) => setFormData({ ...formData, artistId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un artiste" />
            </SelectTrigger>
            <SelectContent>
              {artists.length > 0 ? (
                artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-artist" disabled>
                  Aucun artiste disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection" className="text-sm font-medium">Collection (optionnel)</Label>
          <Select
            value={formData.collectionId}
            onValueChange={(value) => setFormData({ ...formData, collectionId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-collection">Aucune collection</SelectItem>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features" className="text-sm font-medium">Caractéristiques (séparées par des virgules)</Label>
        <Input
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="Fait main, Résistant au lave-vaisselle, etc."
        />
        <p className="text-xs text-muted-foreground">
          Listez les caractéristiques importantes séparées par des virgules.
        </p>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "En cours..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
