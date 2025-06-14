"use client"

import { Package, Heart, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut } from "next-auth/react"

interface SidebarNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: {
    name: string
    email: string
  }
}

export function SidebarNavigation({ activeTab, onTabChange, user }: SidebarNavigationProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const navigationItems = [
    { id: "orders", label: "Mes Commandes", icon: Package },
    { id: "wishlist", label: "Liste de Souhaits", icon: Heart },
    { id: "profile", label: "Mon Profil", icon: User },
    { id: "settings", label: "Paramètres", icon: Settings },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-stone-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se Déconnecter
          </Button>
        </nav>
      </CardContent>
    </Card>
  )
}
