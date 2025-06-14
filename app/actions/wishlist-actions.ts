"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { addToWishlist, removeFromWishlist } from "@/lib/db/wishlist-service"

export async function addProductToWishlist(productId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to add items to your wishlist")
  }

  try {
    await addToWishlist(session.user.id, productId)
    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to add to wishlist:", error)
    return { success: false, error: "Failed to add to wishlist" }
  }
}

export async function removeProductFromWishlist(productId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to remove items from your wishlist")
  }

  try {
    await removeFromWishlist(session.user.id, productId)
    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to remove from wishlist:", error)
    return { success: false, error: "Failed to remove from wishlist" }
  }
}
