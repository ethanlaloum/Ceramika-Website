// auth.edge.ts
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

// Config minimale sans Prisma, juste pour le middleware/proxy
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [], // pas besoin de providers dans le proxy
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    },
  },
  pages: {
    signIn: "/customer/login",
  },
}

export const { auth } = NextAuth(authConfig)