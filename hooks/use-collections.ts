"use client"

import { useState, useEffect } from "react"
import type { Collection } from "@/types"

interface UseCollectionsOptions {
  featured?: boolean
  limit?: number
}

interface UseCollectionsReturn {
  collections: Collection[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCollections(options: UseCollectionsOptions = {}): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.featured) params.append("featured", "true")
      if (options.limit) params.append("limit", options.limit.toString())

      const response = await fetch(`/api/collections?${params}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des collections")
      }

      const data = await response.json()
      setCollections(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [options.featured, options.limit])

  return {
    collections,
    loading,
    error,
    refetch: fetchCollections,
  }
}

export function useCollection(id: string) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/collections/${id}`)
        if (!response.ok) {
          throw new Error("Collection non trouvée")
        }

        const data = await response.json()
        setCollection(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCollection()
    }
  }, [id])

  return { collection, loading, error }
}
