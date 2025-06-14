import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import Image from "next/image"
import type { Product } from "./types"

interface ViewProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function ViewProductDialog({ isOpen, onClose, product }: ViewProductDialogProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du Produit</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {product.images.length > 0 ? (
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-400">Pas d'image</span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-2xl">€{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">€{product.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Stock: {product.stock} unités</p>
                <p className="text-sm text-gray-600">Catégorie: {product.category || "Non définie"}</p>
                <p className="text-sm text-gray-600">Artiste: {product.artist.name}</p>
                {product.collection && <p className="text-sm text-gray-600">Collection: {product.collection.name}</p>}
              </div>
              {product.features.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Caractéristiques:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
