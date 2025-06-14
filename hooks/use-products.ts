"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types"

interface UseProductsOptions {
  featured?: boolean
  category?: string
  artistId?: string
  collectionId?: string
  limit?: number
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.featured) params.append("featured", "true")
      if (options.category) params.append("category", options.category)
      if (options.artistId) params.append("artistId", options.artistId)
      if (options.collectionId) params.append("collectionId", options.collectionId)
      if (options.limit) params.append("limit", options.limit.toString())

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des produits")
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [options.featured, options.category, options.artistId, options.collectionId, options.limit])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error("Produit non trouvé")
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}
