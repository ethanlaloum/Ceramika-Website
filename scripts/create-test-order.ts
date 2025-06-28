import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestOrder() {
  try {
    // Trouver le premier utilisateur
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('Aucun utilisateur trouvé')
      return
    }

    // Trouver le premier produit
    const product = await prisma.product.findFirst({
      include: {
        artist: true
      }
    })
    if (!product) {
      console.log('Aucun produit trouvé')
      return
    }

    // Créer une commande de test
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: product.price * 2,
        subtotal: product.price * 2,
        tax: product.price * 2 * 0.08,
        shipping: 0,
        status: 'completed',
        orderItems: {
          create: [
            {
              productId: product.id,
              quantity: 2,
              price: product.price,
            }
          ]
        }
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                artist: true
              }
            }
          }
        }
      }
    })

    console.log('Commande de test créée:', {
      id: order.id,
      user: user.email,
      total: order.total,
      items: order.orderItems.length
    })

  } catch (error) {
    console.error('Erreur lors de la création de la commande de test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestOrder()
