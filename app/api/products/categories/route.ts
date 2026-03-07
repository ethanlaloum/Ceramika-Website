import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Récupérer toutes les catégories distinctes des produits
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      where: {
        category: {
          not: null,
        },
      },
      distinct: ["category"],
    })

    // Extraire les catégories et les trier
    const categoryList = categories
      .map((product) => product.category)
      .filter((category): category is string => category !== null)
      .sort()

    return NextResponse.json(categoryList)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}