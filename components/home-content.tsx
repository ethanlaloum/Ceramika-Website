"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Particles } from "@/components/magicui/particles"
import { useProducts } from "@/hooks/use-products"
import { ProductCardSkeleton } from "@/components/loading-states"
import { ErrorDisplay } from "@/components/error-boundary"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

export function HomeContent() {
  const { addToCart } = useCart()

  // Récupération des données depuis l'API
  const {
    products: featuredProducts,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({ limit: 3, featured: true })

  return (
    <div className="min-h-screen">
      {/* Hero Section with Particles and Gradient */}
      <section className="relative h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-radial from-white via-gray-100 to-black dark:from-black dark:via-gray-900 dark:to-white" />

        {/* Particles Effect */}
        <Particles className="absolute inset-0" quantity={150} ease={80} color="#666666" refresh={false} />

        {/* Content */}
        <div className="relative text-center max-w-4xl mx-auto px-4 z-10">
          <h1 className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-black via-gray-600 to-black dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
              CéramiKa
            </span>
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            Céramiques Artisanales
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Biscuits en céramique 100% Made In France fabriqués dans notre atelier à Vallauris, au cœur d'un territoire reconnu pour son savoir-faire artisanal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4"
              asChild
            >
              <Link href="/artists">Rencontrer nos Artistes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white dark:bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-3 sm:mb-4">
              Produits Vedettes
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Découvrez notre sélection de biscuits tendances !
            </p>
          </div>

          {productsError ? (
            <ErrorDisplay message={productsError} onRetry={refetchProducts} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {productsLoading
                ? Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
                : featuredProducts.map((product) => (
                    <Card key={product.id} className="group border-stone-200 dark:border-stone-700 hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white dark:bg-stone-800">
                      <CardContent className="p-0">
                        <Link href={`/products/${product.id}`} className="block">
                          <div className="relative overflow-hidden">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={500}
                              className="w-full h-96 sm:h-[28rem] md:h-[32rem] object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {product.featured && (
                              <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 animate-pulse text-xs sm:text-sm">
                                Vedette
                              </Badge>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-4 sm:p-6">
                            <h3 className="font-semibold text-base sm:text-lg text-stone-800 dark:text-stone-100 mb-2 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3">Par {product.artist.name}</p>
                          </div>
                        </Link>

                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg sm:text-xl text-stone-800 dark:text-stone-100">{formatPrice(product.price)}€</p>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <p className="text-sm text-stone-500 line-through">{formatPrice(product.originalPrice)}€</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  artist: product.artist.name,
                                  price: product.price,
                                  image: product.images[0],
                                  quantity: 1,
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 text-xs sm:text-sm px-3 sm:px-4"
                            >
                              Ajouter au Panier
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-6 sm:px-8"
            >
              <Link href="/products">Tous nos Produits</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
