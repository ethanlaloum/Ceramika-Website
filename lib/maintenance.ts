import { prisma } from '@/lib/prisma'

/**
 * Utilitaire pour gérer le mode maintenance
 */
export async function isMaintenanceMode(): Promise<boolean> {
  try {
    // D'abord essayer de récupérer depuis la base de données
    const config = await prisma.siteConfig.findUnique({
      where: { key: 'maintenance_mode' }
    })
    
    if (config) {
      return config.value === 'true'
    }
  } catch (error) {
    // Si erreur BDD, utiliser la variable d'environnement comme fallback
    console.log('Fallback vers variable d\'environnement pour maintenance_mode')
  }
  
  // Fallback vers la variable d'environnement
  return process.env.MAINTENANCE_MODE === 'true'
}

/**
 * Version synchrone pour le middleware (utilise seulement les variables d'environnement)
 */
export function isMaintenanceModeSync(): boolean {
  return process.env.MAINTENANCE_MODE === 'true'
}

/**
 * Chemins qui restent accessibles même en mode maintenance
 */
export const MAINTENANCE_ALLOWED_PATHS = [
  '/admin',
  '/customer', // Espace client complet
  '/api/auth',
  '/api/admin',
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
