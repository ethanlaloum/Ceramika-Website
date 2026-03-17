import { Button, Section, Text } from "@react-email/components"
import { CeramikaLayout } from "./components/ceramika-layout"

interface WelcomeEmailProps {
  userFirstname: string
}

export const CeramikaWelcomeEmail = ({ userFirstname }: WelcomeEmailProps) => (
  <CeramikaLayout preview="Bienvenue dans l'univers de la céramique artisanale">
    <Text className="text-2xl font-bold text-ceramika-primary mb-6 text-center">
      Bienvenue chez Céramique Studio, {userFirstname} !
    </Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-4">Chère {userFirstname},</Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-4">
      Nous sommes ravis de vous accueillir dans notre communauté d'amateurs d'art céramique. Chez Céramique Studio,
      chaque pièce raconte une histoire, façonnée avec passion par nos artisans talentueux.
    </Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-6">
      Découvrez notre collection exclusive de céramiques artisanales, des pièces uniques qui apporteront beauté et
      authenticité à votre quotidien.
    </Text>

    <Section className="text-center mb-6">
      <Button
        className="bg-ceramika-primary hover:bg-ceramika-dark rounded-lg text-white text-base font-semibold no-underline px-8 py-4 inline-block transition-colors"
        href="https://ceramique-studio.com/collections"
      >
        Découvrir nos créations
      </Button>
    </Section>



    <Text className="text-base leading-relaxed text-gray-700 mb-2">Avec toute notre gratitude,</Text>
    <Text className="text-base text-ceramika-primary font-semibold">L'équipe Céramique Studio</Text>
  </CeramikaLayout>
)

CeramikaWelcomeEmail.PreviewProps = {
  userFirstname: "Marie",
  userEmail: "marie@example.com",
} as WelcomeEmailProps

export default CeramikaWelcomeEmail
