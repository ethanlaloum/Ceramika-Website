"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { GlobalLoader } from "./global-loader"

interface LoadingContextType {
  isLoading: boolean
  setLoading: (value: boolean, message?: string) => void
  loadingMessage: string | undefined
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  loadingMessage: undefined,
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined)
  const [loadingCount, setLoadingCount] = useState(0)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Gérer les transitions de page
  useEffect(() => {
    setLoading(true, "Chargement de la page...")

    // Simuler un délai minimum pour les transitions de page
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  // Fonction pour gérer plusieurs requêtes de chargement simultanées
  const setLoading = (value: boolean, message?: string) => {
    if (value) {
      setLoadingCount((prev) => prev + 1)
      if (message) setLoadingMessage(message)
    } else {
      setLoadingCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Mettre à jour l'état de chargement global
  useEffect(() => {
    setIsLoading(loadingCount > 0)

    // Réinitialiser le message quand il n'y a plus de chargement
    if (loadingCount === 0) {
      setLoadingMessage(undefined)
    }
  }, [loadingCount])

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage }}>
      <GlobalLoader isLoading={isLoading} message={loadingMessage} />
      {children}
    </LoadingContext.Provider>
  )
}
