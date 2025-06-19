import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { CartService } from "@/lib/services/cart-service"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { productId } = await params
    const { quantity } = await request.json()

    const cartItem = await CartService.updateQuantity(session.user.id, productId, quantity)

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du panier:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { productId } = await params

    await CartService.removeFromCart(session.user.id, productId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
