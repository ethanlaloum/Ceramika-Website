import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")

    const where: any = {}

    if (featured === "true") {
      where.featured = true
    }

    const artists = await prisma.artist.findMany({
      where,
      include: {
        products: {
          take: 3,      orderBy: {
        name: "asc",
      },
        },
        collections: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(artists)
  } catch (error) {
    console.error("Error fetching artists:", error)
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, bio, image } = body

    const artist = await prisma.artist.create({
      data: {
        name,
        bio,
        image,
      },
    })

    return NextResponse.json(artist, { status: 201 })
  } catch (error) {
    console.error("Error creating artist:", error)
    return NextResponse.json({ error: "Failed to create artist" }, { status: 500 })
  }
}
