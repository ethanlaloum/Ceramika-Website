// Cache global pour l'état de maintenance (compatible Edge Runtime)
// Utilise globalThis qui est disponible dans l'Edge Runtime

interface MaintenanceState {
  value: boolean
  timestamp: number
}

// Créer une référence globale compatible Edge Runtime
const getGlobalMaintenanceCache = (): MaintenanceState => {
  if (typeof globalThis !== 'undefined') {
    if (!globalThis.__maintenance_cache) {
      globalThis.__maintenance_cache = {
        value: false,
        timestamp: 0
      }
    }
    return globalThis.__maintenance_cache as MaintenanceState
  }
  
  // Fallback si globalThis n'est pas disponible
  return { value: false, timestamp: 0 }
}

/**
 * Met à jour le cache global de maintenance
 */
export function setGlobalMaintenanceState(maintenance: boolean): void {
  const cache = getGlobalMaintenanceCache()
  cache.value = maintenance
  cache.timestamp = Date.now()
}

/**
 * Lit l'état de maintenance depuis le cache global
 */
export function getGlobalMaintenanceState(): { value: boolean; timestamp: number } {
  return getGlobalMaintenanceCache()
}

/**
 * Vérifie si le cache global est récent (moins de 30 secondes)
 */
export function isGlobalMaintenanceCacheValid(): boolean {
  const cache = getGlobalMaintenanceCache()
  return (Date.now() - cache.timestamp) < 30000 // 30 secondes
}

// Déclaration TypeScript pour globalThis
declare global {
  var __maintenance_cache: MaintenanceState | undefined
}
