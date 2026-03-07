import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }
    if (search) {
      const lowered = search.toLowerCase()
      where.OR = [
        { id: { contains: lowered } },
        { user: { email: { contains: lowered } } },
        { user: { firstName: { contains: lowered } } },
        { user: { lastName: { contains: lowered } } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // build CSV
    const rows: string[][] = []
    rows.push(["ID", "Email", "Nom", "Statut", "Total", "Créée le"])
    orders.forEach((o) => {
      rows.push([
        o.id,
        o.user.email,
        `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim(),
        o.status,
        o.total.toString(),
        o.createdAt.toISOString(),
      ])
    })

    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${status||'all'}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}