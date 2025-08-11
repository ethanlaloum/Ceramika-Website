import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { setMaintenanceCookie } from "@/lib/maintenance-middleware"

/**
 * API simple pour récupérer l'état de maintenance depuis la DB
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer le paramètre depuis la DB
    const setting = await prisma.siteConfig.findUnique({
      where: { key: "maintenance_mode" }
    })
    
    const isMaintenanceActive = setting?.value === "true"
    
    // Créer la réponse avec le cookie de maintenance
    const response = NextResponse.json({ 
      maintenance: isMaintenanceActive,
      updated_at: new Date().toISOString()
    })
    
    // Définir le cookie de maintenance
    setMaintenanceCookie(response, isMaintenanceActive)
    
    return response
  } catch (error) {
    console.error("❌ Erreur vérification maintenance:", error)
    
    // En cas d'erreur, pas de maintenance par défaut
    const response = NextResponse.json({ 
      maintenance: false, 
      error: "Database unavailable" 
    })
    
    setMaintenanceCookie(response, false)
    return response
  }
}
