'use client'

import { useEffect } from 'react'

/**
 * Composant qui initialise le cache de maintenance au démarrage de l'app
 * Synchronise le cache avec la base de données
 */
export function MaintenanceInitializer() {
  useEffect(() => {
    // Initialiser le cache de maintenance depuis la DB
    fetch('/api/maintenance/init', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('🔧 Cache maintenance initialisé:', data.maintenance)
      })
      .catch(error => {
        console.error('❌ Erreur initialisation maintenance:', error)
      })
  }, [])

  return null // Ce composant ne rend rien
}
