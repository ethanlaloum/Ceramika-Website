import { Button, Section, Text, Row, Column } from "@react-email/components"
import { CeramikaLayout } from "./components/ceramika-layout"

interface OrderItem {
  name: string
  artist: string
  quantity: number
  price: number
  image?: string
}

interface OrderConfirmationProps {
  userFirstname: string
  orderNumber: string
  orderDate: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    zipCode: string
    country: string
  }
}

export const OrderConfirmationEmail = ({
  userFirstname,
  orderNumber,
  orderDate,
  items,
  subtotal,
  tax,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationProps) => (
  <CeramikaLayout preview={`Confirmation de votre commande #${orderNumber}`}>
    <Text className="text-2xl font-bold text-ceramika-primary mb-6 text-center">Merci pour votre commande !</Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-4">Bonjour {userFirstname},</Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-6">
      Nous avons bien reçu votre commande et nos artisans préparent déjà vos pièces avec le plus grand soin. Vous
      recevrez un email de confirmation d'expédition dès que votre commande sera en route.
    </Text>

    {/* Détails de la commande */}
    <div className="bg-ceramika-light p-4 rounded-lg mb-6">
      <Text className="text-lg font-semibold text-ceramika-dark mb-2">Détails de la commande</Text>
      <Row>
        <Column>
          <Text className="text-sm text-gray-600 m-0">
            <strong>Numéro :</strong> #{orderNumber}
          </Text>
        </Column>
        <Column>
          <Text className="text-sm text-gray-600 m-0">
            <strong>Date :</strong> {orderDate}
          </Text>
        </Column>
      </Row>
    </div>

    {/* Articles commandés */}
    <Text className="text-lg font-semibold text-ceramika-dark mb-4">Vos créations</Text>

    {items.map((item, index) => (
      <div key={index} className="border-b border-gray-200 pb-4 mb-4">
        <Row>
          <Column className="w-3/4">
            <Text className="text-base font-semibold text-gray-800 m-0 mb-1">{item.name}</Text>
            <Text className="text-sm text-ceramika-primary m-0 mb-1">Par {item.artist}</Text>
            <Text className="text-sm text-gray-600 m-0">Quantité : {item.quantity}</Text>
          </Column>
          <Column className="w-1/4 text-right">
            <Text className="text-base font-semibold text-gray-800 m-0">
              {(item.price * item.quantity).toFixed(2)} €
            </Text>
          </Column>
        </Row>
      </div>
    ))}

    {/* Récapitulatif des prix */}
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <Row className="mb-2">
        <Column className="w-3/4">
          <Text className="text-sm text-gray-600 m-0">Sous-total</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-sm text-gray-600 m-0">{subtotal.toFixed(2)} €</Text>
        </Column>
      </Row>
      <Row className="mb-2">
        <Column className="w-3/4">
          <Text className="text-sm text-gray-600 m-0">TVA</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-sm text-gray-600 m-0">{tax.toFixed(2)} €</Text>
        </Column>
      </Row>
      <Row className="mb-2">
        <Column className="w-3/4">
          <Text className="text-sm text-gray-600 m-0">Livraison</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-sm text-gray-600 m-0">{shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}</Text>
        </Column>
      </Row>
      <hr className="border-gray-300 my-2" />
      <Row>
        <Column className="w-3/4">
          <Text className="text-base font-bold text-ceramika-dark m-0">Total</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-base font-bold text-ceramika-dark m-0">{total.toFixed(2)} €</Text>
        </Column>
      </Row>
    </div>

    {/* Adresse de livraison */}
    <Text className="text-lg font-semibold text-ceramika-dark mb-2">Adresse de livraison</Text>
    <div className="bg-ceramika-light p-4 rounded-lg mb-6">
      <Text className="text-sm text-gray-700 m-0 mb-1">{shippingAddress.name}</Text>
      <Text className="text-sm text-gray-700 m-0 mb-1">{shippingAddress.address}</Text>
      <Text className="text-sm text-gray-700 m-0">
        {shippingAddress.zipCode} {shippingAddress.city}, {shippingAddress.country}
      </Text>
    </div>

    <Section className="text-center mb-6">
      <Button
        className="bg-ceramika-primary hover:bg-ceramika-dark rounded-lg text-white text-base font-semibold no-underline px-8 py-4 inline-block"
        href={`https://ceramique-studio.com/orders/${orderNumber}`}
      >
        Suivre ma commande
      </Button>
    </Section>

    <Text className="text-base leading-relaxed text-gray-700 mb-2">Merci de votre confiance,</Text>
    <Text className="text-base text-ceramika-primary font-semibold">L'équipe Céramique Studio</Text>
  </CeramikaLayout>
)

OrderConfirmationEmail.PreviewProps = {
  userFirstname: "Sophie",
  orderNumber: "CER-2024-001",
  orderDate: "15 janvier 2024",
  items: [
    {
      name: "Vase Terre Cuite Artisanal",
      artist: "Marie Dubois",
      quantity: 1,
      price: 89.0,
    },
    {
      name: "Set de 4 Bols en Grès",
      artist: "Pierre Martin",
      quantity: 1,
      price: 156.0,
    },
  ],
  subtotal: 245.0,
  tax: 19.6,
  shipping: 0,
  total: 264.6,
  shippingAddress: {
    name: "Sophie Durand",
    address: "45 Avenue des Arts",
    city: "Lyon",
    zipCode: "69001",
    country: "France",
  },
} as OrderConfirmationProps

export default OrderConfirmationEmail
