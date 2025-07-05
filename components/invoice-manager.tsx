"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface InvoiceManagerProps {
  orderId: string
  orderNumber: string
  hasInvoice?: boolean
  invoiceUrl?: string
  invoiceStatus?: string
}

export default function InvoiceManager({ 
  orderId, 
  orderNumber, 
  hasInvoice = false,
  invoiceUrl = '',
  invoiceStatus = ''
}: InvoiceManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [invoice, setInvoice] = useState<any>(null)
  const [emailHistory, setEmailHistory] = useState<any>(null)
  const { toast } = useToast()

  const generateInvoice = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la facture')
      }

      const result = await response.json()
      setInvoice(result.invoice)
      
      toast({
        title: "Facture générée !",
        description: "La facture a été créée et envoyée par email.",
      })
      
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de générer la facture. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const loadInvoice = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/invoices?orderId=${orderId}`)

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la facture')
      }

      const result = await response.json()
      setInvoice(result.invoice)
      
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger la facture.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkEmailHistory = async () => {
    if (!invoice?.id) return
    
    setIsCheckingEmail(true)
    
    try {
      const response = await fetch(`/api/invoices/email?invoiceId=${invoice.id}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification de l\'historique email')
      }
      
      const result = await response.json()
      setEmailHistory(result.data)
      
      toast({
        title: result.data.emailsSent ? "Email trouvé !" : "Aucun email envoyé",
        description: result.message,
        variant: result.data.emailsSent ? "default" : "destructive",
      })
      
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'historique email.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const resendEmail = async () => {
    if (!invoice?.id) return
    
    setIsResending(true)
    
    try {
      const response = await fetch('/api/invoices/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors du renvoi de l\'email')
      }

      const result = await response.json()
      
      toast({
        title: "Email renvoyé !",
        description: "La facture a été renvoyée par email.",
      })
      
      // Recharger l'historique email
      await checkEmailHistory()
      
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'email.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'void':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée'
      case 'open':
        return 'En attente'
      case 'draft':
        return 'Brouillon'
      case 'void':
        return 'Annulée'
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Facture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasInvoice && !invoice ? (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Aucune facture générée pour la commande #{orderNumber}
            </p>
            <Button 
              onClick={generateInvoice}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Générer la facture
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!invoice && hasInvoice && (
              <div className="text-center py-4">
                <Button 
                  onClick={loadInvoice}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Charger la facture
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {invoice && (                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Facture générée</span>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {invoice.url && (
                      <Button 
                        onClick={() => window.open(invoice.url, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Voir la facture
                      </Button>
                    )}
                    
                    {invoice.pdf && (
                      <Button 
                        onClick={() => window.open(invoice.pdf, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </Button>
                    )}
                  </div>

                  {/* Section diagnostic email */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={checkEmailHistory}
                        disabled={isCheckingEmail}
                        variant="outline"
                        size="sm"
                      >
                        {isCheckingEmail ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Vérifier l'envoi
                          </>
                        )}
                      </Button>

                      <Button 
                        onClick={resendEmail}
                        disabled={isResending}
                        variant="outline"
                        size="sm"
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Renvoi...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Renvoyer email
                          </>
                        )}
                      </Button>
                    </div>

                    {emailHistory && (
                      <div className="text-sm space-y-1">
                        <div className={`flex items-center gap-1 ${emailHistory.emailsSent ? 'text-green-600' : 'text-orange-600'}`}>
                          {emailHistory.emailsSent ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Email envoyé avec succès
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              Aucun email envoyé trouvé
                            </>
                          )}
                        </div>
                        {emailHistory.customerEmail && (
                          <p className="text-gray-600">
                            Destinataire: {emailHistory.customerEmail}
                          </p>
                        )}
                        {emailHistory.lastEmailSent && (
                          <p className="text-gray-600">
                            Dernier envoi: {new Date(emailHistory.lastEmailSent * 1000).toLocaleString('fr-FR')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
