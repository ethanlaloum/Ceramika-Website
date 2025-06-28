"use client"

import { useState } from "react"
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation"
import { OrdersTab } from "@/components/dashboard/orders-tab"
import { WishlistTab } from "@/components/dashboard/wishlist-tab"
import { ProfileTab } from "@/components/dashboard/profile-tab"
import { SettingsTab } from "@/components/dashboard/settings-tab"
import { removeProductFromWishlist } from "@/app/actions/wishlist-actions"
import { useCart } from "@/hooks/use-cart"

interface CustomerDashboardProps {
  user: {
    id: string
    name: string
    email: string
    firstName: string
    lastName: string
    phone: string
  }
  orders: Array<{
    id: string
    date: string
    status: string
    total: number
    items: Array<{
      name: string
      artist: string
      image: string
    }>
  }>
  wishlist: Array<{
    id: string
    name: string
    artist: string
    price: number
    image: string
    inStock: boolean
  }>
  address: {
    id: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    isDefault: boolean
  } | null
  preferences: {
    newProductNotifications: boolean
    orderUpdates: boolean
    artistSpotlights: boolean
    specialOffers: boolean
  }
}

export function CustomerDashboard({ user, orders, wishlist, address, preferences }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState("orders")
  const { addToCart } = useCart()  // Correction ici: addItem -> addToCart

  const handleAddToCart = (item: any) => {
    addToCart({  // Correction ici: addItem -> addToCart
      id: item.id,
      name: item.name,
      artist: item.artist,
      price: item.price,
      image: item.image,
      quantity: 1  // Ajout de la quantité par défaut
    })
  }

  const handleRemoveFromWishlist = async (id: string) => {
    await removeProductFromWishlist(id)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarNavigation activeTab={activeTab} onTabChange={setActiveTab} user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && <OrdersTab orders={orders} />}

            {activeTab === "wishlist" && (
              <WishlistTab
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onRemoveFromWishlist={handleRemoveFromWishlist}
              />
            )}

            {activeTab === "profile" && <ProfileTab user={user} address={address} />}

            {activeTab === "settings" && <SettingsTab initialPreferences={preferences} />}
          </div>
        </div>
      </div>
    </div>
  )
}
