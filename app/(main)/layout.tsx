
import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"
import { MaintenanceClientRedirect } from "@/components/maintenance-client-redirect"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <Navigation />
        <MaintenanceClientRedirect />
        <main className="min-h-screen pt-24">{children}</main>
        <Footer />
        <Analytics />
    </>
  )
}