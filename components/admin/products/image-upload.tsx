"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadImage = useCallback(async (file: File) => {
    console.log('🚀 Début upload côté client:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('📤 Envoi de la requête vers /api/admin/upload...')
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      let result: any
      try {
        result = await response.json()
        console.log('📋 Contenu de la réponse:', result)
      } catch (jsonError) {
        console.error('❌ Erreur lors du parsing JSON:', jsonError)
        throw new Error(`Erreur de format de réponse (${response.status}): ${response.statusText}`)
      }

      if (!response.ok) {
        const errorMessage = result.error || 'Erreur lors du téléchargement'
        console.error('❌ Erreur serveur:', {
          status: response.status,
          error: errorMessage,
          code: result.code,
          details: result.details,
          timestamp: result.timestamp,
          fullResult: result
        })
        
        // Message d'erreur plus détaillé selon le code d'erreur
        let userErrorMessage = errorMessage
        if (result.code === 'NO_SESSION') {
          userErrorMessage = 'Session expirée. Veuillez vous reconnecter.'
        } else if (result.code === 'INSUFFICIENT_PERMISSIONS') {
          userErrorMessage = 'Permissions insuffisantes. Vous devez être administrateur.'
        } else if (result.code === 'INVALID_FILE_TYPE') {
          userErrorMessage = `Type de fichier invalide: ${result.receivedType}. Utilisez JPG, PNG ou WebP.`
        } else if (result.code === 'FILE_TOO_LARGE') {
          userErrorMessage = `Fichier trop volumineux: ${result.fileSizeMB}MB. Maximum autorisé: 5MB.`
        }
        
        throw new Error(userErrorMessage)
      }

      // Ajouter la nouvelle image à la liste
      const newImages = [...images, result.url]
      onImagesChange(newImages)

      console.log('✅ Upload réussi, image ajoutée:', result.url)
      toast({
        title: 'Image téléchargée',
        description: 'L\'image a été téléchargée avec succès.',
      })

    } catch (error) {
      console.error('❌ Erreur complète upload:', {
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined,
        fileName: file.name,
        fileSize: file.size,
        timestamp: new Date().toISOString()
      })
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors du téléchargement',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }, [images, onImagesChange, toast])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifications côté client
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Type de fichier non autorisé',
        description: 'Utilisez des fichiers JPG, PNG ou WebP.',
        variant: 'destructive',
      })
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximum autorisée est de 5MB.',
        variant: 'destructive',
      })
      return
    }

    uploadImage(file)
    
    // Reset input
    event.target.value = ''
  }, [uploadImage, toast])

  const removeImage = useCallback((indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(newImages)
  }, [images, onImagesChange])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      uploadImage(file)
    }
  }, [uploadImage])

  const canAddMore = images.length < maxImages && !disabled

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Images du produit ({images.length}/{maxImages})
        </Label>
        {images.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Glissez pour réorganiser
          </span>
        )}
      </div>

      {/* Zone de téléchargement */}
      {canAddMore && (
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={disabled || isUploading}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="text-sm">
              <span className="font-medium">
                {isUploading ? 'Téléchargement...' : 'Cliquez pour télécharger'}
              </span>
              {!isUploading && (
                <span className="text-muted-foreground"> ou glissez-déposez</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG ou WebP (max. 5MB)
            </p>
          </label>
        </div>
      )}

      {/* Aperçu des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                {/* Test avec img normal d'abord, puis Image de Next.js en fallback */}
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('✅ Image chargée:', imageUrl)}
                  onError={(e) => {
                    console.error('❌ Erreur chargement image:', imageUrl)
                    // Fallback vers Image de Next.js
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    
                    // Créer un élément Image de Next.js en remplacement
                    const container = target.parentElement
                    if (container && !container.querySelector('.next-image-fallback')) {
                      const nextImageContainer = document.createElement('div')
                      nextImageContainer.className = 'next-image-fallback'
                      nextImageContainer.style.width = '100%'
                      nextImageContainer.style.height = '100%'
                      nextImageContainer.style.position = 'relative'
                      container.appendChild(nextImageContainer)
                    }
                  }}
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Principal
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {/* Debug info */}
              <div className="mt-1 text-xs text-muted-foreground truncate" title={imageUrl}>
                🔗 {imageUrl}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucune image */}
      {images.length === 0 && !canAddMore && (
        <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune image ajoutée</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        La première image sera utilisée comme image principale du produit.
      </p>
    </div>
  )
}
