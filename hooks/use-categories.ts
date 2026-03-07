"use client"

import { useState, useEffect } from "react"

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        setError("Erreur lors du chargement des catégories")
      }
    } catch (error) {
      setError("Erreur réseau lors du chargement des catégories")
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refetch: fetchCategories }
}