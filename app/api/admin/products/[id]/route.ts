import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Correction pour Next.js 15 : params est maintenant une Promise
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Await params pour Next.js 15
    const { id } = await context.params

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

    // Vérifier que le produit existe
    const productExists = await prisma.product.findUnique({
      where: { id: id },
    })

    if (!productExists) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
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

    const product = await prisma.product.update({
      where: { id: id },
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

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Await params pour Next.js 15
    const { id } = await params

    // Vérifier que le produit existe
    const productExists = await prisma.product.findUnique({
      where: { id: id },
    })

    if (!productExists) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Supprimer le produit
    await prisma.product.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 })
  }
}
