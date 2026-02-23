"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"

interface ProductDetailProps {
  product: any
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()

  if (!product) return <p>Produit introuvable</p>

  const mainImage = product.images && product.images.length > 0 ? product.images[selectedImage] : "/placeholder.svg"

  return (
    <div className="min-h-[60vh]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Images */}
          <div>
            <div className="w-full bg-white rounded-lg overflow-hidden border border-stone-200">
              <div className="relative w-full h-[560px] md:h-[520px] lg:h-[640px]">
                <Image src={mainImage} alt={product.name} fill={true} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 mt-4">
                {product.images.map((src: string, i: number) => (
                  <button
                    key={src + i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded overflow-hidden border ${i === selectedImage ? "border-stone-800" : "border-stone-200"}`}
                  >
                    <Image src={src} alt={`${product.name} ${i}`} width={80} height={80} className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="prose max-w-none">
            <h1 className="text-3xl font-playfair mb-2">{product.name}</h1>

            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-semibold">{product.price.toFixed(2)}€</span>
              {!product.inStock && <Badge variant="destructive">Rupture</Badge>}
            </div>

            {product.artist && (
              <p className="text-sm text-stone-600 mb-4">
                Par <Link href={`/artists/${product.artist.id}`} className="underline">{product.artist.name}</Link>
                {product.collection && (
                  <span> — Collection <Link href={`/collections/${product.collection.id}`} className="underline">{product.collection.name}</Link></span>
                )}
              </p>
            )}

            <div className="mb-6">
              <p className="text-stone-700">{product.description || "Aucune description fournie."}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <ul className="mb-6 list-disc pl-5 text-stone-700">
                {product.features.map((f: string, idx: number) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded overflow-hidden">
                <button className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <div className="px-4 py-2">{qty}</div>
                <button className="px-3 py-2" onClick={() => setQty(qty + 1)}>+</button>
              </div>

              <Button onClick={() => addToCart({ id: product.id, name: product.name, artist: product.artist?.name || "", price: product.price, image: product.images?.[0] || "", quantity: qty })}>
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
