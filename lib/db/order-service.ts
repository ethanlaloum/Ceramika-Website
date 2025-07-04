import { prisma } from "@/lib/prisma"
import type { Order, OrderItem } from "@prisma/client"

export type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: {
      name: string
      images: string[]
      artist: {
        name: string
      }
    }
  })[]
  user: {
    id: string
    firstName: string | null
    lastName: string | null
  }
}

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return orders
  } catch (error) {
    throw new Error("Failed to fetch user orders")
  }
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    return order
  } catch (error) {
    throw new Error("Failed to fetch order")
  }
}
