import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { updateMaintenanceCache } from '@/lib/maintenance-middleware'

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification admin
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { maintenance } = await request.json()
    
    if (typeof maintenance !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Valeur maintenance invalide' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Utiliser la base de données pour stocker l'état de maintenance
    await prisma.siteConfig.upsert({
      where: { key: 'maintenance_mode' },
      update: { 
        value: maintenance.toString(),
        updatedAt: new Date()
      },
      create: {
        key: 'maintenance_mode',
        value: maintenance.toString()
      }
    })

    // Mettre à jour le cache du middleware
    updateMaintenanceCache(maintenance)

    return new Response(JSON.stringify({ 
      success: true, 
      maintenanceMode: maintenance,
      message: 'Mode maintenance mis à jour avec succès'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Erreur API maintenance:', error)
    return new Response(JSON.stringify({
      error: 'Erreur interne du serveur',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function GET() {
  try {
    // Vérification de l'authentification admin
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Récupérer l'état depuis la base de données
    let maintenanceMode = false
    
    try {
      const config = await prisma.siteConfig.findUnique({
        where: { key: 'maintenance_mode' }
      })
      
      if (config) {
        maintenanceMode = config.value === 'true'
      }
    } catch (dbError) {
      // Si la table n'existe pas encore, utiliser la variable d'environnement comme fallback
      maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
    }
    
    return new Response(JSON.stringify({ 
      maintenanceMode 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Erreur get maintenance:', error)
    return new Response(JSON.stringify({
      error: 'Erreur interne du serveur',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
