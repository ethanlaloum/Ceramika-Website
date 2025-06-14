import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Début du seeding de la base de données...")

  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect()
    console.log("✅ Connexion à la base de données établie")

    // Nettoyer les données existantes dans l'ordre correct (à cause des relations)
    console.log("🧹 Suppression des données existantes...")

    await prisma.wishlistItem.deleteMany({})
    console.log("- Wishlist items supprimés")

    await prisma.orderItem.deleteMany({})
    console.log("- Order items supprimés")

    await prisma.order.deleteMany({})
    console.log("- Orders supprimées")

    await prisma.address.deleteMany({})
    console.log("- Adresses supprimées")

    await prisma.product.deleteMany({})
    console.log("- Produits supprimés")

    await prisma.collection.deleteMany({})
    console.log("- Collections supprimées")

    await prisma.artist.deleteMany({})
    console.log("- Artistes supprimés")

    await prisma.user.deleteMany({})
    console.log("- Utilisateurs supprimés")

    console.log("🧹 Données existantes supprimées avec succès")

    // Créer les artistes
    console.log("👨‍🎨 Création des artistes...")

    const elena = await prisma.artist.create({
      data: {
        name: "Elena Vasquez",
        email: "elena@ceramika.com",
        bio: "Elena combine les techniques céramiques traditionnelles du Sud-Ouest avec des sensibilités de design contemporain. Son travail reflète une profonde connexion avec la terre et les traditions ancestrales.",
        specialty: "Fusion Traditionnelle et Contemporaine",
        location: "Santa Fe, Nouveau-Mexique",
        experience: "15+ ans",
        image: "/placeholder.svg?height=400&width=400",
        featured: true,
        awards: [
          "Prix des Arts Céramiques du Sud-Ouest 2023",
          "Artiste Vedette - Ceramic Monthly",
          "Bourse d'Excellence Artisanale 2022",
        ],
      },
    })

    const marcus = await prisma.artist.create({
      data: {
        name: "Marcus Chen",
        email: "marcus@ceramika.com",
        bio: "Le travail de Marcus incarne les principes du minimalisme fonctionnel. Chaque pièce est conçue avec une attention méticuleuse aux détails et à l'utilité quotidienne.",
        specialty: "Design Minimaliste et Fonctionnel",
        location: "Portland, Oregon",
        experience: "12+ ans",
        image: "/placeholder.svg?height=400&width=400",
        featured: true,
        awards: [
          "Prix d'Excellence Céramique du Pacifique Nord-Ouest",
          "Prix d'Innovation Design 2022",
          "Mention Spéciale - Salon International de la Céramique",
        ],
      },
    })

    const sofia = await prisma.artist.create({
      data: {
        name: "Sofia Andersson",
        email: "sofia@ceramika.com",
        bio: "Sofia puise son inspiration dans le monde naturel, créant des pièces qui capturent l'essence organique des formes trouvées dans la nature.",
        specialty: "Céramiques Inspirées par la Nature",
        location: "Asheville, Caroline du Nord",
        experience: "18+ ans",
        image: "/placeholder.svg?height=400&width=400",
        featured: true,
        awards: ["Bourse de la Fondation Nationale des Arts Céramiques", "Prix de l'Innovation Écologique 2023"],
      },
    })

    const julien = await prisma.artist.create({
      data: {
        name: "Julien Moreau",
        email: "julien@ceramika.com",
        bio: "Artiste français spécialisé dans les techniques de glaçure innovantes. Julien explore les limites entre art et fonctionnalité.",
        specialty: "Techniques de Glaçure Avancées",
        location: "Lyon, France",
        experience: "10+ ans",
        image: "/placeholder.svg?height=400&width=400",
        featured: false,
        awards: ["Prix Jeune Talent Céramique France 2021", "Exposition Personnelle - Musée des Arts Décoratifs"],
      },
    })

    console.log("✅ Artistes créés avec succès")

    // Créer les collections
    console.log("🏛️ Création des collections...")

    const minimalist = await prisma.collection.create({
      data: {
        name: "Collection Minimaliste",
        description:
          "Des lignes épurées et une élégance subtile définissent cette collection contemporaine. Chaque pièce est conçue pour s'intégrer harmonieusement dans les intérieurs modernes.",
        image: "/placeholder.svg?height=500&width=800",
        featured: true,
        priceRange: "45€ - 280€",
        artistId: marcus.id,
      },
    })

    const rustic = await prisma.collection.create({
      data: {
        name: "Héritage Rustique",
        description:
          "Les techniques traditionnelles rencontrent l'attrait intemporel. Cette collection célèbre l'artisanat authentique et les méthodes ancestrales.",
        image: "/placeholder.svg?height=500&width=800",
        featured: true,
        priceRange: "65€ - 320€",
        artistId: elena.id,
      },
    })

    const nature = await prisma.collection.create({
      data: {
        name: "Inspiration Naturelle",
        description:
          "Formes organiques et textures inspirées de la nature. Chaque pièce raconte l'histoire des éléments naturels qui l'ont inspirée.",
        image: "/placeholder.svg?height=500&width=800",
        featured: true,
        priceRange: "55€ - 250€",
        artistId: sofia.id,
      },
    })

    const contemporary = await prisma.collection.create({
      data: {
        name: "Art Contemporain",
        description:
          "Exploration moderne des formes et des couleurs. Cette collection repousse les limites de la céramique traditionnelle.",
        image: "/placeholder.svg?height=500&width=800",
        featured: false,
        priceRange: "80€ - 450€",
        artistId: julien.id,
      },
    })

    console.log("✅ Collections créées avec succès")

    // Créer les produits
    console.log("🏺 Création des produits...")

    const products = [
      {
        name: "Ensemble de Bols Artisanaux",
        description:
          "Set de 4 bols en céramique faits à la main avec glaçure réactive unique. Parfait pour les repas en famille ou entre amis.",
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
      {
        name: "Assiettes Artisanales",
        description:
          "Set d'assiettes en céramique avec design contemporain. Élégance et fonctionnalité pour vos tables modernes.",
        price: 145,
        images: ["/images/handcrafted-dinner-plates.png"],
        inStock: true,
        stock: 8,
        featured: true,
        category: "Assiettes",
        features: [
          "Céramique de haute qualité",
          "Design contemporain",
          "Set de 6 assiettes",
          "Diamètre: 25 cm",
          "Finition mate élégante",
        ],
        artistId: marcus.id,
        collectionId: minimalist.id,
      },
      {
        name: "Plateau de Service Céramique",
        description: "Grand plateau de service parfait pour les occasions spéciales. Alliant beauté et praticité.",
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
          "Résistant aux taches",
        ],
        artistId: sofia.id,
        collectionId: nature.id,
      },
      {
        name: "Bol Vague Océanique",
        description: "Bol unique inspiré par les mouvements de l'océan. Forme organique et glaçure bleue apaisante.",
        price: 95,
        images: ["/images/ocean-wave-bowl.png"],
        inStock: true,
        stock: 15,
        featured: true,
        category: "Bols",
        features: [
          "Design inspiré de l'océan",
          "Glaçure bleue unique",
          "Forme ergonomique",
          "Diamètre: 18 cm",
          "Pièce unique",
        ],
        artistId: sofia.id,
        collectionId: nature.id,
      },
      {
        name: "Vase Minimaliste",
        description: "Vase aux lignes épurées, parfait pour mettre en valeur vos fleurs préférées.",
        price: 120,
        images: ["/images/minimalist-vase.png"],
        inStock: true,
        stock: 10,
        featured: false,
        category: "Vases",
        features: ["Design minimaliste", "Hauteur: 25 cm", "Ouverture optimisée", "Stable et élégant", "Finition mate"],
        artistId: marcus.id,
        collectionId: minimalist.id,
      },
      {
        name: "Set de Mugs Rustiques",
        description: "Ensemble de 2 mugs avec finition rustique authentique. Parfait pour vos moments cocooning.",
        price: 75,
        images: ["/images/rustic-mug-set.png"],
        inStock: true,
        stock: 20,
        featured: false,
        category: "Mugs",
        features: [
          "Set de 2 mugs",
          "Finition rustique",
          "Anse ergonomique",
          "Capacité: 350ml chacun",
          "Résistant à la chaleur",
        ],
        artistId: elena.id,
        collectionId: rustic.id,
      },
      {
        name: "Ensemble Mugs Céramique",
        description: "Collection de mugs modernes aux couleurs harmonieuses. Idéal pour débuter la journée.",
        price: 85,
        images: ["/images/ceramic-mug-set.png"],
        inStock: true,
        stock: 18,
        featured: false,
        category: "Mugs",
        features: [
          "Set de 4 mugs",
          "Couleurs assorties",
          "Design moderne",
          "Capacité: 300ml",
          "Compatible micro-ondes",
        ],
        artistId: julien.id,
        collectionId: contemporary.id,
      },
      {
        name: "Bol de Service Contemporain",
        description: "Grand bol de service aux lignes contemporaines. Parfait pour vos salades et accompagnements.",
        price: 135,
        images: ["/images/contemporary-serving-bowl.png"],
        inStock: true,
        stock: 7,
        featured: false,
        category: "Bols",
        features: [
          "Grande capacité",
          "Design contemporain",
          "Finition brillante",
          "Diamètre: 28 cm",
          "Facile d'entretien",
        ],
        artistId: julien.id,
        collectionId: contemporary.id,
      },
      {
        name: "Service Dîner Botanique",
        description: "Service complet avec motifs botaniques délicats. Élégance naturelle pour vos tables.",
        price: 320,
        originalPrice: 380,
        images: ["/images/botanical-dinner-set.png"],
        inStock: true,
        stock: 4,
        featured: true,
        category: "Services",
        features: [
          "Service pour 6 personnes",
          "Motifs botaniques peints à la main",
          "18 pièces au total",
          "Assiettes plates et creuses",
          "Emballage cadeau inclus",
        ],
        artistId: sofia.id,
        collectionId: nature.id,
      },
      {
        name: "Collection Terre et Feu",
        description: "Ensemble de pièces aux tons terreux, évoquant les éléments primaires de la céramique.",
        price: 280,
        images: ["/images/earth-fire-collection.png"],
        inStock: true,
        stock: 6,
        featured: true,
        category: "Collections",
        features: [
          "Tons terreux authentiques",
          "Techniques de cuisson traditionnelles",
          "Set de 8 pièces variées",
          "Chaque pièce est unique",
          "Certificat d'authenticité",
        ],
        artistId: elena.id,
        collectionId: rustic.id,
      },
    ]

    for (const [index, productData] of products.entries()) {
      await prisma.product.create({ data: productData })
      console.log(`- Produit ${index + 1}/${products.length} créé: ${productData.name}`)
    }

    console.log("✅ Produits créés avec succès")

    // Créer un utilisateur de test
    console.log("👤 Création de l'utilisateur de test...")

    const testUser = await prisma.user.create({
      data: {
        email: "test@ceramika.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGGUKxSrm", // password123
        firstName: "Test",
        lastName: "User",
        phone: "+33 1 23 45 67 89",
        role: "CUSTOMER",
      },
    })

    // Créer une adresse de test
    await prisma.address.create({
      data: {
        userId: testUser.id,
        firstName: "Test",
        lastName: "User",
        addressLine1: "123 Rue de la Céramique",
        city: "Paris",
        state: "Île-de-France",
        zipCode: "75001",
        country: "France",
        isDefault: true,
      },
    })

    // Créer quelques éléments de wishlist
    const firstProduct = await prisma.product.findFirst()
    if (firstProduct) {
      await prisma.wishlistItem.create({
        data: {
          userId: testUser.id,
          productId: firstProduct.id,
        },
      })
    }

    console.log("✅ Utilisateur de test créé avec succès")

    // Afficher un résumé
    const counts = {
      artists: await prisma.artist.count(),
      collections: await prisma.collection.count(),
      products: await prisma.product.count(),
      users: await prisma.user.count(),
    }

    console.log("\n🎉 Seeding terminé avec succès!")
    console.log("\n📊 Résumé des données créées:")
    console.log(`- ${counts.artists} artistes`)
    console.log(`- ${counts.collections} collections`)
    console.log(`- ${counts.products} produits`)
    console.log(`- ${counts.users} utilisateurs`)

    console.log("\n🔐 Compte de test créé:")
    console.log("Email: test@ceramika.com")
    console.log("Mot de passe: password123")
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Erreur fatale:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log("🔌 Connexion à la base de données fermée")
  })
