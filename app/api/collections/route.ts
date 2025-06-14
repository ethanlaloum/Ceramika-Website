import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")

    // Amélioration : typage plus strict
    const where: { featured?: boolean } = {}

    if (featured === "true") {
      where.featured = true
    }

    const collections = await prisma.collection.findMany({
      where,
      include: {
        artist: true,
        products: {
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            artist: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}
