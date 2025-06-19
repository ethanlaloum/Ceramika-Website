"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"
import { FadeIn, Stagger, HoverScale } from "@/components/animations"

export default function ArtistsPage() {

  const artists = [
    {
      id: 1,
      name: "Elena Vasquez",
      specialty: "Fusion Traditionnelle et Contemporaine",
      location: "Santa Fe, Nouveau-Mexique",
      experience: "15+ ans",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Elena combine les techniques céramiques traditionnelles du Sud-Ouest avec des sensibilités de design contemporain. Son travail a été présenté dans des galeries à travers les États-Unis.",
      collections: ["Héritage Rustique", "Floraison du Désert"],
      awards: ["Prix des Arts Céramiques du Sud-Ouest 2023", "Artiste Vedette - Ceramic Monthly"],
      featured: true,
    },
    {
      id: 2,
      name: "Marcus Chen",
      specialty: "Design Minimaliste et Fonctionnel",
      location: "Portland, Oregon",
      experience: "12+ ans",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Le travail de Marcus incarne les principes du minimalisme fonctionnel. Chaque pièce est conçue pour améliorer les rituels quotidiens tout en maintenant la pureté esthétique.",
      collections: ["Formes Contemporaines", "Collection Minimaliste"],
      awards: ["Prix d'Excellence Céramique du Pacifique Nord-Ouest", "Prix d'Innovation Design 2022"],
      featured: true,
    },
    {
      id: 3,
      name: "Sofia Andersson",
      specialty: "Céramiques Inspirées par la Nature",
      location: "Asheville, Caroline du Nord",
      experience: "18+ ans",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Sofia puise son inspiration dans le monde naturel, créant des pièces qui capturent la beauté organique des forêts, montagnes et eaux courantes.",
      collections: ["Inspiration Océanique", "Série Botanique"],
      awards: ["Bourse de la Fondation Nationale des Arts Céramiques", "Prix d'Excellence Artisanale des Appalaches"],
      featured: false,
    },
    {
      id: 4,
      name: "David Kim",
      specialty: "Techniques de Glaçage Expérimentales",
      location: "Berkeley, Californie",
      experience: "20+ ans",
      image: "/placeholder.svg?height=400&width=400",
      bio: "David repousse les limites de l'art céramique grâce à des techniques de glaçage innovantes et des méthodes de cuisson expérimentales qui créent des effets de surface uniques.",
      collections: ["Terre et Feu", "Série Expérimentale"],
      awards: ["Prix d'Innovation des Arts Céramiques de Californie", "Reconnaissance de Maître Artisan"],
      featured: true,
    },
    {
      id: 5,
      name: "Maria Santos",
      specialty: "Formes Botaniques et Organiques",
      location: "Taos, Nouveau-Mexique",
      experience: "14+ ans",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Le toucher délicat de Maria donne vie aux formes botaniques dans l'argile. Ses pièces célèbrent les motifs et textures complexes trouvés dans la nature.",
      collections: ["Série Botanique", "Collection Jardin"],
      awards: ["Prix des Arts Botaniques du Sud-Ouest", "Pleins Feux Artiste Émergent 2021"],
      featured: false,
    },
    {
      id: 6,
      name: "James Wright",
      specialty: "Céramiques Architecturales",
      location: "Seattle, Washington",
      experience: "16+ ans",
      image: "/placeholder.svg?height=400&width=400",
      bio: "James crée des formes architecturales audacieuses qui défient les notions traditionnelles des récipients céramiques. Son travail fait le pont entre l'art et la fonction.",
      collections: ["Formes Architecturales", "Paysage Urbain"],
      awards: ["Prix des Arts Céramiques du Pacifique", "Excellence en Céramiques Architecturales"],
      featured: false,
    },
  ]

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
              Nos Artistes
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Rencontrez les artisans talentueux qui donnent vie à l'argile avec leurs mains habiles et leur vision créative
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-3 sm:mb-4">
                Artistes Vedettes
              </h2>
              <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Artistes Vedettes
              </p>
            </div>
          </FadeIn>

          <Stagger
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
          >
            {artists
              .filter((artist) => artist.featured)
              .map((artist) => (
                <HoverScale key={artist.id} scale={1.02}>
                  <Card className="group cursor-pointer hover:shadow-xl transition-shadow overflow-hidden bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                    <Link href={`/artists/${artist.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <CardContent className="p-0">
                        <div className="relative h-64 sm:h-72 md:h-80">
                          <Image
                            src={artist.image || "/placeholder.svg"}
                            alt={artist.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-xs sm:text-sm">
                            Vedette
                          </Badge>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2 leading-tight">
                            {artist.name}
                          </h3>
                          <p className="text-stone-600 dark:text-stone-300 font-medium mb-3 text-sm sm:text-base">
                            {artist.specialty}
                          </p>

                          <div className="flex items-center text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-2 sm:mb-3">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{artist.location}</span>
                          </div>

                          <div className="flex items-center text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-3 sm:mb-4">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span>{artist.experience}</span>
                          </div>

                          <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                            {artist.bio}
                          </p>

                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {artist.collections.slice(0, 2).map((collection, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                              >
                                {collection}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </HoverScale>
              ))}
          </Stagger>

          {/* All Artists */}
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Tous les Artistes
              </h2>
            </div>
          </FadeIn>

          <Stagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {artists.map((artist) => (
              <HoverScale key={artist.id} scale={1.02}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  <Link href={`/artists/${artist.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <CardContent className="p-0">
                      <div className="relative h-48 sm:h-56 md:h-64">
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {artist.featured && (
                          <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-xs sm:text-sm">
                            Vedette
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-800 dark:text-stone-100 mb-1 leading-tight">
                          {artist.name}
                        </h3>
                        <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm mb-2 line-clamp-2">
                          {artist.specialty}
                        </p>

                        <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 mb-2">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{artist.location}</span>
                        </div>

                        <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 mb-3">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{artist.experience}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {artist.collections.slice(0, 2).map((collection, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                            >
                              {collection}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </HoverScale>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 bg-stone-50 dark:bg-stone-800">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              Intéressé à devenir un Artiste Partenaire ?
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-stone-600 dark:text-stone-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Nous recherchons toujours des artistes céramistes talentueux pour rejoindre notre communauté. Partagez votre travail avec des passionnés de céramique du monde entier.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-all duration-300 hover:scale-105"
            >
              Postuler pour Rejoindre
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
