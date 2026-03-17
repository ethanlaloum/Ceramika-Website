import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customerId = params.id
    if (!customerId) {
      return NextResponse.json({ error: "Missing customer id" }, { status: 400 })
    }

    // Supprimer le client et toutes ses dépendances si besoin (commandes, wishlist, etc.)
    await prisma.user.delete({
      where: { id: customerId, role: "CUSTOMER" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression du client" }, { status: 500 })
  }
}
