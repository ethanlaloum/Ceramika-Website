import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: params.id,
      },
      include: {
        artist: true,
        products: {
          include: {
            artist: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection non trouvée" }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json({ error: "Erreur lors du chargement de la collection" }, { status: 500 })
  }
}
