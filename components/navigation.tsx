"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, Heart, Settings, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "next-auth/react"
import Image from "next/image"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const { itemCount, setIsOpen } = useCart()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Détermine si on a scrollé
      setIsScrolled(currentScrollY > 20)
      
      // Détermine la visibilité basée sur la direction du scroll
      if (currentScrollY < lastScrollY) {
        // Scroll vers le haut - montrer la nav
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll vers le bas et on est assez loin du haut - cacher la nav
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    window.location.href = "/"
  }

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-out",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-white/80 backdrop-blur-sm",
        // Animation de visibilité
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-full opacity-0"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-24 h-24 group-hover:scale-105 transition-transform">
              <Image
                src="/logo-ceramika.svg"
                alt="Ceramika Logo"
                width={96}
                height={96}
                className="w-full h-full"
                priority
              />
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { href: "/", label: "Accueil" },
              { href: "/products", label: "Explorer" },
              { href: "/collections", label: "Collections" },
              { href: "/artists", label: "Artistes" },
              { href: "/about", label: "À propos" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions de droite */}
          <div className="flex items-center space-x-3">
            {/* Bouton de recherche */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Search className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Bouton panier */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-4 w-4 text-gray-600" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-black text-white text-xs font-medium">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Authentification */}
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : user ? (
              // Utilisateur connecté - Dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-full"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.firstName || "Profil"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-600 capitalize mt-1">
                      {user.role === "ADMIN" ? "Administrateur" : "Client"}
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href={user.role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard"}
                      className="flex items-center space-x-2 px-3 py-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Tableau de bord</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "CUSTOMER" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/dashboard?tab=orders" className="flex items-center space-x-2 px-3 py-2">
                          <Package className="h-4 w-4" />
                          <span>Mes commandes</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/dashboard?tab=wishlist" className="flex items-center space-x-2 px-3 py-2">
                          <Heart className="h-4 w-4" />
                          <span>Ma liste de souhaits</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 flex items-center space-x-2 px-3 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Utilisateur non connecté - Bouton simple
              <Link href="/customer/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Se connecter
                </Button>
              </Link>
            )}

            {/* Bouton menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu
                className={cn(
                  "h-4 w-4 text-gray-600 transition-all duration-300",
                  isMenuOpen ? "rotate-90 scale-0" : "rotate-0 scale-100",
                )}
              />
              <X
                className={cn(
                  "absolute h-4 w-4 text-gray-600 transition-all duration-300",
                  isMenuOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0",
                )}
              />
            </Button>
          </div>
        </div>

        {/* Barre de recherche étendue */}
        {showSearch && (
          <div className="pb-4 border-t border-gray-100 pt-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des céramiques..."
                className="pl-10 pr-4 border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-full"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Menu mobile */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-out",
            isMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {[
              { href: "/", label: "Accueil" },
              { href: "/products", label: "Explorer" },
              { href: "/collections", label: "Collections" },
              { href: "/artists", label: "Artistes" },
              { href: "/about", label: "À propos" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
