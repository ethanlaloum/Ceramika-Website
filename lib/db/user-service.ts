import { prisma } from "@/lib/prisma"
import type { User, Address } from "@prisma/client"

export type UserWithAddress = User & {
  addresses: Address[]
}

export async function getUserById(userId: string): Promise<UserWithAddress | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    })
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user")
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string
    lastName?: string
    phone?: string
  },
): Promise<User> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    })
    return updatedUser
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }
}

export async function updateUserEmail(userId: string, email: string): Promise<User> {
  try {
    // Check if email is already in use by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email already in use")
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
    })
    return updatedUser
  } catch (error) {
    console.error("Error updating user email:", error)
    throw error
  }
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    })
    return addresses
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    throw new Error("Failed to fetch user addresses")
  }
}

export async function getDefaultAddress(userId: string): Promise<Address | null> {
  try {
    const address = await prisma.address.findFirst({
      where: { userId, isDefault: true },
    })
    return address
  } catch (error) {
    console.error("Error fetching default address:", error)
    throw new Error("Failed to fetch default address")
  }
}

export async function createOrUpdateAddress(
  userId: string,
  addressData: {
    id?: string
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  },
): Promise<Address> {
  try {
    const { id, isDefault, ...data } = addressData

    // If setting as default, unset any existing default address
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    if (id) {
      // Update existing address
      return await prisma.address.update({
        where: { id },
        data: { ...data, isDefault },
      })
    } else {
      // Create new address
      return await prisma.address.create({
        data: {
          ...data,
          isDefault,
          user: { connect: { id: userId } },
        },
      })
    }
  } catch (error) {
    console.error("Error creating/updating address:", error)
    throw new Error("Failed to save address")
  }
}

export async function deleteAddress(id: string): Promise<void> {
  try {
    await prisma.address.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Error deleting address:", error)
    throw new Error("Failed to delete address")
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: {
    newProductNotifications?: boolean
    orderUpdates?: boolean
    artistSpotlights?: boolean
    specialOffers?: boolean
  },
): Promise<User> {
  try {
    // Convert preferences to JSON format for storage
    const userPreferences = JSON.stringify(preferences)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { preferences: userPreferences },
    })
    return updatedUser
  } catch (error) {
    console.error("Error updating user preferences:", error)
    throw new Error("Failed to update user preferences")
  }
}

export async function getUserPreferences(userId: string): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    })

    if (!user || !user.preferences) {
      return {
        newProductNotifications: true,
        orderUpdates: true,
        artistSpotlights: true,
        specialOffers: false,
      }
    }

    return JSON.parse(user.preferences as string)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    throw new Error("Failed to fetch user preferences")
  }
}
