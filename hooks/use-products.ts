"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types"

interface UseProductsOptions {
  featured?: boolean
  category?: string
  artistId?: string
  collectionId?: string
  limit?: number
  page?: number
  fetchAll?: boolean
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
  currentPage: number
  setPage: (page: number) => void
  totalProducts: number
  totalPages: number
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(options.page || 1)
  const [totalProducts, setTotalProducts] = useState(0)
  
  const limit = options.fetchAll ? 0 : (options.limit || 12)
  const totalPages = Math.ceil(totalProducts / (limit || 1))

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.featured) params.append("featured", "true")
      if (options.category) params.append("category", options.category)
      if (options.artistId) params.append("artistId", options.artistId)
      if (options.collectionId) params.append("collectionId", options.collectionId)
      if (!options.fetchAll) {
        params.append("limit", limit.toString())
        params.append("page", currentPage.toString())
      }

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des produits")
      }

      const data = await response.json()
      setProducts(data.products || data)
      setTotalProducts(data.total || data.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, options.featured, options.category, options.artistId, options.collectionId])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    currentPage,
    setPage: setCurrentPage,
    totalProducts,
    totalPages,
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
