"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Download, Calendar, Package, Truck, CheckCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  userId: string
  status: string
  total: number
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string[]
    }
  }[]
}

export function OrdersComponent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Statut de la commande mis à jour",
        })
        fetchOrders()
      } else {
        throw new Error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Calendar className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600">Suivez et gérez toutes les commandes</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par ID, email ou nom..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En traitement</SelectItem>
            <SelectItem value="shipped">Expédié</SelectItem>
            <SelectItem value="delivered">Livré</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg">#{order.id.slice(-8)}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      Client: {order.user.firstName} {order.user.lastName} ({order.user.email})
                    </p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                    <p>Articles: {order.orderItems.length} produit(s)</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-2xl font-bold">€{order.total.toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="processing">En traitement</SelectItem>
                        <SelectItem value="shipped">Expédié</SelectItem>
                        <SelectItem value="delivered">Livré</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la commande #{order.id.slice(-8)}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Informations client</h4>
                                <p>
                                  {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                                </p>
                                <p>{selectedOrder.user.email}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Informations commande</h4>
                                <p>ID: #{selectedOrder.id.slice(-8)}</p>
                                <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString("fr-FR")}</p>
                                <p>
                                  Statut:{" "}
                                  <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Articles commandés</h4>
                              <div className="space-y-2">
                                {selectedOrder.orderItems.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                      <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-2xl font-bold">€{selectedOrder.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
