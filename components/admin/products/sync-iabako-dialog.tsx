"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SyncIabakoDialogProps {
  isOpen: boolean
  onClose: () => void
  onSync: (numbers: string[]) => Promise<void>
  isSyncing: boolean
}

export function SyncIabakoDialog({
  isOpen,
  onClose,
  onSync,
  isSyncing,
}: SyncIabakoDialogProps) {
  const [numbersInput, setNumbersInput] = useState("")

  const handleSync = async () => {
    const numbers = numbersInput
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (numbers.length === 0) return

    await onSync(numbers)
    setNumbersInput("")
    onClose()
  }

  const parsedNumbers = numbersInput
    .split(/[\n,;]+/)
    .map((n) => n.trim())
    .filter((n) => n.length > 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer depuis Iabako</DialogTitle>
          <DialogDescription>
            Entrez les numéros de produits Iabako à importer ou mettre à jour.
            Séparez-les par des virgules, points-virgules ou retours à la ligne.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="iabako-numbers">Numéros de produits</Label>
            <Textarea
              id="iabako-numbers"
              placeholder={"Ex : VG15, VD30, VG11\nou un par ligne :\nVG15\nVD30\nVG11"}
              value={numbersInput}
              onChange={(e) => setNumbersInput(e.target.value)}
              rows={5}
              disabled={isSyncing}
            />
          </div>

          {parsedNumbers.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {parsedNumbers.length} numéro(s) détecté(s) : {parsedNumbers.join(", ")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSyncing}>
            Annuler
          </Button>
          <Button
            onClick={handleSync}
            disabled={isSyncing || parsedNumbers.length === 0}
            className="bg-black hover:bg-gray-800"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Importation...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Importer ({parsedNumbers.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
