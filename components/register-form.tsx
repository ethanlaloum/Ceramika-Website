"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

interface RegisterFormProps {
  onSuccess?: () => void
  isAdmin?: boolean
}

export function RegisterForm({ onSuccess, isAdmin = false }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    vatNumber: "",
    siretNumber: "",
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName || null,
          vatNumber: formData.vatNumber || null,
          siretNumber: formData.siretNumber || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        })

        if (onSuccess) {
          onSuccess()
        } else {
          // Redirection vers la page de connexion après un court délai
          setTimeout(() => {
            window.location.reload()
          }, 1500) // Délai de 1.5 secondes pour que l'utilisateur puisse voir le message
        }
      } else {
        toast({
          title: "Erreur d'inscription",
          description: data.error || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informations personnelles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
        />
      </div>

      {/* Informations de facturation */}
      <div className="border-t pt-4">
        <h3 className={`text-sm font-medium mb-3 ${isAdmin ? "text-stone-200" : "text-stone-700"}`}>
          Informations de facturation
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nom de la société</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Nom de votre entreprise"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vatNumber">Numéro de TVA</Label>
              <Input
                id="vatNumber"
                type="text"
                placeholder="FR12345678901"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siretNumber">Numéro SIRET</Label>
              <Input
                id="siretNumber"
                type="text"
                placeholder="12345678901234"
                value={formData.siretNumber}
                onChange={(e) => setFormData({ ...formData, siretNumber: e.target.value })}
                className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mots de passe */}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className={`h-4 w-4 ${isAdmin ? "text-stone-400" : "text-stone-500"}`} />
            ) : (
              <Eye className={`h-4 w-4 ${isAdmin ? "text-stone-400" : "text-stone-500"}`} />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className={`h-4 w-4 ${isAdmin ? "text-stone-400" : "text-stone-500"}`} />
            ) : (
              <Eye className={`h-4 w-4 ${isAdmin ? "text-stone-400" : "text-stone-500"}`} />
            )}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className={`w-full ${isAdmin ? "bg-stone-600 hover:bg-stone-500" : "bg-stone-800 hover:bg-stone-700"}`}
        disabled={isLoading}
      >
        {isLoading ? "Inscription..." : "S'inscrire"}
      </Button>
    </form>
  )
}
