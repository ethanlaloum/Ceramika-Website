import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create Artists
  const elena = await prisma.artist.create({
    data: {
      name: "Elena Vasquez",
      email: "elena@ceramique.com",
      bio: "Elena combine les techniques céramiques traditionnelles du Sud-Ouest avec des sensibilités de design contemporain.",
      specialty: "Fusion Traditionnelle et Contemporaine",
      location: "Santa Fe, Nouveau-Mexique",
      experience: "15+ ans",
      image: "/placeholder.svg?height=400&width=400",
      featured: true,
      awards: ["Prix des Arts Céramiques du Sud-Ouest 2023", "Artiste Vedette - Ceramic Monthly"],
    },
  })

  const marcus = await prisma.artist.create({
    data: {
      name: "Marcus Chen",
      email: "marcus@ceramique.com",
      bio: "Le travail de Marcus incarne les principes du minimalisme fonctionnel.",
      specialty: "Design Minimaliste et Fonctionnel",
      location: "Portland, Oregon",
      experience: "12+ ans",
      image: "/placeholder.svg?height=400&width=400",
      featured: true,
      awards: ["Prix d'Excellence Céramique du Pacifique Nord-Ouest", "Prix d'Innovation Design 2022"],
    },
  })

  const sofia = await prisma.artist.create({
    data: {
      name: "Sofia Andersson",
      email: "sofia@ceramique.com",
      bio: "Sofia puise son inspiration dans le monde naturel.",
      specialty: "Céramiques Inspirées par la Nature",
      location: "Asheville, Caroline du Nord",
      experience: "18+ ans",
      image: "/placeholder.svg?height=400&width=400",
      featured: false,
      awards: ["Bourse de la Fondation Nationale des Arts Céramiques"],
    },
  })

  // Create Collections
  const minimalist = await prisma.collection.create({
    data: {
      name: "Collection Minimaliste",
      description: "Des lignes épurées et une élégance subtile définissent cette collection contemporaine.",
      image: "/placeholder.svg?height=500&width=800",
      featured: true,
      priceRange: "45€ - 280€",
    },
  })

  const rustic = await prisma.collection.create({
    data: {
      name: "Héritage Rustique",
      description: "Les techniques traditionnelles rencontrent l'attrait intemporel.",
      image: "/placeholder.svg?height=500&width=800",
      featured: false,
      priceRange: "65€ - 320€",
      artistId: elena.id,
    },
  })

  // Create Products
  await prisma.product.create({
    data: {
      name: "Ensemble de Bols Artisanaux",
      description: "Set de 4 bols en céramique faits à la main avec glaçure réactive unique.",
      price: 189,
      originalPrice: 220,
      images: ["/images/artisan-bowl-set.png"],
      inStock: true,
      stock: 12,
      featured: true,
      category: "Bols",
      features: [
        "Construction céramique faite à la main",
        "Glaçure réactive sans danger alimentaire",
        "Compatible lave-vaisselle et micro-ondes",
        "Set de 4 bols",
        "Diamètre: 20 cm, Hauteur: 7.5 cm",
      ],
      artistId: elena.id,
      collectionId: rustic.id,
    },
  })

  await prisma.product.create({
    data: {
      name: "Assiettes Artisanales",
      description: "Set d'assiettes en céramique avec design contemporain.",
      price: 145,
      images: ["/images/handcrafted-dinner-plates.png"],
      inStock: true,
      stock: 8,
      featured: true,
      category: "Assiettes",
      features: ["Céramique de haute qualité", "Design contemporain", "Set de 6 assiettes", "Diamètre: 25 cm"],
      artistId: marcus.id,
      collectionId: minimalist.id,
    },
  })

  await prisma.product.create({
    data: {
      name: "Plateau de Service Céramique",
      description: "Grand plateau de service parfait pour les occasions spéciales.",
      price: 225,
      images: ["/images/ceramic-serving-platter.png"],
      inStock: true,
      stock: 5,
      featured: true,
      category: "Plateaux",
      features: [
        "Grande taille pour service",
        "Finition artisanale",
        "Parfait pour les réceptions",
        "Dimensions: 35x25 cm",
      ],
      artistId: sofia.id,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
