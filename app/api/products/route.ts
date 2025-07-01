import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const artistId = searchParams.get("artistId")
    const collectionId = searchParams.get("collectionId")
    const limit = searchParams.get("limit") // Ajouter cette ligne

    const where: any = {}

    if (featured === "true") {
      where.featured = true
    }

    if (category) {
      where.category = category
    }

    if (artistId) {
      where.artistId = artistId
    }

    if (collectionId) {
      where.collectionId = collectionId
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        artist: true,
        collection: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit) : undefined, // Ajouter cette ligne
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      images,
      inStock,
      stock,
      featured,
      category,
      features,
      artistId,
      collectionId,
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        images,
        inStock,
        stock,
        featured,
        category,
        features,
        artistId,
        collectionId,
      },
      include: {
        artist: true,
        collection: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
