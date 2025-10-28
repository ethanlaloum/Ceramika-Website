"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface ArtistLite {
  id: string
  name: string
}

interface DeleteArtistDialogProps {
  isOpen: boolean
  onClose: () => void
  artist: ArtistLite | null
  onSuccess: () => void
}

export function DeleteArtistDialog({ isOpen, onClose, artist, onSuccess }: DeleteArtistDialogProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!artist) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/artists/${artist.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Artiste supprimé avec succès",
        })
        onClose()
        onSuccess()
      } else {
        // Essayer de lire le message retourné (ex: contraintes d'intégrité)
        const error = await response.json().catch(() => ({} as any))
        throw new Error(error?.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de supprimer l'artiste. Vérifiez qu'aucun produit/collection n'y est lié.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'artiste "{artist?.name}" ? Cette action est irréversible.
            Si des produits ou des collections lui sont associés, la suppression peut échouer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
