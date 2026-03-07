import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

function calculateStartDate(range: string): Date {
  const now = new Date()
  const start = new Date()
  switch (range) {
    case "7d":
      start.setDate(now.getDate() - 7)
      break
    case "30d":
      start.setDate(now.getDate() - 30)
      break
    case "90d":
      start.setDate(now.getDate() - 90)
      break
    case "1y":
      start.setFullYear(now.getFullYear() - 1)
      break
    case "all":
    case "toujours":
      // début de l'ère Unix pour récupérer toutes les données
      return new Date(0)
    default:
      start.setDate(now.getDate() - 30)
  }
  return start
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"
    const startDate = calculateStartDate(range)
    // note: calculateStartDate already handles "all" or "toujours"

    // Fetch metrics (same logic as analytics route)
    const [totalRevenue, totalOrders, totalCustomers, totalProducts] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: startDate } },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startDate } } }),
      prisma.product.count(),
    ])

    // Build a simple CSV string
    const rows: string[][] = []
    rows.push(["Metric", "Valeur"])
    rows.push(["Revenus totaux", `${totalRevenue._sum.total || 0}`])
    rows.push(["Commandes", `${totalOrders}`])
    rows.push(["Clients", `${totalCustomers}`])
    rows.push(["Produits", `${totalProducts}`])

    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="rapport-${range}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
