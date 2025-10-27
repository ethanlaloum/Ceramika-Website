"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { Product } from "./types"

interface ViewProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function ViewProductDialog({ isOpen, onClose, product }: ViewProductDialogProps) {
  if (!product) return null

  const images = useMemo(
    () => (product.images || []).filter((src) => src && src.trim() !== ""),
    [product.images],
  )

  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    // Réinitialiser à la première image quand on ouvre/charge un nouveau produit
    setIndex(0)
  }, [product?.id, isOpen])

  const hasMultiple = images.length > 1

  const goPrev = () => {
    if (!hasMultiple) return
    setIndex((i) => (i - 1 + images.length) % images.length)
  }

  const goNext = () => {
    if (!hasMultiple) return
    setIndex((i) => (i + 1) % images.length)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!hasMultiple) return
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      goPrev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      goNext()
    }
  }

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!hasMultiple) return
    const startX = touchStartX.current
    const endX = e.changedTouches[0]?.clientX
    if (startX == null || endX == null) return
    const delta = endX - startX
    const threshold = 30 // px
    if (delta > threshold) {
      // swipe droite -> image précédente
      goPrev()
    } else if (delta < -threshold) {
      // swipe gauche -> image suivante
      goNext()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du Produit</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {images.length > 0 ? (
                <div
                  className="aspect-square relative rounded-lg overflow-hidden group"
                  role={hasMultiple ? "group" : undefined}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <Image
                    key={images[index]}
                    src={images[index] || "/placeholder.svg"}
                    alt={`${product.name} – image ${index + 1} sur ${images.length}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />

                  {hasMultiple && (
                    <>
                      {/* Boutons navigation */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="pointer-events-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white hover:bg-black/60"
                          onClick={goPrev}
                          aria-label="Image précédente"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="pointer-events-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white hover:bg-black/60"
                          onClick={goNext}
                          aria-label="Image suivante"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Indicateurs */}
                      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Aller à l'image ${i + 1}`}
                            className={
                              "h-1.5 w-1.5 rounded-full transition-colors " +
                              (i === index ? "bg-white" : "bg-white/50 hover:bg-white/70")
                            }
                          />
                        ))}
                      </div>
                    </>
                  )}
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
