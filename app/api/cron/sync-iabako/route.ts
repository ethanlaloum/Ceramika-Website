import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { importProductsFromIabako } from "@/lib/services/iabako-sync-service"

/**
 * Cron job pour resynchroniser les produits déjà importés depuis Iabako.
 * Met à jour les prix et stocks des produits ayant un iabakoNumber.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    // Récupérer les produits qui ont un iabakoNumber
    const productsWithIabako = await prisma.product.findMany({
      where: { iabakoNumber: { not: null } },
      select: { iabakoNumber: true },
    })

    const numbers = productsWithIabako
      .map((p) => p.iabakoNumber)
      .filter((n): n is string => n !== null)

    if (numbers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Aucun produit avec numéro Iabako à synchroniser",
        created: 0,
        updated: 0,
        errors: [],
      })
    }

    const defaultArtist = await prisma.artist.findFirst({
      orderBy: { name: "asc" },
    })

    if (!defaultArtist) {
      return NextResponse.json(
        { error: "Aucun artiste trouvé" },
        { status: 400 }
      )
    }

    const result = await importProductsFromIabako(numbers, defaultArtist.id)

    return NextResponse.json({
      success: true,
      message: `Sync: ${result.created} créé(s), ${result.updated} mis à jour, ${result.errors.length} erreur(s)`,
      ...result,
    })
  } catch (error) {
    console.error("❌ Cron sync Iabako:", error)
    return NextResponse.json(
      { error: `Erreur: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
