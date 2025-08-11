import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { maintenanceMiddleware } from "@/lib/maintenance-middleware"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // 🔧 VÉRIFIER LA MAINTENANCE EN PREMIER - PRIORITÉ ABSOLUE
  // Cela s'exécute même si l'utilisateur n'est pas connecté
  const maintenanceResponse = maintenanceMiddleware(req)
  if (maintenanceResponse) {
    return maintenanceResponse
  }

  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Routes publiques
  const publicRoutes = [
    "/",
    "/products",
    "/collections",
    "/artists",
    "/about",
    "/contact",
    "/new-arrivals",
    "/bestsellers",
    "/shipping",
    "/returns",
    "/care",
    "/careers",
    "/press",
    "/sustainability",
    "/privacy",
    "/terms",
    "/maintenance", // 🔧 Ajouté pour que la maintenance soit accessible sans authentification
  ]

  // Routes d'authentification
  const authRoutes = ["/customer/login", "/admin/login", "/customer/forgot-password", "/admin/forgot-password"]

  // Routes protégées pour les clients
  const customerRoutes = ["/customer/dashboard", "/cart"]

  // Routes protégées pour les admins
  const adminRoutes = ["/admin/dashboard"]

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Vérifier si c'est une route d'authentification
  const isAuthRoute = authRoutes.includes(pathname)

  // Vérifier si c'est une route API
  const isApiRoute = pathname.startsWith("/api")

  // Permettre l'accès aux routes publiques et API
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next()
  }

  // Rediriger vers la page de connexion si pas connecté
  if (!isLoggedIn && !isAuthRoute) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    return NextResponse.redirect(new URL("/customer/login", req.url))
  }

  // Rediriger vers le dashboard approprié si déjà connecté et sur une page d'auth
  if (isLoggedIn && isAuthRoute) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
    return NextResponse.redirect(new URL("/customer/dashboard", req.url))
  }

  // Vérifier les permissions pour les routes admin
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/customer/dashboard", req.url))
  }

  // Vérifier les permissions pour les routes client
  if (customerRoutes.some((route) => pathname.startsWith(route)) && userRole !== "CUSTOMER" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/customer/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
