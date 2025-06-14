"use client"

import { ComingSoon } from "@/components/coming-soon"

export default function AdminForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-stone-900">
      <ComingSoon
        title="Réinitialisation Admin - Bientôt Disponible"
        description="La récupération de mot de passe admin sera bientôt disponible."
        backLabel="Retour à la Connexion Admin"
        backLink="/admin/login"
      />
    </div>
  )
}
