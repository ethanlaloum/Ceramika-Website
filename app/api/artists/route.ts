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
          take: 3,
          orderBy: {
            createdAt: "desc",
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
        createdAt: "desc",
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
    const { name, email, bio, specialty, location, experience, image, featured, awards } = body

    const artist = await prisma.artist.create({
      data: {
        name,
        email,
        bio,
        specialty,
        location,
        experience,
        image,
        featured,
        awards,
      },
    })

    return NextResponse.json(artist, { status: 201 })
  } catch (error) {
    console.error("Error creating artist:", error)
    return NextResponse.json({ error: "Failed to create artist" }, { status: 500 })
  }
}
