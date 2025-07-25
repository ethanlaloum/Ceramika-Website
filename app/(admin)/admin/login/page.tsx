"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginPage() {

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-stone-300" />
          </div>
          <Link href="/" className="font-playfair text-3xl font-bold text-white">
            Céramique Admin
          </Link>
          <p className="text-stone-400 mt-2">Interface d'administration sécurisée</p>
        </div>

        <Card className="bg-stone-800 border-stone-700">
          <CardHeader>
            <CardTitle className="text-white">Administration</CardTitle>
            <CardDescription className="text-stone-400">Connectez-vous pour accéder à l'interface d'administration</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo="/admin/dashboard" isAdmin={true} />
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-stone-400 hover:text-stone-200 text-sm">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
