import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

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

    // Chemin vers le fichier .env
    const envPath = join(process.cwd(), '.env')
    
    try {
      // Lire le fichier .env actuel
      const envContent = await readFile(envPath, 'utf-8')
      
      // Mettre à jour la ligne MAINTENANCE_MODE
      const updatedContent = envContent.replace(
        /MAINTENANCE_MODE=.*/,
        `MAINTENANCE_MODE=${maintenance}`
      )
      
      // Écrire le fichier mis à jour
      await writeFile(envPath, updatedContent, 'utf-8')
      
      // Optionnel: redémarrer l'application en production (nécessite un redéploiement sur Vercel)
      // En développement, le serveur Next.js va se recharger automatiquement
      
      return new Response(JSON.stringify({ 
        success: true, 
        maintenanceMode: maintenance 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
      
    } catch (fileError: any) {
      console.error('Erreur fichier .env:', fileError)
      return new Response(JSON.stringify({
        error: 'Erreur lors de la mise à jour du fichier de configuration',
        details: fileError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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

    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
    
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
