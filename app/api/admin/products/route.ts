import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth" // Modifié: importer auth au lieu de authOptions et getServerSession
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth() // Modifié: utiliser auth() directement

    if (!session || session.user?.role !== "ADMIN") { // Ajout de l'opérateur optionnel ?.
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth() // Modifié: utiliser auth() directement

    if (!session || session.user?.role !== "ADMIN") { // Ajout de l'opérateur optionnel ?.
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      category,
      features,
      artistId,
      collectionId,
      images = [],
    } = body

    // Validation
    if (!name || !artistId || price === undefined || stock === undefined) {
      return NextResponse.json(
        {
          error: "Les champs nom, artiste, prix et stock sont obligatoires",
        },
        { status: 400 },
      )
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json(
        {
          error: "Le prix et le stock doivent être positifs",
        },
        { status: 400 },
      )
    }

    // Vérifier que l'artiste existe
    const artistExists = await prisma.artist.findUnique({
      where: { id: artistId },
    })

    if (!artistExists) {
      return NextResponse.json(
        {
          error: "L'artiste sélectionné n'existe pas",
        },
        { status: 400 },
      )
    }

    // Vérifier que la collection existe (si fournie)
    if (collectionId) {
      const collectionExists = await prisma.collection.findUnique({
        where: { id: collectionId },
      })

      if (!collectionExists) {
        return NextResponse.json(
          {
            error: "La collection sélectionnée n'existe pas",
          },
          { status: 400 },
        )
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        originalPrice: originalPrice || null,
        stock,
        inStock: stock > 0,
        category: category || null,
        features: features || [],
        images: images || [],
        artistId,
        collectionId: collectionId || null,
        featured: false,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}
