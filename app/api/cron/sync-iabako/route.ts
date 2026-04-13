import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { importProductsFromIabako } from "@/lib/services/iabako-sync-service"

/**
 * Cron job pour synchroniser les produits depuis Iabako automatiquement.
 * Appelé par Vercel Cron ou manuellement avec le header d'autorisation.
 */
export async function GET(request: Request) {
  // Vérifier l'autorisation (CRON_SECRET pour Vercel Cron)
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    // Récupérer le premier artiste comme artiste par défaut
    const defaultArtist = await prisma.artist.findFirst({
      orderBy: { name: "asc" },
    })

    if (!defaultArtist) {
      return NextResponse.json(
        { error: "Aucun artiste trouvé" },
        { status: 400 }
      )
    }

    const result = await importProductsFromIabako(defaultArtist.id)

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
