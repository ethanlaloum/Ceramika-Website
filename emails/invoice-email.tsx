import { Button, Section, Text, Row, Column } from "@react-email/components"
import { CeramikaLayout } from "./components/ceramika-layout"

interface InvoiceItem {
  name: string
  artist: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface InvoiceEmailProps {
  userFirstname: string
  invoiceNumber: string
  invoiceDate: string
  orderNumber: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  billingAddress: {
    name: string
    company?: string
    address: string
    city: string
    zipCode: string
    country: string
    vatNumber?: string
  }
  downloadUrl: string
}

export const InvoiceEmail = ({
  userFirstname,
  invoiceNumber,
  invoiceDate,
  orderNumber,
  items,
  subtotal,
  tax,
  total,
  billingAddress,
  downloadUrl,
}: InvoiceEmailProps) => (
  <CeramikaLayout preview={`Facture ${invoiceNumber} - Céramique Studio`}>
    <Text className="text-2xl font-bold text-ceramika-primary mb-6 text-center">📄 Votre facture est disponible</Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-4">Bonjour {userFirstname},</Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-6">
      Veuillez trouver ci-joint votre facture pour la commande #{orderNumber}. Vous pouvez la télécharger et l'imprimer
      à tout moment depuis votre espace client.
    </Text>

    {/* Informations facture */}
    <div className="bg-ceramika-light p-4 rounded-lg mb-6">
      <Text className="text-lg font-semibold text-ceramika-dark mb-3">Informations de facturation</Text>
      <Row className="mb-2">
        <Column className="w-1/2">
          <Text className="text-sm text-gray-600 m-0">
            <strong>Facture N° :</strong> {invoiceNumber}
          </Text>
        </Column>
        <Column className="w-1/2">
          <Text className="text-sm text-gray-600 m-0">
            <strong>Date :</strong> {invoiceDate}
          </Text>
        </Column>
      </Row>
      <Text className="text-sm text-gray-600 m-0">
        <strong>Commande N° :</strong> {orderNumber}
      </Text>
    </div>

    {/* Adresse de facturation */}
    <Text className="text-lg font-semibold text-ceramika-dark mb-2">Adresse de facturation</Text>
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <Text className="text-sm text-gray-700 m-0 mb-1">{billingAddress.name}</Text>
      {billingAddress.company && <Text className="text-sm text-gray-700 m-0 mb-1">{billingAddress.company}</Text>}
      <Text className="text-sm text-gray-700 m-0 mb-1">{billingAddress.address}</Text>
      <Text className="text-sm text-gray-700 m-0 mb-1">
        {billingAddress.zipCode} {billingAddress.city}
      </Text>
      <Text className="text-sm text-gray-700 m-0 mb-1">{billingAddress.country}</Text>
      {billingAddress.vatNumber && (
        <Text className="text-sm text-gray-700 m-0">N° TVA : {billingAddress.vatNumber}</Text>
      )}
    </div>

    {/* Détail des articles */}
    <Text className="text-lg font-semibold text-ceramika-dark mb-4">Détail de la facture</Text>

    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
      {/* En-tête du tableau */}
      <div className="bg-ceramika-secondary p-3">
        <Row>
          <Column className="w-2/5">
            <Text className="text-sm font-semibold text-ceramika-dark m-0">Article</Text>
          </Column>
          <Column className="w-1/5 text-center">
            <Text className="text-sm font-semibold text-ceramika-dark m-0">Qté</Text>
          </Column>
          <Column className="w-1/5 text-center">
            <Text className="text-sm font-semibold text-ceramika-dark m-0">Prix unit.</Text>
          </Column>
          <Column className="w-1/5 text-right">
            <Text className="text-sm font-semibold text-ceramika-dark m-0">Total</Text>
          </Column>
        </Row>
      </div>

      {/* Lignes d'articles */}
      {items.map((item, index) => (
        <div key={index} className="p-3 border-b border-gray-100 last:border-b-0">
          <Row>
            <Column className="w-2/5">
              <Text className="text-sm text-gray-800 m-0 mb-1 font-medium">{item.name}</Text>
              <Text className="text-xs text-ceramika-primary m-0">Par {item.artist}</Text>
            </Column>
            <Column className="w-1/5 text-center">
              <Text className="text-sm text-gray-700 m-0">{item.quantity}</Text>
            </Column>
            <Column className="w-1/5 text-center">
              <Text className="text-sm text-gray-700 m-0">{item.unitPrice.toFixed(2)} €</Text>
            </Column>
            <Column className="w-1/5 text-right">
              <Text className="text-sm font-semibold text-gray-800 m-0">{item.totalPrice.toFixed(2)} €</Text>
            </Column>
          </Row>
        </div>
      ))}
    </div>

    {/* Totaux */}
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <Row className="mb-2">
        <Column className="w-3/4">
          <Text className="text-sm text-gray-600 m-0">Sous-total HT</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-sm text-gray-600 m-0">{subtotal.toFixed(2)} €</Text>
        </Column>
      </Row>
      <Row className="mb-2">
        <Column className="w-3/4">
          <Text className="text-sm text-gray-600 m-0">TVA (20%)</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-sm text-gray-600 m-0">{tax.toFixed(2)} €</Text>
        </Column>
      </Row>
      <hr className="border-gray-300 my-2" />
      <Row>
        <Column className="w-3/4">
          <Text className="text-base font-bold text-ceramika-dark m-0">Total TTC</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-base font-bold text-ceramika-dark m-0">{total.toFixed(2)} €</Text>
        </Column>
      </Row>
    </div>

    <Section className="text-center mb-6">
      <Button
        className="bg-ceramika-primary hover:bg-ceramika-dark rounded-lg text-white text-base font-semibold no-underline px-8 py-4 inline-block"
        href={downloadUrl}
      >
        Télécharger la facture PDF
      </Button>
    </Section>

    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
      <Text className="text-sm text-blue-800 m-0">
        <strong>💡 Bon à savoir :</strong> Cette facture est également disponible dans votre espace client à tout
        moment.
      </Text>
    </div>

    <Text className="text-base leading-relaxed text-gray-700 mb-2">Cordialement,</Text>
    <Text className="text-base text-ceramika-primary font-semibold">L'équipe Céramique Studio</Text>
  </CeramikaLayout>
)

InvoiceEmail.PreviewProps = {
  userFirstname: "Claire",
  invoiceNumber: "FAC-2024-001",
  invoiceDate: "15 janvier 2024",
  orderNumber: "CER-2024-001",
  items: [
    {
      name: "Vase Terre Cuite Artisanal",
      artist: "Marie Dubois",
      quantity: 1,
      unitPrice: 89.0,
      totalPrice: 89.0,
    },
    {
      name: "Set de 4 Bols en Grès",
      artist: "Pierre Martin",
      quantity: 1,
      unitPrice: 156.0,
      totalPrice: 156.0,
    },
  ],
  subtotal: 245.0,
  tax: 49.0,
  total: 294.0,
  billingAddress: {
    name: "Claire Moreau",
    company: "Atelier Design",
    address: "12 Rue des Créateurs",
    city: "Paris",
    zipCode: "75011",
    country: "France",
    vatNumber: "FR12345678901",
  },
  downloadUrl: "https://ceramique-studio.com/invoices/FAC-2024-001.pdf",
} as InvoiceEmailProps

export default InvoiceEmail
