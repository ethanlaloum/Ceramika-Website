import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard"
import { getUserById, getUserPreferences } from "@/lib/db/user-service"
import { getUserOrders } from "@/lib/db/order-service"
import { getUserWishlist } from "@/lib/db/wishlist-service"
import { SessionCleaner } from "@/components/session-cleaner"


export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/customer/login")
  }

    console.log("Session user ID:", session.user.id) // Add this debug line


  try {
    // Fetch all user data in parallel
    const [user, orders, wishlist, preferences] = await Promise.all([
      getUserById(session.user.id),
      getUserOrders(session.user.id),
      getUserWishlist(session.user.id),
      getUserPreferences(session.user.id),
    ])

    console.log("Found user:", user) // Add this debug line


    if (!user) {
      console.log("User not found in database, clearing session")
      return <SessionCleaner />
    }

    // Format orders for the UI
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      items: order.orderItems.map((item) => ({
        name: item.product.name,
        artist: item.product.artist.name,
        image: item.product.images[0] || "/placeholder.svg",
      })),
    }))

    // Format wishlist items for the UI
    const formattedWishlist = wishlist.map((item) => ({
      id: item.productId,
      name: item.product.name,
      artist: item.product.artist.name,
      price: item.product.price,
      image: item.product.images[0] || "/placeholder.svg",
      inStock: item.product.inStock && item.product.stock > 0,
    }))

    // Get default address or first address
    const defaultAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0] || null

    return (
      <CustomerDashboard
        user={{
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
        }}
        orders={formattedOrders}
        wishlist={formattedWishlist}
        address={
          defaultAddress
            ? {
                id: defaultAddress.id,
                addressLine1: defaultAddress.addressLine1,
                addressLine2: defaultAddress.addressLine2 || "",
                city: defaultAddress.city,
                state: defaultAddress.state,
                zipCode: defaultAddress.zipCode,
                isDefault: defaultAddress.isDefault,
              }
            : null
        }
        preferences={preferences}
      />
    )
  } catch (error) {
    console.error("Error loading dashboard data:", error)
    return (
      <div className="min-h-screen bg-stone-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
            <p>There was a problem loading your dashboard data. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }
}
