"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn, Stagger, HoverScale, Magnetic, Reveal } from "@/components/animations"
import { Particles } from "@/components/magicui/particles"
import { useCart } from "@/components/providers"
import { useProducts } from "@/hooks/use-products"
import { useCollections } from "@/hooks/use-collections"
import { ProductCardSkeleton, CollectionCardSkeleton } from "@/components/loading-states"
import { ErrorDisplay } from "@/components/error-boundary"

export function HomeContent() {
  const { addItem } = useCart()

  // Récupération des données depuis l'API
  const {
    products: featuredProducts,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({ limit: 3 }) // ajouter featured: true plus tard

  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
    refetch: refetchCollections,
  } = useCollections({ featured: true, limit: 3 })

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Particles and Gradient */}
      <section className="relative h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-radial from-white via-gray-100 to-black dark:from-black dark:via-gray-900 dark:to-white" />

        {/* Particles Effect */}
        <Particles className="absolute inset-0" quantity={150} ease={80} color="#666666" refresh={false} />

        {/* Content */}
        <div className="relative text-center max-w-4xl mx-auto px-4 z-10">
          <FadeIn delay={0.2}>
            <h1 className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-black via-gray-600 to-black dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
                Ceramika
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Céramiques Artisanales
            </h2>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Découvrez des ustensiles en céramique faits à la main qui transforment vos repas quotidiens en expérience
              artistique
            </p>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Magnetic>
                <Button
                  size="lg"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4"
                  asChild
                >
                  <Link href="/collections">Explorer les Collections</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-white dark:hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4"
                  asChild
                >
                  <Link href="/artists">Rencontrer nos Artistes</Link>
                </Button>
              </Magnetic>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white dark:bg-stone-900">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-3 sm:mb-4">
                Produits Vedettes
              </h2>
              <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Découvrez notre sélection de pièces exceptionnelles, créées par nos artistes les plus talentueux
              </p>
            </div>
          </FadeIn>

          {productsError ? (
            <ErrorDisplay message={productsError} onRetry={refetchProducts} />
          ) : (
            <Stagger staggerDelay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {productsLoading
                ? Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
                : featuredProducts.map((product) => (
                    <HoverScale key={product.id} scale={1.03}>
                      <Card className="group cursor-pointer border-stone-200 dark:border-stone-700 hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white dark:bg-stone-800">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
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
                            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3">
                              Par {product.artist.name}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-lg sm:text-xl text-stone-800 dark:text-stone-100">
                                  {product.price}€
                                </p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <p className="text-sm text-stone-500 line-through">{product.originalPrice}€</p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() =>
                                  addItem({
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
                    </HoverScale>
                  ))}
            </Stagger>
          )}

          <FadeIn delay={0.8}>
            <div className="text-center mt-8 sm:mt-12">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-6 sm:px-8"
              >
                <Link href="/products">Voir Tous les Produits</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-800">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-3 sm:mb-4">
                Nos Collections
              </h2>
              <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Explorez nos collections uniques, chacune racontant une histoire différente à travers l'art de la
                céramique
              </p>
            </div>
          </FadeIn>

          {collectionsError ? (
            <ErrorDisplay message={collectionsError} onRetry={refetchCollections} />
          ) : (
            <Stagger staggerDelay={0.3} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {collectionsLoading
                ? Array.from({ length: 3 }).map((_, index) => <CollectionCardSkeleton key={index} />)
                : collections.map((collection) => (
                    <Reveal key={collection.id}>
                      <HoverScale scale={1.02}>
                        <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700">
                          <Link href={`/collections/${collection.id}`}>
                            <CardContent className="p-0">
                              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                                <Image
                                  src={collection.image || "/placeholder.svg"}
                                  alt={collection.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold mb-1 leading-tight">
                                    {collection.name}
                                  </h3>
                                  <p className="text-xs sm:text-sm opacity-90">
                                    {collection._count?.products || 0} pièces
                                  </p>
                                </div>
                              </div>
                              <div className="p-4 sm:p-6">
                                <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                                  {collection.description}
                                </p>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      </HoverScale>
                    </Reveal>
                  ))}
            </Stagger>
          )}

          <FadeIn delay={1}>
            <div className="text-center mt-8 sm:mt-12">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-6 sm:px-8"
              >
                <Link href="/collections">Explorer Toutes les Collections</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Artist Spotlight */}
      <section className="py-12 sm:py-16 bg-white dark:bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4 sm:mb-6 leading-tight">
                  Nos Artistes
                </h2>
                <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg mb-6 leading-relaxed">
                  Rencontrez les artisans talentueux qui donnent vie à chaque pièce avec passion et savoir-faire
                  traditionnel
                </p>
                <Magnetic>
                  <Button
                    size="lg"
                    asChild
                    className="hover:scale-105 transition-transform duration-300 text-sm sm:text-base px-6 sm:px-8"
                  >
                    <Link href="/artists">Découvrir les Artistes</Link>
                  </Button>
                </Magnetic>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.3}>
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Artiste céramiste au travail"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
