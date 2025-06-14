"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react" // Ajout de useSession
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  redirectTo?: string
  isAdmin?: boolean
}

export function LoginForm({ redirectTo = "", isAdmin = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession() // Récupération de la session

  // Effet pour gérer la redirection après connexion
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Vérification du rôle de l'utilisateur
      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard")
      } else if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push("/customer/dashboard")
      }
    }
  }, [status, session, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
        setIsLoading(false)
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        })
        // La redirection sera gérée par l'effet useEffect
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder={isAdmin ? "admin@ceramique.com" : "votre@email.com"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className={isAdmin ? "bg-stone-700 border-stone-600 text-white placeholder:text-stone-400" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className={isAdmin ? "text-stone-200" : ""}>
          Mot de passe
        </Label>
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

      <Button
        type="submit"
        className={`w-full ${isAdmin ? "bg-stone-600 hover:bg-stone-500" : "bg-stone-800 hover:bg-stone-700"}`}
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}
