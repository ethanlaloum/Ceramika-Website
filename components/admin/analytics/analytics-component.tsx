"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    trend: "up" | "down"
  }
  orders: {
    total: number
    change: number
    trend: "up" | "down"
  }
  customers: {
    total: number
    change: number
    trend: "up" | "down"
  }
  products: {
    total: number
    change: number
    trend: "up" | "down"
  }
  topProducts: {
    id: string
    name: string
    sales: number
    revenue: number
  }[]
  revenueByMonth: {
    month: string
    revenue: number
  }[]
  ordersByStatus: {
    status: string
    count: number
  }[]
}

export function AnalyticsComponent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les analytics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?range=${timeRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-${timeRange}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Succès",
          description: "Rapport exporté avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le rapport",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Impossible de charger les données d'analyse</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Rapports</h1>
          <p className="text-gray-600">Analyses détaillées et métriques de performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold">€{analytics.revenue.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.revenue.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      analytics.revenue.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.revenue.change > 0 ? "+" : ""}
                    {analytics.revenue.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold">{analytics.orders.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.orders.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      analytics.orders.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.orders.change > 0 ? "+" : ""}
                    {analytics.orders.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold">{analytics.customers.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.customers.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      analytics.customers.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.customers.change > 0 ? "+" : ""}
                    {analytics.customers.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold">{analytics.products.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.products.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      analytics.products.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.products.change > 0 ? "+" : ""}
                    {analytics.products.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
            <CardDescription>Performance des produits sur la période sélectionnée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} ventes</p>
                    </div>
                  </div>
                  <p className="font-bold">€{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des commandes</CardTitle>
            <CardDescription>Statut des commandes sur la période</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="capitalize">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.count}</p>
                    <p className="text-sm text-gray-600">{((item.count / analytics.orders.total) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution du chiffre d'affaires</CardTitle>
          <CardDescription>Revenus mensuels sur la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Graphique des revenus</p>
              <p className="text-sm text-gray-500">Intégration Chart.js à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
