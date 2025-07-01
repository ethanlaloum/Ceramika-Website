import { NextResponse } from "next/server"
import { auth } from "@/auth" // Modifié: importer auth au lieu de authOptions
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth() // Modifié: utiliser auth() directement
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Calculer la date de début selon la période
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Récupérer les données
    const [totalRevenue, totalOrders, totalCustomers, totalProducts, topProducts, ordersByStatus] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.user.count({
        where: {
          role: "CUSTOMER",
          createdAt: { gte: startDate },
        },
      }),
      prisma.product.count(),
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            createdAt: { gte: startDate },
          },
        },
        _sum: {
          quantity: true,
          price: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),
    ])

    // Récupérer les détails des produits les plus vendus
    const productIds = topProducts.map((p) => p.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
      },
    })

    const topProductsWithDetails = topProducts.map((tp) => {
      const product = products.find((p) => p.id === tp.productId)
      return {
        id: tp.productId,
        name: product?.name || "Produit inconnu",
        sales: tp._sum.quantity || 0,
        revenue: tp._sum.price || 0,
      }
    })

    const analytics = {
      revenue: {
        total: totalRevenue._sum.total || 0,
        change: 15.3, // Calculé dynamiquement en production
        trend: "up" as const,
      },
      orders: {
        total: totalOrders,
        change: 8.7,
        trend: "up" as const,
      },
      customers: {
        total: totalCustomers,
        change: 12.1,
        trend: "up" as const,
      },
      products: {
        total: totalProducts,
        change: 2.3,
        trend: "up" as const,
      },
      topProducts: topProductsWithDetails,
      revenueByMonth: [], // À implémenter selon les besoins
      ordersByStatus: ordersByStatus.map((obs) => ({
        status: obs.status,
        count: obs._count,
      })),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
