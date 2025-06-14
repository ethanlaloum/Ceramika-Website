"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { updateProfile, updateEmail } from "@/app/actions/user-actions"

interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface ProfileFormProps {
  initialData: PersonalInfo
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="bg-stone-800 hover:bg-stone-700" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer les Modifications"}
    </Button>
  )
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast()
  const [emailFormData, setEmailFormData] = useState({
    email: initialData.email,
  })

  const handleProfileSubmit = async (formData: FormData) => {
    const result = await updateProfile(formData)

    if (result.success) {
      toast({
        title: "Succès",
        description: "Vos informations ont été mises à jour avec succès",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleEmailSubmit = async (formData: FormData) => {
    const result = await updateEmail(formData)

    if (result.success) {
      toast({
        title: "Succès",
        description: "Votre email a été mis à jour avec succès",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={initialData.firstName}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={initialData.lastName}
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={initialData.phone} className="w-full" />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={emailFormData.email}
                onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
                className="w-full"
                required
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
