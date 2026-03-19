import { Section, Text, Row, Column, Button } from "@react-email/components"
import { CeramikaLayout } from "./components/ceramika-layout"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface NewOrderAdminEmailProps {
  orderNumber: string
  orderDate: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
}

export const NewOrderAdminEmail = ({
  orderNumber,
  orderDate,
  customerName,
  customerEmail,
  items,
  subtotal,
  shipping,
  total,
}: NewOrderAdminEmailProps) => (
  <CeramikaLayout preview={`Nouvelle commande #${orderNumber} - ${customerName}`}>
    <Text className="text-2xl font-bold text-ceramika-primary mb-6 text-center">
      🎉 Nouvelle commande reçue !
    </Text>

    <Text className="text-base leading-relaxed text-gray-700 mb-6">
      Une nouvelle commande vient d'être passée sur Ceramika.
    </Text>

    {/* Infos client */}
    <div className="bg-ceramika-light p-4 rounded-lg mb-6">
      <Text className="text-lg font-semibold text-ceramika-dark mb-2">Informations client</Text>
      <Text className="text-sm text-gray-700 m-0 mb-1">
        <strong>Client :</strong> {customerName}
      </Text>
      <Text className="text-sm text-gray-700 m-0 mb-1">
        <strong>Email :</strong> {customerEmail}
      </Text>
      <Row>
        <Column>
          <Text className="text-sm text-gray-600 m-0">
            <strong>Commande :</strong> #{orderNumber}
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
    <Text className="text-lg font-semibold text-ceramika-dark mb-4">Articles commandés</Text>

    {items.map((item, index) => (
      <div key={index} className="border-b border-gray-200 pb-3 mb-3">
        <Row>
          <Column className="w-3/4">
            <Text className="text-base font-semibold text-gray-800 m-0 mb-1">{item.name}</Text>
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

    {/* Récapitulatif */}
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
          <Text className="text-sm text-gray-600 m-0">Livraison</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-sm text-gray-600 m-0">
            {shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}
          </Text>
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

    <Section className="text-center mb-6">
      <Button
        className="bg-ceramika-primary hover:bg-ceramika-dark rounded-lg text-white text-base font-semibold no-underline px-8 py-4 inline-block"
        href="https://cerami-ka.com/admin/orders"
      >
        Voir la commande dans l'admin
      </Button>
    </Section>
  </CeramikaLayout>
)

NewOrderAdminEmail.PreviewProps = {
  orderNumber: "CER-2024-001",
  orderDate: "20 mars 2026",
  customerName: "Marie Darriet",
  customerEmail: "yo@ateliercruchon.fr",
  items: [
    { name: "Vase Terre Cuite Artisanal", quantity: 1, price: 89.0 },
    { name: "Set de 4 Bols en Grès", quantity: 2, price: 78.9 },
  ],
  subtotal: 246.8,
  shipping: 1.2,
  total: 248.0,
} as NewOrderAdminEmailProps

export default NewOrderAdminEmail
