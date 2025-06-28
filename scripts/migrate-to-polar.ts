import { PrismaClient } from '@prisma/client'
import polar from '../lib/polar'

const prisma = new PrismaClient()

async function migrateProducts() {
  try {
    // Récupère tes produits depuis la DB
    const products = await prisma.product.findMany({
      take: 10 // Commence par 10 pour tester
    })

    console.log(`Migration de ${products.length} produits...`)

    for (const product of products) {
      try {
        // Crée le produit sur Polar
        const polarProduct = await polar.products.create({
          name: product.name,
          description: product.description || '',
          prices: [{
            type: 'one_time',
            priceAmount: Math.round(product.price * 100), // en centimes
            priceCurrency: 'EUR'
          }],
          // Ajoute d'autres champs selon tes besoins
        })

        // Met à jour ton produit local avec l'ID Polar
        await prisma.product.update({
          where: { id: product.id },
          data: { 
            polarId: polarProduct.id 
          }
        })

        console.log(`✅ Produit migré: ${product.name}`)
        
        // Pause pour éviter les rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Erreur pour ${product.name}:`, error)
      }
    }

    console.log('Migration terminée!')
    
  } catch (error) {
    console.error('Erreur générale:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateProducts()