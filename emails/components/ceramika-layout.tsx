import type React from "react"
import { Body, Container, Head, Html, Img, Hr, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface CeramikaLayoutProps {
  children: React.ReactNode
  preview: string
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""

export const CeramikaLayout = ({ children, preview }: CeramikaLayoutProps) => (
  <Tailwind
    config={{
      theme: {
        extend: {
          colors: {
            ceramika: {
              primary: "#8B4513", // Terre cuite
              secondary: "#D2B48C", // Beige sable
              accent: "#CD853F", // Ocre
              dark: "#5D4037", // Brun foncé
              light: "#F5F5DC", // Beige clair
            },
          },
          fontFamily: {
            serif: ["Georgia", "serif"],
          },
        },
      },
    }}
  >
    <Html>
      <Head />
      <Body className="bg-ceramika-light font-serif">
        <Container className="mx-auto py-8 px-4 max-w-2xl">
          {/* Header avec logo */}
          <div className="text-center mb-8">
            <Img
              src={`${baseUrl}/images/ceramika-logo.png`}
              width="200"
              height="80"
              alt="Céramique Studio"
              className="mx-auto mb-4"
            />
            <Text className="text-ceramika-dark text-sm italic">L'art de la céramique artisanale</Text>
          </div>

          {/* Contenu principal */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">{children}</div>

          {/* Footer */}
          <div className="text-center">
            <Hr className="border-ceramika-secondary my-6" />
            <Text className="text-ceramika-dark text-sm mb-2">Ceramika - Créations artisanales uniques</Text>
            <Text className="text-gray-500 text-xs mb-4">10 rue Solférino - 06220 Vallauris, France</Text>
          </div>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)
