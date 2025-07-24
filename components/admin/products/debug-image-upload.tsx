"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function DebugImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const testUpload = async (file: File) => {
    console.log('🚀 [DEBUG] Début test upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('🚀 [DEBUG] Envoi vers API debug...')
      const response = await fetch('/api/admin/upload-debug', {
        method: 'POST',
        body: formData,
      })

      console.log('🚀 [DEBUG] Réponse reçue:', {
        status: response.status,
        ok: response.ok
      })

      const result = await response.json()
      console.log('🚀 [DEBUG] Contenu réponse:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Erreur inconnue')
      }

      toast({
        title: '✅ Test réussi !',
        description: `Fichier ${file.name} validé avec succès`,
      })

    } catch (error) {
      console.error('🚀 [DEBUG] ❌ Erreur:', error)
      toast({
        title: '❌ Test échoué',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      testUpload(file)
    }
    // Reset input
    event.target.value = ''
  }

  return (
    <div className="p-6 border border-dashed border-orange-300 rounded-lg bg-orange-50">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          🔧 Mode Debug - Test Upload
        </h3>
        <p className="text-sm text-orange-600 mb-4">
          Ce composant teste uniquement la réception du fichier sans le sauvegarder
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="debug-upload"
          disabled={isUploading}
        />
        
        <label htmlFor="debug-upload" className="cursor-pointer">
          <Button disabled={isUploading} asChild>
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Tester un fichier
                </>
              )}
            </span>
          </Button>
        </label>
        
        <p className="text-xs text-orange-500 mt-2">
          Ouvrez la console (F12) pour voir les logs détaillés
        </p>
      </div>
    </div>
  )
}
