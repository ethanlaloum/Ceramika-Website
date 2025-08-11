import { prisma } from '@/lib/prisma'

// Cache en mémoire pour l'état de maintenance (compatible Edge Runtime)
let maintenanceCache: boolean | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30000 // 30 secondes pour la production

/**
 * Synchronise l'état de maintenance depuis la base de données vers le cache
 */
export async function syncMaintenanceModeFromDatabase(): Promise<boolean> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: 'maintenance_mode' }
    })
    
    const isMaintenanceActive = config ? config.value === 'true' : false
    
    // Mettre à jour le cache en mémoire
    maintenanceCache = isMaintenanceActive
    cacheTimestamp = Date.now()
    
    return isMaintenanceActive
  } catch (error) {
    console.log('Impossible de synchroniser l\'état de maintenance depuis la BDD:', error)
    // En cas d'erreur, utiliser la variable d'environnement
    const envValue = process.env.MAINTENANCE_MODE === 'true'
    maintenanceCache = envValue
    cacheTimestamp = Date.now()
    return envValue
  }
}

/**
 * Utilitaire pour gérer le mode maintenance (version async)
 */
export async function isMaintenanceMode(): Promise<boolean> {
  return await syncMaintenanceModeFromDatabase()
}

/**
 * Version synchrone pour le middleware (utilise le cache ou la variable d'environnement)
 */
export function isMaintenanceModeSync(): boolean {
  // Si le cache en mémoire est récent, l'utiliser
  if (maintenanceCache !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return maintenanceCache
  }
  
  // Sinon, utiliser la variable d'environnement et mettre à jour le cache
  const envValue = process.env.MAINTENANCE_MODE === 'true'
  maintenanceCache = envValue
  cacheTimestamp = Date.now()
  
  return envValue
}

/**
 * Chemins qui restent accessibles même en mode maintenance
 */
export const MAINTENANCE_ALLOWED_PATHS = [
  '/admin',
  '/customer', // Espace client complet
  '/api/auth',
  '/api/admin',
  '/api/maintenance', // API de synchronisation
  '/maintenance'
]

/**
 * Vérifie si un chemin est autorisé pendant la maintenance
 */
export function isPathAllowedDuringMaintenance(pathname: string): boolean {
  return MAINTENANCE_ALLOWED_PATHS.some(allowedPath => 
    pathname.startsWith(allowedPath)
  )
}

/**
 * Vérifie si une requête doit être redirigée vers la page de maintenance
 */
export function shouldRedirectToMaintenance(pathname: string): boolean {
  if (!isMaintenanceModeSync()) {
    return false
  }

  // Ne pas rediriger si déjà sur la page de maintenance
  if (pathname === '/maintenance') {
    return false
  }

  // Ne pas rediriger les chemins autorisés
  if (isPathAllowedDuringMaintenance(pathname)) {
    return false
  }

  return true
}
