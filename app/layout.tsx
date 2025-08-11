import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { MaintenanceInitializer } from "@/components/maintenance-initializer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Céramika - Artisan Ceramic Utensils",
  description: "Discover handcrafted ceramic utensils by renowned artists",
  icons: {
    icon: [
      { url: "/favicon-logo-original.svg", type: "image/svg+xml" },
      { url: "/favicon-logo-original.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-logo-original.svg", sizes: "16x16", type: "image/svg+xml" }
    ],
    shortcut: "/favicon-logo-original.svg",
    apple: "/favicon-logo-original.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
          <AuthProvider>
            <MaintenanceInitializer />
            {children}
            <Toaster />
          </AuthProvider>
      </body>
    </html>
  )
}
