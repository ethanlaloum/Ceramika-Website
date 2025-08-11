import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware spécialisé pour la gestion du mode maintenance en production
 * Utilise un endpoint API pour vérifier l'état de maintenance de manière asynchrone
 */

let maintenanceCache: boolean | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30000 // 30 secondes

/**
 * Chemins qui restent accessibles même en mode maintenance
 */
const MAINTENANCE_ALLOWED_PATHS = [
  '/admin',
  '/customer',
  '/api/auth',
  '/api/admin', 
  '/api/maintenance',
  '/maintenance',
  '/_next',
  '/favicon'
]

/**
 * Vérifie si un chemin est autorisé pendant la maintenance
 */
function isPathAllowedDuringMaintenance(pathname: string): boolean {
  return MAINTENANCE_ALLOWED_PATHS.some(allowedPath => 
    pathname.startsWith(allowedPath)
  )
}

/**
 * Vérifie l'état de maintenance de manière synchrone avec cache
 */
function checkMaintenanceMode(): boolean {
  // Si le cache est récent, l'utiliser
  if (maintenanceCache !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return maintenanceCache
  }

  // Utiliser la variable d'environnement comme fallback
  const envValue = process.env.MAINTENANCE_MODE === 'true'
  
  // Mettre à jour le cache
  maintenanceCache = envValue
  cacheTimestamp = Date.now()
  
  return envValue
}

/**
 * Middleware de maintenance pour production
 */
export function maintenanceMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Ne pas vérifier la maintenance pour les chemins autorisés
  if (isPathAllowedDuringMaintenance(pathname)) {
    return null // Laisser passer
  }

  // Vérifier le mode maintenance
  const isMaintenanceActive = checkMaintenanceMode()

  if (isMaintenanceActive) {
    // Rediriger vers la page de maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return null // Laisser passer
}

/**
 * Met à jour le cache de maintenance (appelé par l'API)
 */
export function updateMaintenanceCache(isActive: boolean): void {
  maintenanceCache = isActive
  cacheTimestamp = Date.now()
}
