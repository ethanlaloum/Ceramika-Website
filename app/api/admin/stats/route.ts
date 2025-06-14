import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Récupérer les statistiques
    const [totalProducts, totalOrders, totalCustomers, totalRevenue] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
    ])

    // Commandes récentes
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentOrders,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
