import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { importProductsFromIabako } from "@/lib/services/iabako-sync-service"

export async function POST() {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Récupérer tous les produits qui ont un numéro Iabako
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
        { error: "Aucun artiste trouvé. Veuillez créer un artiste avant de synchroniser." },
        { status: 400 }
      )
    }

    const result = await importProductsFromIabako(numbers, defaultArtist.id)

    return NextResponse.json({
      success: true,
      message: `Synchronisation terminée : ${result.created} créé(s), ${result.updated} mis à jour, ${result.errors.length} erreur(s)`,
      ...result,
    })
  } catch (error) {
    console.error("❌ Erreur sync Iabako:", error)
    return NextResponse.json(
      { error: `Erreur lors de la synchronisation: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
