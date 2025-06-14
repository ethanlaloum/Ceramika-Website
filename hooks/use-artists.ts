"use client"

import { useState, useEffect } from "react"
import type { Artist } from "@/types"

interface UseArtistsOptions {
  featured?: boolean
  limit?: number
}

interface UseArtistsReturn {
  artists: Artist[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useArtists(options: UseArtistsOptions = {}): UseArtistsReturn {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArtists = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.featured) params.append("featured", "true")
      if (options.limit) params.append("limit", options.limit.toString())

      const response = await fetch(`/api/artists?${params}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des artistes")
      }

      const data = await response.json()
      setArtists(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
  }, [options.featured, options.limit])

  return {
    artists,
    loading,
    error,
    refetch: fetchArtists,
  }
}

export function useArtist(id: string) {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/artists/${id}`)
        if (!response.ok) {
          throw new Error("Artiste non trouvé")
        }

        const data = await response.json()
        setArtist(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArtist()
    }
  }, [id])

  return { artist, loading, error }
}
