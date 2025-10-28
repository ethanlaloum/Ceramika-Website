import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const artists = await prisma.artist.findMany({
      include: {
        _count: { select: { products: true, collections: true } },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(artists)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, image } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 })
    }

    const artist = await prisma.artist.create({
      data: { name: name.trim(), bio: bio || null, image: image || null },
    })

    return NextResponse.json(artist, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}
