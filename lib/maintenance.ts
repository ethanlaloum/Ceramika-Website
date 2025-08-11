/**
 * Utilitaire pour gérer le mode maintenance
 */

export function isMaintenanceMode(): boolean {
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
  if (!isMaintenanceMode()) {
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
