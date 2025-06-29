"use client"

import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/animations"
import { Package } from "lucide-react"

interface ArtistStatusProps {
  count: number
  loading: boolean
}

export function ArtistStatus({ count, loading }: ArtistStatusProps) {
  if (loading) {
    return (
      <FadeIn>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-4 h-4 bg-stone-300 dark:bg-stone-600 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-stone-300 dark:bg-stone-600 rounded animate-pulse"></div>
        </div>
      </FadeIn>
    )
  }

  // Ne rien afficher si pas d'artistes
  if (count === 0) {
    return null
  }

  return (
    <FadeIn>
      <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-2">
          <Package className="w-4 h-4 mr-2" />
          {count} artiste{count > 1 ? 's' : ''} partenaire{count > 1 ? 's' : ''}
        </Badge>
      </div>
    </FadeIn>
  )
}
