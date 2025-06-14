"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: Array<{
    name: string
    artist: string
    image: string
  }>
}

interface OrdersTabProps {
  orders: Order[]
}

export function OrdersTab({ orders }: OrdersTabProps) {
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
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-2">Mes Commandes</h1>
        <p className="text-stone-600">Suivez et gérez vos achats de céramiques</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-stone-600">Vous n avez pas encore de commandes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-stone-800">Commande {order.id}</h3>
                    <p className="text-stone-600 text-sm">
                      Passée le {new Date(order.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(order.status)}>{formatStatus(order.status)}</Badge>
                    <span className="font-bold text-stone-800">{order.total.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 flex-shrink-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{item.name}</p>
                        <p className="text-sm text-stone-600">par {item.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/customer/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les Détails
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
