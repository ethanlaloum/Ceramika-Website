"use client"

import type React from "react"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="admin-container fixed inset-0 bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 relative z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Panneau Admin</h1>
                <p className="text-sm text-gray-500">Céramique Studio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="hidden sm:inline text-sm text-gray-600">
              Connecté en tant que <span className="font-medium">{session.user?.email}</span>
            </span>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">{session.user?.email?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block relative z-20">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar */}
        <AdminMobileNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
