import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { importAllProductsFromIabako } from "@/lib/services/iabako-sync-service"

/**
 * Cron job pour synchroniser tous les produits depuis Iabako.
 * S'exécute toutes les 10 minutes pour garder les produits à jour.
 * Scanne tous les numéros séquentiels pour découvrir et mettre à jour les produits.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  // Vérifier que c'est une vraie requête Vercel Cron
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const startTime = Date.now()
  console.log("🔄 [CRON] Début de la synchronisation Iabako")

  try {
    // Récupérer l'artiste par défaut
    const defaultArtist = await prisma.artist.findFirst({
      orderBy: { name: "asc" },
    })

    if (!defaultArtist) {
      console.error("❌ [CRON] Aucun artiste trouvé pour la sync")
      return NextResponse.json(
        { error: "Aucun artiste trouvé", success: false },
        { status: 400 }
      )
    }

    console.log(`📦 [CRON] Synchronisation en cours (artiste: ${defaultArtist.name})...`)

    // Lancer la synchronisation
    const result = await importAllProductsFromIabako(defaultArtist.id)

    const duration = Date.now() - startTime
    const message = `✅ Sync complétée en ${duration}ms: ${result.scanned} produit(s) scanné(s), ${result.created} créé(s), ${result.updated} mis à jour`

    console.log(message)
    if (result.errors.length > 0) {
      console.warn(`⚠️ ${result.errors.length} erreur(s) pendant la sync:`, result.errors.slice(0, 3))
    }

    return NextResponse.json({
      success: true,
      message,
      duration: `${duration}ms`,
      summary: {
        scanned: result.scanned,
        created: result.created,
        updated: result.updated,
        errors: result.errors.length,
      },
      // Limiter les détails pour la réponse
      recentProducts: result.products.slice(0, 10),
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`❌ [CRON] Erreur lors de la sync Iabako (${duration}ms):`, errorMsg)

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        duration: `${duration}ms`,
      },
      { status: 500 }
    )
  }
}
