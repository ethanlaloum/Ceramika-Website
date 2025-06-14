import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string
      lastName?: string
      role: UserRole
    }
  }

  interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    firstName?: string
    lastName?: string
  }
}
