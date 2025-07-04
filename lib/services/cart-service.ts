import { prisma } from "@/lib/prisma"

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    artist: {
      name: string
    }
  }
}

export class CartService {
  // Ajouter un item au panier
  static async addToCart(userId: string, productId: string, quantity = 1) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingItem) {
      // Mettre à jour la quantité
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              artist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
    } else {
      // Créer un nouvel item
      return await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              artist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
    }
  }

  // Récupérer le panier d'un utilisateur
  static async getCart(userId: string): Promise<CartItem[]> {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            artist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  // Mettre à jour la quantité
  static async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId)
    }

    return await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            artist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
  }

  // Supprimer un item du panier
  static async removeFromCart(userId: string, productId: string) {
    return await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })
  }

  // Vider le panier
  static async clearCart(userId: string) {
    return await prisma.cartItem.deleteMany({
      where: { userId },
    })
  }

  // Calculer le total du panier
  static async getCartTotal(userId: string) {
    const cartItems = await this.getCart(userId)

    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)

    const tax = subtotal * 0.08 // 8% tax
    const shipping = 0 // Free shipping
    const total = subtotal + tax + shipping

    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
    }
  }

  // Transférer le panier vers une commande
  static async checkoutCart(userId: string) {
    const cartItems = await this.getCart(userId)
    const { subtotal, tax, shipping, total } = await this.getCartTotal(userId)

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        subtotal,
        tax,
        shipping,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Vider le panier après la commande
    await this.clearCart(userId)

    return order
  }
}
