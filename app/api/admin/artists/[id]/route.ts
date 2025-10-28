import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Next.js 15: params peut être une Promise
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
  }

  const { id } = await context.params

  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      products: { select: { id: true, name: true, price: true, images: true }, orderBy: { name: "asc" } },
      collections: { select: { id: true, name: true, image: true }, orderBy: { name: "asc" } },
      _count: { select: { products: true, collections: true } },
    },
  })

  if (!artist) return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 })

  return NextResponse.json(artist)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const { name, bio, image } = body

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 })
  }

  // Vérifier l'existence
  const exists = await prisma.artist.findUnique({ where: { id } })
  if (!exists) return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 })

  const updated = await prisma.artist.update({
    where: { id },
    data: { name: name.trim(), bio: bio || null, image: image || null },
  })

  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
  }

  const { id } = await context.params

  // Optionnel: protéger si des produits liés existent
  // Ici on autorise la suppression (produits auront artistId non nul -> contrainte). On peut choisir onDelete behavior.
  try {
    await prisma.artist.delete({ where: { id } })
  } catch (e) {
    return NextResponse.json({ error: "Impossible de supprimer l'artiste (liens existants?)" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
