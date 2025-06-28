"use client"

import { signOut } from "next-auth/react"
import { useEffect } from "react"

export function SessionCleaner() {
  useEffect(() => {
    signOut({
      callbackUrl: "/customer/login?error=session-expired",
      redirect: true
    })
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Session expirée</h2>
          <p>Votre session n'est plus valide. Redirection en cours...</p>
        </div>
      </div>
    </div>
  )
}