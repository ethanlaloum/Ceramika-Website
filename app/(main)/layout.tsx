import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <Navigation />
        <main className="min-h-screen pt-24">{children}</main>
        <Footer />
        <Analytics />
    </>
  )
}