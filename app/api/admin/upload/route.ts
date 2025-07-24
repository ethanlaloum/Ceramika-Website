import { NextRequest } from 'next/server'
import { put, del } from '@vercel/blob'
import { auth } from '@/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Vérification du token Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(JSON.stringify({ error: 'Configuration Vercel Blob manquante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Récupération des données du formulaire
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(JSON.stringify({ error: 'Aucun fichier fourni' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ 
        error: `Type de fichier non autorisé. Types acceptés: ${ALLOWED_TYPES.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
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

    try {
      // Upload vers Vercel Blob
      const blob = await put(fileName, file, {
        access: 'public',
        contentType: file.type,
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
      console.error('Erreur upload Vercel Blob:', blobError)
      return new Response(JSON.stringify({
        error: 'Erreur lors de l\'upload vers Vercel Blob',
        details: blobError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error: any) {
    console.error('Erreur upload:', error)
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
    // Vérification de l'authentification
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL manquante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      await del(url)
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (deleteError: any) {
      console.error('Erreur suppression:', deleteError)
      return new Response(JSON.stringify({
        error: 'Erreur lors de la suppression',
        details: deleteError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error: any) {
    console.error('Erreur suppression API:', error)
    return new Response(JSON.stringify({
      error: 'Erreur interne du serveur',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
