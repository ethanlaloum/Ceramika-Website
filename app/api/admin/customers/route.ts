import { NextResponse } from "next/server"
import { auth } from "@/auth" // Modifié: importer auth au lieu de authOptions et getServerSession
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth() // Modifié: utiliser auth() directement
    if (!session || session.user?.role !== "ADMIN") { // Ajout de l'opérateur optionnel ?. pour éviter les erreurs
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        addresses: {
          select: {
            id: true,
            addressLine1: true,
            city: true,
            country: true,
            isDefault: true,
          },
        },
        wishlistItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
