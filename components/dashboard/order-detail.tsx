"use client"

import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface OrderDetailProps {
  order: {
    id: string
    date: string
    status: string
    total: number
    subtotal: number
    tax: number
    shipping: number
    items: Array<{
      id: string
      name: string
      artist: string
      image: string
      price: number
      quantity: number
    }>
    address: {
      firstName: string
      lastName: string
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      zipCode: string
      country: string
    } | null
  }
}

export function OrderDetail({ order }: OrderDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "SHIPPED":
        return "bg-blue-100 text-blue-800"
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800"
      case "PENDING":
        return "bg-orange-100 text-orange-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "Livré"
      case "SHIPPED":
        return "Expédié"
      case "PROCESSING":
        return "En traitement"
      case "PENDING":
        return "En attente"
      case "CANCELLED":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <a href="/customer/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au Tableau de Bord
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Commande {order.id}</CardTitle>
                  <p className="text-stone-600 text-sm">Passée le {new Date(order.date).toLocaleDateString("fr-FR")}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>{formatStatus(order.status)}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-800">{item.name}</h3>
                        <p className="text-sm text-stone-600">par {item.artist}</p>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm text-stone-600">Quantité: {item.quantity}</p>
                          <p className="font-medium text-stone-800">{item.price.toFixed(2)}€</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la Commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Sous-total</span>
                    <span className="font-medium">{order.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Taxes</span>
                    <span className="font-medium">{order.tax.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Livraison</span>
                    <span className="font-medium">
                      {order.shipping > 0 ? `${order.shipping.toFixed(2)}€` : "Gratuit"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{order.total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.address && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Adresse de Livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p>{order.address.addressLine1}</p>
                    {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                    <p>
                      {order.address.city}, {order.address.state} {order.address.zipCode}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
