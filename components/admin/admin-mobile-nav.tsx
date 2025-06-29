"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, ShoppingCart, Users, Settings, Home, LogOut, X } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Tableau de bord", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Produits", href: "/admin/products", icon: Package },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Clients", href: "/admin/customers", icon: Users },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

interface AdminMobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminMobileNav({ isOpen, onClose }: AdminMobileNavProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin</h2>
              <p className="text-xs text-gray-500">Céramique Studio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full"
          >
            <Home className="h-5 w-5" />
            <span>Retour au site</span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              onClose()
              signOut({ callbackUrl: "/" })
            }}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full justify-start"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
