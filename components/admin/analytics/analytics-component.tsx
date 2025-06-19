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
      <div className="space-y-4 md:space-y-6">
        <div className="animate-pulse">
          <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4 md:w-1/4 mb-2 md:mb-4"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-full md:w-1/2 mb-4 md:mb-6"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 md:h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="h-48 md:h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 md:h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-sm md:text-base text-gray-600">Impossible de charger les données d'analyse</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Analytics & Rapports</h1>
          <p className="text-sm md:text-base text-gray-600">Analyses détaillées et métriques de performance</p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport} className="w-full md:w-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="md:inline">Exporter</span>
          </Button>
        </div>
      </div>

      {/* KPIs - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Revenus</p>
                <p className="text-lg md:text-2xl font-bold truncate">€{analytics.revenue.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.revenue.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs md:text-sm font-medium truncate ${
                      analytics.revenue.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.revenue.change > 0 ? "+" : ""}
                    {analytics.revenue.change}%
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-green-100 rounded-full flex-shrink-0">
                <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Commandes</p>
                <p className="text-lg md:text-2xl font-bold truncate">{analytics.orders.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.orders.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs md:text-sm font-medium truncate ${
                      analytics.orders.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.orders.change > 0 ? "+" : ""}
                    {analytics.orders.change}%
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-blue-100 rounded-full flex-shrink-0">
                <ShoppingCart className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Clients</p>
                <p className="text-lg md:text-2xl font-bold truncate">{analytics.customers.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.customers.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs md:text-sm font-medium truncate ${
                      analytics.customers.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.customers.change > 0 ? "+" : ""}
                    {analytics.customers.change}%
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-purple-100 rounded-full flex-shrink-0">
                <Users className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Produits</p>
                <p className="text-lg md:text-2xl font-bold truncate">{analytics.products.total.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {analytics.products.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs md:text-sm font-medium truncate ${
                      analytics.products.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {analytics.products.change > 0 ? "+" : ""}
                    {analytics.products.change}%
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-orange-100 rounded-full flex-shrink-0">
                <Package className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">Produits les plus vendus</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Performance des produits sur la période sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm md:text-base font-medium truncate">{product.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">{product.sales} ventes</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base font-bold flex-shrink-0">€{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">Répartition des commandes</CardTitle>
            <CardDescription className="text-xs md:text-sm">Statut des commandes sur la période</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {analytics.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm md:text-base capitalize truncate">{item.status}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm md:text-base font-bold">{item.count}</p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {((item.count / analytics.orders.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder - Responsive */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-base md:text-lg">Évolution du chiffre d'affaires</CardTitle>
          <CardDescription className="text-xs md:text-sm">Revenus mensuels sur la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="h-48 md:h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-2 md:mb-4" />
              <p className="text-sm md:text-base text-gray-600">Graphique des revenus</p>
              <p className="text-xs md:text-sm text-gray-500">Intégration Chart.js à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
