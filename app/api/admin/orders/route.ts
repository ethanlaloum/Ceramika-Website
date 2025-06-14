import { NextResponse } from "next/server"
import { auth } from "@/auth" // Modifié: importer auth au lieu de authOptions et getServerSession
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth() // Modifié: utiliser auth() directement
    if (!session || session.user?.role !== "ADMIN") { // Ajout de l'opérateur optionnel ?. pour éviter les erreurs
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
