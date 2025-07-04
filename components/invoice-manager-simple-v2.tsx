"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Mail, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface InvoiceManagerProps {
  orderId: string
  orderNumber: string
  hasInvoice?: boolean
  invoiceId?: string
  invoiceUrl?: string
  invoiceStatus?: string
}

function InvoiceManager({ 
  orderId, 
  orderNumber, 
  hasInvoice = false,
  invoiceId: propInvoiceId,
  invoiceUrl,
  invoiceStatus = 'none'
}: InvoiceManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  const [invoice, setInvoice] = useState<{
    id: string
    url: string
    pdf: string
    status: string
  } | null>(null)

  const { toast } = useToast()

  // Charger la facture existante au chargement du composant
  useEffect(() => {
    if (hasInvoice && propInvoiceId && !invoice) {
      setInvoice({
        id: propInvoiceId,
        url: invoiceUrl || '',
        pdf: '',
        status: invoiceStatus
      })
    } else if (hasInvoice && !invoice) {
      loadExistingInvoice()
    }
  }, [hasInvoice, propInvoiceId, invoice, invoiceUrl, invoiceStatus])

  // Fonction pour charger une facture existante
  const loadExistingInvoice = async () => {
    setIsLoadingInvoice(true)
    try {
      const response = await fetch(`/api/invoices?orderId=${orderId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setInvoice(data.invoice)
      } else {
        console.error('Erreur lors du chargement de la facture:', data.error)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la facture:', error)
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  // Fonction pour générer une facture avec envoi automatique
  const generateInvoice = async () => {
    setIsGenerating(true)
    try {
      // 1. Générer la facture Stripe
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setInvoice(data.invoice)
        
        // 2. Envoyer automatiquement l'email via Resend
        try {
          const emailResponse = await fetch('/api/invoices/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'send',
              invoiceId: data.invoice.id
            }),
          })

          const emailData = await emailResponse.json()

          if (emailResponse.ok && emailData.success) {
            toast({
              title: "Facture générée et envoyée",
              description: "La facture a été créée et envoyée par email avec succès.",
            })
          } else {
            toast({
              title: "Facture générée",
              description: "Facture créée, mais erreur lors de l'envoi de l'email. Utilisez le bouton 'Renvoyer Email'.",
              variant: "default",
            })
          }
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi automatique de l\'email:', emailError)
          toast({
            title: "Facture générée",
            description: "Facture créée, mais erreur lors de l'envoi de l'email. Utilisez le bouton 'Renvoyer Email'.",
            variant: "default",
          })
        }
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de générer la facture",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la facture",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Fonction pour renvoyer l'email via Resend
  const resendEmail = async () => {
    const currentInvoiceId = invoice?.id || propInvoiceId

    if (!currentInvoiceId && !hasInvoice) {
      toast({
        title: "Erreur",
        description: "Aucune facture trouvée pour renvoyer l'email.",
        variant: "destructive",
      })
      return
    }

    // Si on n'a pas l'ID de la facture mais qu'on sait qu'elle existe, utilisons l'orderId
    const requestData = currentInvoiceId 
      ? { action: 'resend', invoiceId: currentInvoiceId }
      : { action: 'resend', orderId: orderId }

    setIsResendingEmail(true)
    try {
      const response = await fetch('/api/invoices/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Email renvoyé",
          description: "L'email de facturation a été renvoyé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de renvoyer l'email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du renvoi",
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  // Fonction pour récupérer l'URL de la facture depuis Stripe
  const getInvoiceUrl = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/diagnosis?invoiceId=${invoiceId}`)
      const data = await response.json()

      if (response.ok && data.success && data.data.tests.invoiceDetails.success) {
        const invoiceDetails = data.data.tests.invoiceDetails.data
        return {
          url: invoiceDetails.hosted_invoice_url,
          pdf: invoiceDetails.invoice_pdf
        }
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL de facture:', error)
      return null
    }
  }

  // Fonction pour ouvrir la facture directement
  const openInvoiceDirectly = async () => {
    const currentInvoiceId = invoice?.id || propInvoiceId
    
    if (!currentInvoiceId) {
      toast({
        title: "Erreur",
        description: "Aucune facture trouvée",
        variant: "destructive",
      })
      return
    }

    // Si on a déjà l'URL, l'utiliser directement
    if (invoiceUrl || invoice?.url) {
      window.open(invoiceUrl || invoice?.url, '_blank')
      return
    }

    // Sinon, récupérer l'URL depuis Stripe
    const invoiceData = await getInvoiceUrl(currentInvoiceId)
    if (invoiceData?.url) {
      // Mettre à jour l'état avec les URLs récupérées
      setInvoice(prev => prev ? {
        ...prev,
        url: invoiceData.url,
        pdf: invoiceData.pdf
      } : {
        id: currentInvoiceId,
        url: invoiceData.url,
        pdf: invoiceData.pdf,
        status: invoiceStatus
      })
      
      window.open(invoiceData.url, '_blank')
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le lien de la facture",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gestion de la Facture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statut de la facture */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Statut :</span>
          {hasInvoice || invoice ? (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Facture disponible
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Aucune facture
            </Badge>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 flex-wrap">
          {!(hasInvoice || invoice) ? (
            <Button
              onClick={generateInvoice}
              disabled={isGenerating}
              className="flex-1 min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Générer et Envoyer Facture
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                variant="default"
                onClick={openInvoiceDirectly}
                className="flex-1 min-w-[140px]"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir Facture
              </Button>

              <Button
                variant="outline"
                onClick={resendEmail}
                disabled={isResendingEmail}
                className="flex-1 min-w-[120px]"
              >
                {isResendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Renvoyer Email
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Informations sur la commande */}
        <div className="text-sm text-gray-600 pt-2 border-t">
          <div>Commande : {orderNumber}</div>
          {(hasInvoice || invoice) && (
            <div>Facture ID : {propInvoiceId || invoice?.id}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default InvoiceManager
