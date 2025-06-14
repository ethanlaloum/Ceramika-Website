import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LanguageProvider, CartProvider } from "@/components/providers"
import { CartSidebar } from "@/components/cart-sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <CartProvider>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartSidebar />
      </CartProvider>
    </LanguageProvider>
  )
}