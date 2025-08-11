import { NextRequest, NextResponse } from 'next/server'

/**
 * Système de maintenance simple pour Edge Runtime
 * Utilise une variable globale pour synchroniser l'état
 */

/**
 * Chemins autorisés pendant la maintenance
 * TOUT LE RESTE EST BLOQUÉ
 */
const MAINTENANCE_ALLOWED_PATHS = [
  '/admin/login',
  '/admin/dashboard', 
  '/admin/forgot-password',
  '/customer/login',
  '/customer/forgot-password',
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
    pathname.startsWith(allowedPath) || pathname === allowedPath
  )
}

/**
 * Variable globale partagée (Edge Runtime compatible)
 */
const globalThis_ = globalThis as any
globalThis_.__CERAMIKA_MAINTENANCE__ = globalThis_.__CERAMIKA_MAINTENANCE__ || false

export function maintenanceMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  console.log(`🔍 Middleware: Chemin demandé: ${pathname}`)

  // Toujours permettre l'accès aux chemins autorisés
  if (isPathAllowedDuringMaintenance(pathname)) {
    console.log(`✅ Chemin autorisé: ${pathname}`)
    return null // Laisser passer
  }

  // Vérifier le mode maintenance depuis la variable globale
  const isMaintenanceActive = globalThis_.__CERAMIKA_MAINTENANCE__
  console.log(`🔧 Mode maintenance (global): ${isMaintenanceActive}`)

  if (isMaintenanceActive) {
    console.log(`🚫 BLOCAGE: Redirection vers /maintenance pour ${pathname}`)
    // BLOQUER et rediriger vers maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  console.log(`✅ Passage autorisé pour: ${pathname}`)
  return null // Pas de maintenance, laisser passer
}

/**
 * Met à jour l'état de maintenance dans la variable globale
 */
export function updateMaintenanceCache(isActive: boolean): void {
  const globalThis_ = globalThis as any
  globalThis_.__CERAMIKA_MAINTENANCE__ = isActive
  console.log(`🔧 Global maintenance mis à jour: ${isActive}`)
}

/**
 * Récupère l'état actuel (pour les APIs)
 */
export function getMaintenanceCacheStatus(): boolean {
  const globalThis_ = globalThis as any
  return globalThis_.__CERAMIKA_MAINTENANCE__ || false
}
