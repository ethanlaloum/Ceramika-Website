"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductsHeaderProps {
  onAddProduct: () => void
}

export function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
        <p className="text-gray-600">Gérez votre catalogue de produits céramiques</p>
      </div>
      <Button className="bg-black hover:bg-gray-800" onClick={onAddProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un Produit
      </Button>
    </div>
  )
}
