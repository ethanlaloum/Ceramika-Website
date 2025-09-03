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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const uploadImage = useCallback(async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      let result: any
      try {
        result = await response.json()
      } catch (jsonError) {
        throw new Error(`Erreur de format de réponse (${response.status}): ${response.statusText}`)
      }

      if (!response.ok) {
        const errorMessage = result.error || 'Erreur lors du téléchargement'
        throw new Error(errorMessage)
      }

      // Ajouter la nouvelle image dans le premier slot disponible
      const newImages = [...images]
      
      // Trouver le premier index libre (null, undefined, ou chaîne vide)
      let insertIndex = newImages.findIndex(img => !img || img.trim() === '')
      
      // Si aucun slot libre, ajouter à la fin
      if (insertIndex === -1) {
        newImages.push(result.url)
      } else {
        newImages[insertIndex] = result.url
      }
      
      onImagesChange(newImages)

      toast({
        title: 'Image téléchargée',
        description: 'L\'image a été téléchargée avec succès.',
      })

    } catch (error) {
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
    console.log('Suppression de l\'image à l\'index:', indexToRemove)
    console.log('Image supprimée:', images[indexToRemove])
    console.log('Tableau actuel:', images)
    
    const newImages = images.filter((_, index) => index !== indexToRemove)
    console.log('Nouveau tableau:', newImages)
    onImagesChange(newImages)
  }, [images, onImagesChange])

  // Fonction pour nettoyer le tableau (supprimer les entrées vides)
  const cleanImages = useCallback(() => {
    const cleanedImages = images.filter(img => img && img.trim() !== '')
    if (cleanedImages.length !== images.length) {
      onImagesChange(cleanedImages)
    }
  }, [images, onImagesChange])

  // Fonctions pour réorganiser les images par drag & drop
  const handleImageDragStart = useCallback((event: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleImageDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleImageDrop = useCallback((event: React.DragEvent, dropIndex: number) => {
    event.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    
    // Supprimer l'image de sa position actuelle
    newImages.splice(draggedIndex, 1)
    
    // L'insérer à la nouvelle position
    newImages.splice(dropIndex, 0, draggedImage)
    
    onImagesChange(newImages)
    setDraggedIndex(null)
  }, [images, onImagesChange, draggedIndex])

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
          Images du produit ({images.filter(img => img && img.trim() !== '').length}/{maxImages})
        </Label>
        <div className="flex items-center gap-2">
          {images.some(img => !img || img.trim() === '') && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cleanImages}
              disabled={disabled}
              className="text-xs"
            >
              Nettoyer
            </Button>
          )}
          {images.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Glissez pour réorganiser
            </span>
          )}
        </div>
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
          {images.map((imageUrl, index) => {
            // Ne pas afficher les images vides ou invalides
            if (!imageUrl || imageUrl.trim() === '') {
              return null
            }
            
            return (
              <div 
                key={index} 
                className="relative group cursor-move"
                draggable={!disabled}
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={handleImageDragOver}
                onDrop={(e) => handleImageDrop(e, index)}
              >
                <div className={`aspect-square relative bg-muted rounded-lg overflow-hidden transition-opacity ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}>
                  {/* Test avec img normal d'abord, puis Image de Next.js en fallback */}
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Erreur de chargement pour l'image ${index}:`, imageUrl)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
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
              </div>
            )
          })}
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
        La première image sera utilisée comme image principale du produit. Glissez-déposez les images pour les réorganiser.
      </p>
    </div>
  )
}
