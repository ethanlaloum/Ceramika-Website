import { Button, Section, Text, Row, Column, Hr } from "@react-email/components"
import { CeramikaLayout } from "./components/ceramika-layout"

export interface StripeInvoiceEmailProps {
  customerName: string
  invoiceNumber: string
  invoiceUrl: string
  invoicePdf: string
  amount: number
  currency: string
  orderNumber?: string
}

export function StripeInvoiceEmail({
  customerName,
  invoiceNumber,
  invoiceUrl,
  invoicePdf,
  amount,
  currency,
  orderNumber
}: StripeInvoiceEmailProps) {
  return (
    <CeramikaLayout preview={`Votre facture Ceramika ${invoiceNumber}`}>
      <Section style={{ padding: "32px 0" }}>
        <Text style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          marginBottom: "24px", 
          color: "#1f2937" 
        }}>
          Votre facture Ceramika
        </Text>

        <Text style={{ 
          fontSize: "16px", 
          marginBottom: "16px", 
          color: "#374151" 
        }}>
          Bonjour {customerName},
        </Text>

        <Text style={{ 
          fontSize: "16px", 
          marginBottom: "24px", 
          color: "#374151",
          lineHeight: "24px"
        }}>
          Merci pour votre commande ! Votre facture est maintenant disponible.
          {orderNumber && ` Votre numéro de commande est : ${orderNumber}.`}
        </Text>

        <Section style={{
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px"
        }}>
          <Row>
            <Column>
              <Text style={{ 
                fontSize: "14px", 
                color: "#6b7280", 
                margin: "0 0 4px 0" 
              }}>
                Numéro de facture
              </Text>
              <Text style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                color: "#1f2937", 
                margin: "0 0 16px 0" 
              }}>
                {invoiceNumber}
              </Text>
            </Column>
            <Column align="right">
              <Text style={{ 
                fontSize: "14px", 
                color: "#6b7280", 
                margin: "0 0 4px 0" 
              }}>
                Montant
              </Text>
              <Text style={{ 
                fontSize: "20px", 
                fontWeight: "700", 
                color: "#059669", 
                margin: "0 0 16px 0" 
              }}>
                {amount.toFixed(2)} {currency}
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={{ marginBottom: "32px" }}>
          <Row>
            <Column style={{ paddingRight: "8px" }}>
              <Button
                href={invoiceUrl}
                style={{
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  display: "inline-block",
                  width: "100%",
                  textAlign: "center"
                }}
              >
                Voir la facture en ligne
              </Button>
            </Column>
            {invoicePdf && (
              <Column style={{ paddingLeft: "8px" }}>
                <Button
                  href={invoicePdf}
                  style={{
                    backgroundColor: "#059669",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  Télécharger PDF
                </Button>
              </Column>
            )}
          </Row>
        </Section>

        <Hr style={{ 
          border: "none", 
          borderTop: "1px solid #e5e7eb", 
          margin: "32px 0" 
        }} />

        <Text style={{ 
          fontSize: "14px", 
          color: "#6b7280", 
          lineHeight: "20px",
          marginBottom: "16px" 
        }}>
          Si vous avez des questions concernant cette facture, n'hésitez pas à nous contacter.
        </Text>

        <Text style={{ 
          fontSize: "16px", 
          color: "#374151",
          marginBottom: "8px" 
        }}>
          Merci de votre confiance,
        </Text>

        <Text style={{ 
          fontSize: "16px", 
          fontWeight: "600", 
          color: "#1f2937" 
        }}>
          L'équipe Ceramika
        </Text>
      </Section>
    </CeramikaLayout>
  )
}
