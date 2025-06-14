"use client"

import { useEffect } from "react"
import { useLoading } from "@/hooks/use-loading"

// Intercepteur pour les requêtes fetch
export function useFetchInterceptor() {
  const { setLoading } = useLoading()

  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (input, init) => {
      // Activer le loader
      setLoading(true)

      try {
        const response = await originalFetch(input, init)
        return response
      } finally {
        // Désactiver le loader
        setLoading(false)
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [setLoading])
}

// Si vous utilisez axios, vous pouvez ajouter un intercepteur similaire
