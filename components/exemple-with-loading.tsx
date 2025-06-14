"use client"

import { useState } from "react"
import { useLoading } from "@/hooks/use-loading"
import { Button } from "@/components/ui/button"

export function ExampleWithLoading() {
  const { setLoading } = useLoading()
  const [data, setData] = useState<any>(null)

  const handleFetchData = async () => {
    // Activer manuellement le loader
    setLoading(true, "Chargement des données...")

    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setData({ success: true, message: "Données chargées avec succès!" })
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
    } finally {
      // Désactiver le loader
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Button onClick={handleFetchData}>Charger les données</Button>

      {data && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
