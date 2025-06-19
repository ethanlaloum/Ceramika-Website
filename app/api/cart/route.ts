import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { CartService } from "@/lib/services/cart-service"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const cartItems = await CartService.getCart(session.user.id)
    const totals = await CartService.getCartTotal(session.user.id)

    return NextResponse.json({
      items: cartItems,
      ...totals,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    const cartItem = await CartService.addToCart(session.user.id, productId, quantity)

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
