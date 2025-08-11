// Script pour vérifier et synchroniser l'état de maintenance
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMaintenanceState() {
  try {
    console.log('=== État actuel de maintenance ===')
    
    // Vérifier l'état dans la base de données
    const config = await prisma.siteConfig.findUnique({
      where: { key: 'maintenance_mode' }
    })
    
    console.log('Base de données:', config ? config.value : 'non défini')
    console.log('Variable d\'environnement:', process.env.MAINTENANCE_MODE || 'non définie')
    
    if (config) {
      console.log('\nSynchronisation de la variable d\'environnement...')
      process.env.MAINTENANCE_MODE = config.value
      console.log('Variable synchronisée:', process.env.MAINTENANCE_MODE)
    }
    
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMaintenanceState()
