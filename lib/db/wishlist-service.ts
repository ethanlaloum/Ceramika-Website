import { prisma } from "@/lib/prisma"
import type { WishlistItem } from "@prisma/client"

export type WishlistItemWithProduct = WishlistItem & {
  product: {
    id: string
    name: string
    price: number
    images: string[]
    inStock: boolean
    stock: number
    artist: {
      name: string
    }
  }
}

export async function getUserWishlist(userId: string): Promise<WishlistItemWithProduct[]> {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            inStock: true,
            stock: true,
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
    return wishlistItems
  } catch (error) {
    throw new Error("Failed to fetch user wishlist")
  }
}

export async function addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
  try {
    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingItem) {
      return existingItem
    }

    // Add new item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    })
    return wishlistItem
  } catch (error) {
    throw new Error("Failed to add item to wishlist")
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })
  } catch (error) {
    throw new Error("Failed to remove item from wishlist")
  }
}
