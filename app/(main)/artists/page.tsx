"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar } from "lucide-react"
import { FadeIn, Stagger, HoverScale } from "@/components/animations"
import { useArtists } from "@/hooks/use-artists"
import { ArtistCardSkeleton, FeaturedArtistCardSkeleton } from "@/components/artist-loading-states"
import { ErrorDisplay } from "@/components/error-boundary"
import { EmptyState } from "@/components/empty-states"
import { ArtistStatus } from "@/components/artist-status"

export default function ArtistsPage() {
  const { artists, loading, error, refetch } = useArtists()

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-900">
        <div className="container mx-auto px-4 py-16">
          <ErrorDisplay message={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Artistes céramistes au travail"
            fill
            className="object-cover opacity-30 dark:opacity-20"
          />
        </div>
        <div className="relative text-center max-w-4xl mx-auto px-4">
          <FadeIn>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-100 mb-4 sm:mb-6">
              {loading ? "Nos Artistes" : artists.length === 0 ? "Artistes" : "Nos Artistes"}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
              {loading 
                ? "Rencontrez les artisans talentueux qui donnent vie à l'argile avec leurs mains habiles et leur vision créative"
                : artists.length === 0 
                  ? "Découvrez l'art de la céramique et les talents qui le façonnent"
                  : "Rencontrez les artisans talentueux qui donnent vie à l'argile avec leurs mains habiles et leur vision créative"
              }
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Artists Content */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ArtistStatus count={artists.length} loading={loading} />
          
          {loading ? (
            <div>
              <div className="text-center mb-8">
                <div className="h-8 bg-stone-300 dark:bg-stone-600 rounded w-40 mx-auto animate-pulse"></div>
              </div>
              <Stagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ArtistCardSkeleton key={index} />
                ))}
              </Stagger>
            </div>
          ) : artists.length === 0 ? (
            // État vide - Aucun artiste disponible
            <EmptyState type="artists" />
          ) : (
            <div>
              <FadeIn>
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                    Nos Artistes
                  </h2>
                </div>
              </FadeIn>

              <Stagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {artists.map((artist) => (
                  <HoverScale key={artist.id} scale={1.02}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                      <Link href={`/artists/${artist.id}`}>
                        <CardContent className="p-0">
                          <div className="relative h-48 sm:h-56 md:h-64">
                            <Image
                              src={artist.image || "/placeholder.svg"}
                              alt={artist.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4 sm:p-6">
                            <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-800 dark:text-stone-100 mb-2 leading-tight">
                              {artist.name}
                            </h3>
                            
                            {artist.bio && (
                              <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                {artist.bio}
                              </p>
                            )}

                            {artist.collections && artist.collections.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {artist.collections.slice(0, 2).map((collection, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                                  >
                                    {collection.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </HoverScale>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Affiché seulement quand il y a des artistes */}
      {!loading && artists.length > 0 && (
        <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-800">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Intéressé à devenir un Artiste Partenaire ?
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-stone-600 dark:text-stone-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Nous recherchons toujours des artistes céramistes talentueux pour rejoindre notre communauté. 
                Partagez votre travail avec des passionnés de céramique du monde entier.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <Button asChild size="lg" className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                <Link href="/contact">
                  Postuler pour Rejoindre
                </Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Section alternative quand pas d'artistes - Invitation à découvrir */}
      {!loading && artists.length === 0 && (
        <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <FadeIn>
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                    Découvrez Notre Collection
                  </h2>
                  <p className="text-stone-600 dark:text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                    Même sans artistes partenaires actuellement présentés, notre boutique propose une sélection 
                    de magnifiques pièces céramiques créées par des artisans talentueux.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                      <Link href="/products">
                        Voir Tous les Produits
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-stone-300 dark:border-stone-600">
                      <Link href="/contact">
                        Devenir Artiste Partenaire
                      </Link>
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
