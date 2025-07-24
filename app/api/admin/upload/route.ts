import { NextRequest } from 'next/server'
import { put, del } from '@vercel/blob'
import { auth } from '@/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API - Début du traitement')
    
    // Vérification de l'authentification
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      console.log('❌ Upload API - Accès non autorisé:', session?.user?.role)
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Vérification du token Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('❌ Upload API - Token Vercel Blob manquant')
      return new Response(JSON.stringify({ error: 'Configuration Vercel Blob manquante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('✅ Upload API - Authentification validée pour:', session.user.email)

    // Récupération des données du formulaire
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('❌ Upload API - Aucun fichier trouvé dans formData')
      return new Response(JSON.stringify({ error: 'Aucun fichier fourni' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('📁 Upload API - Fichier reçu:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('❌ Upload API - Type de fichier non autorisé:', file.type)
      return new Response(JSON.stringify({ 
        error: `Type de fichier non autorisé. Types acceptés: ${ALLOWED_TYPES.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      console.log('❌ Upload API - Fichier trop volumineux:', file.size)
      return new Response(JSON.stringify({ 
        error: `Fichier trop volumineux. Taille maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Génération d'un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `product-${timestamp}-${randomString}.${fileExtension}`

    console.log('🔄 Upload API - Upload vers Vercel Blob:', fileName)

    try {
      // Upload vers Vercel Blob
      const blob = await put(fileName, file, {
        access: 'public',
        contentType: file.type,
      })

      console.log('✅ Upload API - Upload réussi vers Vercel Blob:', {
        url: blob.url,
        pathname: blob.pathname
      })

      return new Response(JSON.stringify({
        success: true,
        url: blob.url,
        filename: fileName,
        type: file.type
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } catch (blobError: any) {
      console.error('❌ Upload API - Erreur Vercel Blob:', blobError)
      return new Response(JSON.stringify({
        error: 'Erreur lors de l\'upload vers Vercel Blob',
        details: blobError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error: any) {
    console.error('❌ Upload API - Erreur générale:', error)
    return new Response(JSON.stringify({
      error: 'Erreur interne du serveur',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Delete API - Début du traitement')
    
    // Vérification de l'authentification
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      console.log('❌ Delete API - Accès non autorisé')
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      console.log('❌ Delete API - URL manquante')
      return new Response(JSON.stringify({ error: 'URL manquante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('🔄 Delete API - Suppression de:', url)

    try {
      await del(url)
      console.log('✅ Delete API - Suppression réussie')
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (deleteError: any) {
      console.error('❌ Delete API - Erreur suppression:', deleteError)
      return new Response(JSON.stringify({
        error: 'Erreur lors de la suppression',
        details: deleteError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error: any) {
    console.error('❌ Delete API - Erreur générale:', error)
    return new Response(JSON.stringify({
      error: 'Erreur interne du serveur',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
