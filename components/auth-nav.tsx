"use client"

import { useAuth } from "@/hooks/use-auth"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function AuthNav() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return <div className="w-8 h-8 bg-stone-200 rounded-full animate-pulse" />
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/customer/login">Se connecter</Link>
        </Button>
        <Button asChild>
          <Link href="/customer/login">S inscrire</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>{user?.firstName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={isAdmin ? "/admin/dashboard" : "/customer/dashboard"}>
            <Settings className="mr-2 h-4 w-4" />
            Tableau de bord
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard">
              <Settings className="mr-2 h-4 w-4" />
              Administration
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
