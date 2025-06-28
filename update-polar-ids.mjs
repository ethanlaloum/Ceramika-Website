import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

async function updateProductsPolarIds() {
  try {
    console.log('📄 Lecture du fichier CSV...')
    
    // Lire le fichier CSV
    const csvContent = fs.readFileSync('/Users/ethanlaloum/Desktop/Freelance/ceramika/Produits_clean.csv', 'utf-8')
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    })
    
    console.log(`📊 ${records.length} produits trouvés dans le CSV`)
    
    // Vérifier d'abord combien de produits existent en base
    const existingProducts = await prisma.product.count()
    console.log(`🗄️ ${existingProducts} produits en base de données`)
    
    // Mettre à jour les polarId
    let updatedCount = 0
    let notFoundCount = 0
    
    for (const record of records) {
      try {
        const result = await prisma.product.update({
          where: { id: record.id },
          data: { polarId: record.polarId }
        })
        updatedCount++
        
        if (updatedCount % 50 === 0) {
          console.log(`⏳ Mis à jour: ${updatedCount}/${records.length}`)
        }
      } catch (error) {
        if (error.code === 'P2025') {
          // Produit non trouvé
          notFoundCount++
        } else {
          console.error(`❌ Erreur pour le produit ${record.id}:`, error.message)
        }
      }
    }
    
    console.log(`✅ Mise à jour terminée:`)
    console.log(`   - ${updatedCount} produits mis à jour`)
    console.log(`   - ${notFoundCount} produits non trouvés en base`)
    
    // Vérification finale
    const productsWithPolarId = await prisma.product.count({
      where: {
        polarId: {
          not: null,
          not: ''
        }
      }
    })
    
    console.log(`🎯 ${productsWithPolarId} produits ont maintenant un polarId`)
    
    // Exemples de produits mis à jour
    const sampleProducts = await prisma.product.findMany({
      where: {
        polarId: {
          not: null,
          not: ''
        }
      },
      select: {
        id: true,
        name: true,
        polarId: true
      },
      take: 5
    })
    
    console.log('📋 Exemples de produits avec polarId:')
    sampleProducts.forEach(p => {
      console.log(`   - ${p.name}: ${p.polarId}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductsPolarIds()
