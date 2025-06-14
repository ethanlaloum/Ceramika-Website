"use client"

import { useSession } from "next-auth/react"
import type { UserRole } from "@prisma/client"

export function useAuth() {
  const { data: session, status } = useSession()

  const isLoading = status === "loading"
  const isAuthenticated = !!session
  const user = session?.user

  const hasRole = (role: UserRole) => {
    return user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]) => {
    return user?.role ? roles.includes(user.role) : false
  }

  const isAdmin = hasRole("ADMIN")
  const isCustomer = hasRole("CUSTOMER")
  const isArtist = hasRole("ARTIST")

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCustomer,
    isArtist,
  }
}
