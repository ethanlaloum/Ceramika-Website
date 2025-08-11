import { NextRequest, NextResponse } from 'next/server'

/**
 * Système de maintenance simple pour Edge Runtime
 * Utilise les cookies pour synchroniser l'état entre contextes
 */

/**
 * Chemins autorisés pendant la maintenance
 * TOUT LE RESTE EST BLOQUÉ
 */
const MAINTENANCE_ALLOWED_PATHS = [
  '/admin', // Toutes les routes admin sont autorisées
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

export function maintenanceMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Toujours permettre l'accès aux chemins autorisés
  if (isPathAllowedDuringMaintenance(pathname)) {
    return null // Laisser passer
  }

  // Vérifier le mode maintenance depuis les cookies
  const maintenanceCookie = request.cookies.get('ceramika-maintenance')
  const isMaintenanceActive = maintenanceCookie?.value === 'true'

  if (isMaintenanceActive) {
    // BLOQUER et rediriger vers maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return null // Pas de maintenance, laisser passer
}

/**
 * Met à jour l'état de maintenance via cookie (appelé par les APIs)
 */
export function setMaintenanceCookie(response: NextResponse, isActive: boolean): NextResponse {
  response.cookies.set('ceramika-maintenance', isActive.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 jours
  })
  
  return response
}

/**
 * Récupère l'état actuel depuis les cookies
 */
export function getMaintenanceFromCookie(request: NextRequest): boolean {
  const maintenanceCookie = request.cookies.get('ceramika-maintenance')
  return maintenanceCookie?.value === 'true'
}
