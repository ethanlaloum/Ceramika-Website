import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { setMaintenanceCookie } from "@/lib/maintenance-middleware"

/**
 * API d'initialisation - synchronise l'état avec la DB au démarrage
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer l'état actuel depuis la DB
    const setting = await prisma.siteConfig.findUnique({
      where: { key: "maintenance_mode" }
    })
    
    const isMaintenanceActive = setting?.value === "true"
    
    console.log(`🚀 Cache maintenance initialisé: ${isMaintenanceActive}`)
    
    // Créer la réponse avec le cookie de maintenance
    const response = NextResponse.json({ 
      success: true,
      maintenance: isMaintenanceActive,
      message: "Cache synchronisé avec la base de données"
    })
    
    // Définir le cookie de maintenance
    setMaintenanceCookie(response, isMaintenanceActive)
    
    return response
  } catch (error) {
    console.error("❌ Erreur initialisation maintenance:", error)
    
    // En cas d'erreur, désactiver la maintenance
    const response = NextResponse.json({ 
      success: false,
      maintenance: false, 
      error: "Erreur base de données - maintenance désactivée"
    }, { status: 500 })
    
    setMaintenanceCookie(response, false)
    return response
  }
}
