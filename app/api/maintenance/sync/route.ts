import { syncMaintenanceModeFromDatabase } from '@/lib/maintenance'
import { updateMaintenanceCache } from '@/lib/maintenance-middleware'

/**
 * API publique pour synchroniser l'état de maintenance
 * Cette route ne nécessite pas d'authentification et sert juste à déclencher la synchronisation du cache
 */
export async function GET() {
  try {
    const maintenanceMode = await syncMaintenanceModeFromDatabase()
    
    // Mettre à jour le cache du middleware
    updateMaintenanceCache(maintenanceMode)
    
    return new Response(JSON.stringify({ 
      maintenance: maintenanceMode 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Erreur sync maintenance:', error)
    return new Response(JSON.stringify({
      error: 'Erreur de synchronisation'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
