"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Erreur de chargement</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
