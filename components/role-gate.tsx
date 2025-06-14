"use client"

import { useSession } from "next-auth/react"
import type { UserRole } from "@prisma/client"
import type { ReactNode } from "react"

interface RoleGateProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleGate({ children, allowedRoles, fallback }: RoleGateProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Chargement...</div>
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return fallback || <div>Accès non autorisé</div>
  }

  return <>{children}</>
}
