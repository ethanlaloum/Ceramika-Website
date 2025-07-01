"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import {
  updateUserProfile,
  updateUserEmail,
  createOrUpdateAddress,
  deleteAddress,
  updateUserPreferences,
} from "@/lib/db/user-service"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your profile")
  }

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string

  try {
    await updateUserProfile(session.user.id, {
      firstName,
      lastName,
      phone,
    })

    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updateEmail(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your email")
  }

  const email = formData.get("email") as string

  try {
    await updateUserEmail(session.user.id, email)
    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update email" }
  }
}

export async function saveAddress(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to save an address")
  }

  const addressId = formData.get("addressId") as string | undefined
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const addressLine1 = formData.get("addressLine1") as string
  const addressLine2 = formData.get("addressLine2") as string | undefined
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zipCode = formData.get("zipCode") as string
  const country = (formData.get("country") as string) || "France"
  const isDefault = formData.get("isDefault") === "on"

  try {
    await createOrUpdateAddress(session.user.id, {
      id: addressId || undefined,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault,
    })

    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to save address" }
  }
}

export async function removeAddress(addressId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete an address")
  }

  try {
    await deleteAddress(addressId)
    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete address" }
  }
}

export async function savePreferences(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your preferences")
  }

  const newProductNotifications = formData.get("newProductNotifications") === "on"
  const orderUpdates = formData.get("orderUpdates") === "on"
  const artistSpotlights = formData.get("artistSpotlights") === "on"
  const specialOffers = formData.get("specialOffers") === "on"

  try {
    await updateUserPreferences(session.user.id, {
      newProductNotifications,
      orderUpdates,
      artistSpotlights,
      specialOffers,
    })

    revalidatePath("/customer/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update preferences" }
  }
}
