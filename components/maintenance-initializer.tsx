'use client'

import { useEffect } from 'react'

/**
 * Composant qui initialise l'état de maintenance au chargement de l'application
 */
export function MaintenanceInitializer() {
  useEffect(() => {
    // Utiliser l'API publique de synchronisation
    fetch('/api/maintenance/sync', { 
      method: 'GET'
    })
      .then(() => {
        console.log('État de maintenance synchronisé depuis la base de données')
      })
      .catch((error) => {
        console.log('Erreur synchronisation maintenance:', error.message)
      })
  }, [])

  return null
}
