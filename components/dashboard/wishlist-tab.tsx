"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WishlistItem {
  id: string
  name: string
  artist: string
  price: number
  image: string
  inStock: boolean
}

interface WishlistTabProps {
  wishlist: WishlistItem[]
  onAddToCart: (item: WishlistItem) => void
  onRemoveFromWishlist: (id: string) => void
}

export function WishlistTab({ wishlist, onAddToCart, onRemoveFromWishlist }: WishlistTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-2">Ma Liste de Souhaits</h1>
        <p className="text-stone-600">Sauvegardez vos pièces céramiques préférées pour plus tard</p>
      </div>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-stone-600">Votre liste de souhaits est vide.</p>
            <Button asChild className="mt-4">
              <a href="/collections">Parcourir les Collections</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="group">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => onRemoveFromWishlist(item.id)}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                  {!item.inStock && <Badge className="absolute top-2 left-2 bg-red-500">Rupture de Stock</Badge>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 mb-1">{item.name}</h3>
                  <p className="text-stone-600 text-sm mb-2">par {item.artist}</p>
                  <p className="font-bold text-stone-800 mb-3">{item.price.toFixed(2)}€</p>
                  <Button
                    className="w-full"
                    disabled={!item.inStock}
                    variant={item.inStock ? "default" : "secondary"}
                    onClick={() => item.inStock && onAddToCart(item)}
                  >
                    {item.inStock ? "Ajouter au Panier" : "Notifier Quand Disponible"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
