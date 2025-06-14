import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ThemeProvider, LanguageProvider, CartProvider } from "@/components/providers"
import { CartSidebar } from "@/components/cart-sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Céramique - Artisan Ceramic Utensils",
  description: "Discover handcrafted ceramic utensils by renowned artists",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                <Navigation />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <CartSidebar />
                <Toaster />
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
