import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getOrderById } from "@/lib/db/order-service"
import { OrderDetail } from "@/components/dashboard/order-detail"
import type { Metadata } from "next"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/customer/login")
  }

  // Await params pour Next.js 15
  const { id } = await params

  try {
    const order = await getOrderById(id)

    if (!order) {
      throw new Error("Order not found")
    }

    // Verify that this order belongs to the current user
    if (order.userId !== session.user.id) {
      throw new Error("Unauthorized")
    }

    // Format order for the UI
    const orderItems = order.orderItems || []
    
    const formattedOrder = {
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      invoiceId: order.invoiceId || undefined, // Ajout de l'invoiceId manquant (convertir null en undefined)
      items: orderItems.map((item) => ({
        id: item.id,
        name: item.product.name,
        artist: item.product.artist.name,
        image: item.product.images[0] || "/placeholder.svg",
        price: item.price,
        quantity: item.quantity,
      })),
      address: null, // Pas d'adresse pour l'instant
    }

    return <OrderDetail order={formattedOrder} />
  } catch (error) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold">Error Loading Order</h2>
            <p>There was a problem loading the order details. Please try again later.</p>
            <Button asChild className="mt-4">
              <a href="/customer/dashboard">Return to Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

// Correction pour generateMetadata aussi
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Commande #${id} | Ceramika`,
  }
}
