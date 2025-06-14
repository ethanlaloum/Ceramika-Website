"use client"

import { Eye, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Product } from "./types"

interface ProductCardProps {
  product: Product
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProductCard({ product, onView, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        {product.images.length > 0 ? (
          <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Pas d'image</span>
            </div>
          </div>
        )}
        {product.featured && <Badge className="absolute top-2 left-2 bg-yellow-500">Vedette</Badge>}
        {!product.inStock && <Badge className="absolute top-2 right-2 bg-red-500">Rupture</Badge>}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">€{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={onView} title="Voir les détails">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit} title="Modifier">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                title="Supprimer"
                className="hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Par {product.artist.name}</span>
            {product.collection && (
              <Badge variant="outline" className="text-xs">
                {product.collection.name}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
