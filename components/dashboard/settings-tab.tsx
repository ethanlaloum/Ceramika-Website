"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { savePreferences } from "@/app/actions/user-actions"

interface EmailPreferences {
  newProductNotifications: boolean
  orderUpdates: boolean
  artistSpotlights: boolean
  specialOffers: boolean
}

interface SettingsTabProps {
  initialPreferences: EmailPreferences
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="bg-stone-800 hover:bg-stone-700" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer les Préférences"}
    </Button>
  )
}

export function SettingsTab({ initialPreferences }: SettingsTabProps) {
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    const result = await savePreferences(formData)

    if (result.success) {
      toast({
        title: "Succès",
        description: "Vos préférences ont été mises à jour",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-2">Paramètres</h1>
        <p className="text-stone-600">Gérez vos préférences de compte</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Préférences Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800">Notifications Nouveaux Produits</p>
                <p className="text-sm text-stone-600">Soyez notifié des nouvelles arrivées céramiques</p>
              </div>
              <Checkbox
                id="newProductNotifications"
                name="newProductNotifications"
                defaultChecked={initialPreferences.newProductNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800">Mises à Jour Commandes</p>
                <p className="text-sm text-stone-600">Recevez des mises à jour sur vos commandes</p>
              </div>
              <Checkbox id="orderUpdates" name="orderUpdates" defaultChecked={initialPreferences.orderUpdates} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800">Pleins Feux Artistes</p>
                <p className="text-sm text-stone-600">Découvrez les artistes vedettes et leur travail</p>
              </div>
              <Checkbox
                id="artistSpotlights"
                name="artistSpotlights"
                defaultChecked={initialPreferences.artistSpotlights}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800">Offres Spéciales</p>
                <p className="text-sm text-stone-600">Recevez des remises exclusives et promotions</p>
              </div>
              <Checkbox id="specialOffers" name="specialOffers" defaultChecked={initialPreferences.specialOffers} />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité du Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Changer le Mot de Passe
          </Button>
          <Button variant="outline" className="w-full">
            Activer l Authentification à Deux Facteurs
          </Button>
          <Button variant="destructive" className="w-full">
            Supprimer le Compte
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
