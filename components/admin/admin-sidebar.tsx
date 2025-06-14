"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, ShoppingCart, Users, Settings, Home, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Tableau de bord", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Produits", href: "/admin/products", icon: Package },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Clients", href: "/admin/customers", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col justify-between relative z-[9999]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
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

      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full"
        >
          <Home className="h-5 w-5" />
          <span>Retour au site</span>
        </Link>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full justify-start"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </aside>
  )
}
