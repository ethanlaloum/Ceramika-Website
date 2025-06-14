"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { saveAddress } from "@/app/actions/user-actions"

interface Address {
  id?: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface AddressFormProps {
  initialData: Address
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="bg-stone-800 hover:bg-stone-700" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer l'Adresse"}
    </Button>
  )
}

export function AddressForm({ initialData }: AddressFormProps) {
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    const result = await saveAddress(formData)

    if (result.success) {
      toast({
        title: "Succès",
        description: "Votre adresse a été mise à jour avec succès",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresse de Livraison</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {initialData.id && <input type="hidden" name="addressId" value={initialData.id} />}

          <div>
            <Label htmlFor="addressLine1">Ligne d Adresse 1</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              type="text"
              defaultValue={initialData.addressLine1}
              className="w-full"
              required
            />
          </div>

          <div>
            <Label htmlFor="addressLine2">Ligne d Adresse 2</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              type="text"
              defaultValue={initialData.addressLine2}
              placeholder="Appartement, suite, etc."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" type="text" defaultValue={initialData.city} className="w-full" required />
            </div>
            <div>
              <Label htmlFor="state">État</Label>
              <Input id="state" name="state" type="text" defaultValue={initialData.state} className="w-full" required />
            </div>
            <div>
              <Label htmlFor="zipCode">Code Postal</Label>
              <Input
                id="zipCode"
                name="zipCode"
                type="text"
                defaultValue={initialData.zipCode}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isDefault" name="isDefault" defaultChecked={initialData.isDefault} />
            <Label htmlFor="isDefault">Définir comme adresse par défaut</Label>
          </div>

          <input type="hidden" name="country" value="France" />
          <input type="hidden" name="firstName" value="Sarah" />
          <input type="hidden" name="lastName" value="Johnson" />

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
