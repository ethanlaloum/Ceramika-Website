"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Mail, Phone, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: string
  createdAt: Date
  updatedAt: Date
  orders: {
    id: string
    total: number
    status: string
    createdAt: Date
  }[]
  addresses: {
    id: string
    addressLine1: string
    city: string
    country: string
    isDefault: boolean
  }[]
  wishlistItems: {
    id: string
    product: {
      id: string
      name: string
      price: number
    }
  }[]
}

export function CustomersComponent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCustomerStats = (customer: Customer) => {
    const totalOrders = customer.orders.length
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    return { totalOrders, totalSpent, avgOrderValue }
  }

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.email.toLowerCase().includes(searchLower) ||
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchLower) ||
      (customer.phone && customer.phone.includes(searchTerm))
    )
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600">CRM et profils clients détaillés</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{customers.length} clients</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const stats = getCustomerStats(customer)
          return (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant={customer.role === "ADMIN" ? "default" : "secondary"}>{customer.role}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-600">Commandes</p>
                      <p className="font-semibold">{stats.totalOrders}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600">Total dépensé</p>
                      <p className="font-semibold">€{stats.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Inscrit le {new Date(customer.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" onClick={() => setSelectedCustomer(customer)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir le profil
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Profil de {selectedCustomer?.firstName} {selectedCustomer?.lastName}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedCustomer && (
                        <div className="space-y-6">
                          {/* Informations personnelles */}
                          <div>
                            <h4 className="font-semibold mb-3">Informations personnelles</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Email</p>
                                <p>{selectedCustomer.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Téléphone</p>
                                <p>{selectedCustomer.phone || "Non renseigné"}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Date d'inscription</p>
                                <p>{new Date(selectedCustomer.createdAt).toLocaleDateString("fr-FR")}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Rôle</p>
                                <Badge variant={selectedCustomer.role === "ADMIN" ? "default" : "secondary"}>
                                  {selectedCustomer.role}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Statistiques */}
                          <div>
                            <h4 className="font-semibold mb-3">Statistiques d'achat</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <Card>
                                <CardContent className="p-4 text-center">
                                  <p className="text-2xl font-bold">{getCustomerStats(selectedCustomer).totalOrders}</p>
                                  <p className="text-sm text-gray-600">Commandes</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4 text-center">
                                  <p className="text-2xl font-bold">
                                    €{getCustomerStats(selectedCustomer).totalSpent.toFixed(0)}
                                  </p>
                                  <p className="text-sm text-gray-600">Total dépensé</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4 text-center">
                                  <p className="text-2xl font-bold">
                                    €{getCustomerStats(selectedCustomer).avgOrderValue.toFixed(0)}
                                  </p>
                                  <p className="text-sm text-gray-600">Panier moyen</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          {/* Adresses */}
                          <div>
                            <h4 className="font-semibold mb-3">Adresses</h4>
                            {selectedCustomer.addresses.length > 0 ? (
                              <div className="space-y-2">
                                {selectedCustomer.addresses.map((address) => (
                                  <div key={address.id} className="p-3 border rounded flex items-start justify-between">
                                    <div className="flex items-start space-x-2">
                                      <MapPin className="h-4 w-4 mt-1 text-gray-400" />
                                      <div>
                                        <p className="text-sm">{address.addressLine1}</p>
                                        <p className="text-sm text-gray-600">
                                          {address.city}, {address.country}
                                        </p>
                                      </div>
                                    </div>
                                    {address.isDefault && (
                                      <Badge variant="outline" className="text-xs">
                                        Par défaut
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 text-sm">Aucune adresse enregistrée</p>
                            )}
                          </div>

                          {/* Commandes récentes */}
                          <div>
                            <h4 className="font-semibold mb-3">Commandes récentes</h4>
                            {selectedCustomer.orders.length > 0 ? (
                              <div className="space-y-2">
                                {selectedCustomer.orders.slice(0, 5).map((order) => (
                                  <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                                    <div>
                                      <p className="font-medium">#{order.id.slice(-8)}</p>
                                      <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">€{order.total.toFixed(2)}</p>
                                      <Badge className="text-xs">{order.status}</Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 text-sm">Aucune commande</p>
                            )}
                          </div>

                          {/* Liste de souhaits */}
                          <div>
                            <h4 className="font-semibold mb-3">Liste de souhaits</h4>
                            {selectedCustomer.wishlistItems.length > 0 ? (
                              <div className="space-y-2">
                                {selectedCustomer.wishlistItems.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="font-semibold">€{item.product.price.toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 text-sm">Liste de souhaits vide</p>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
