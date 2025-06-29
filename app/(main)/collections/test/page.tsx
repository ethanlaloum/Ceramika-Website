"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, Stagger, HoverScale } from "@/components/animations"
import { CollectionCardSkeleton } from "@/components/loading-states"
import { EmptyState, UpcomingPreview } from "@/components/empty-states"

// Données de test pour simuler des collections
const mockCollections = [
  {
    id: "1",
    name: "Collection Terre & Mer",
    description: "Une exploration poétique de l'union entre la terre et l'océan, où chaque pièce capture l'essence des éléments naturels.",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    artist: {
      id: "1",
      name: "Marie Dubois"
    }
  },
  {
    id: "2", 
    name: "Éléments Bruts",
    description: "Des formes organiques qui célèbrent la beauté brute de l'argile, dans sa forme la plus authentique et expressive.",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    artist: {
      id: "2",
      name: "Pierre Martin"
    }
  }
]

export default function CollectionsTestPage() {
  const [showCollections, setShowCollections] = useState(false)
  const [loading, setLoading] = useState(false)

  const collections = showCollections ? mockCollections : []
  const error = null

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 transition-colors duration-300">
      {/* Controls de test */}
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 text-center">
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => setShowCollections(!showCollections)}
            variant={showCollections ? "default" : "outline"}
          >
            {showCollections ? "Masquer" : "Afficher"} Collections
          </Button>
          <Button onClick={toggleLoading} variant="outline">
            Test Loading
          </Button>
        </div>
        <p className="text-sm mt-2 text-yellow-800 dark:text-yellow-200">
          État actuel: {loading ? "Chargement" : showCollections ? `${collections.length} collections` : "Aucune collection"}
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Exposition de collections céramiques"
            fill
            className="object-cover opacity-30 dark:opacity-20"
          />
        </div>
        <div className="relative text-center max-w-4xl mx-auto px-4">
          <FadeIn>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-100 mb-4 sm:mb-6">
              Nos Collections - Test
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Page de test pour les différents états des collections
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <Stagger staggerDelay={0.1} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <CollectionCardSkeleton key={index} />
              ))}
            </Stagger>
          ) : collections.length === 0 ? (
            // État vide - Aucune collection disponible
            <EmptyState type="collections" />
          ) : (
            // Collections disponibles
            <Stagger staggerDelay={0.1} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {collections.map((collection) => (
                <HoverScale key={collection.id} scale={1.02}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                    <Link href={`/collections/${collection.id}`}>
                      <CardContent className="p-0">
                        <div className="relative h-64 sm:h-72 md:h-80">
                          <Image
                            src={collection.image || "/placeholder.svg"}
                            alt={collection.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                          {/* Badges */}
                          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-2">
                            {collection.featured && (
                              <Badge className="bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-xs sm:text-sm">
                                Vedette
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className="bg-white/90 dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 border-white dark:border-stone-600 text-xs sm:text-sm"
                            >
                              5 pièces
                            </Badge>
                          </div>

                          {/* Collection Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 text-white">
                            <h3 className="font-playfair text-xl sm:text-2xl font-bold mb-1 sm:mb-2 leading-tight">
                              {collection.name}
                            </h3>
                            {collection.artist && (
                              <p className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">
                                Par {collection.artist.name}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm font-medium">À partir de 45€</p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6">
                          <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
                            {collection.description}
                          </p>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </HoverScale>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Call to Action - Affiché seulement quand il y a des collections */}
      {!loading && collections.length > 0 && (
        <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-800">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-stone-600 dark:text-stone-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Nos artistes peuvent créer des pièces sur mesure selon vos besoins et préférences
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <Button asChild size="lg" className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                <Link href="/contact">
                  Commander une Pièce Personnalisée
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Section alternative quand pas de collections - Newsletter et nouveautés */}
      {!loading && collections.length === 0 && (
        <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <FadeIn>
                  <div>
                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                      Restez Informé des Nouveautés
                    </h2>
                    <p className="text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
                      Soyez le premier à découvrir nos nouvelles collections et pièces exceptionnelles. 
                      Inscrivez-vous à notre newsletter pour recevoir les dernières actualités de nos artistes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                        <Link href="/contact">
                          S'inscrire à la Newsletter
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="border-stone-300 dark:border-stone-600">
                        <Link href="/new-arrivals">
                          Voir les Nouveautés
                        </Link>
                      </Button>
                    </div>
                  </div>
                </FadeIn>
                
                <UpcomingPreview />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
