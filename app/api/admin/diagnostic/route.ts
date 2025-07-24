import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile, mkdir, access } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  console.log('🔍 [DIAGNOSTIC] Début du diagnostic système')
  
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        cwd: process.cwd(),
      },
      authentication: {
        authUrlConfigured: !!process.env.NEXTAUTH_URL,
        authSecretConfigured: !!process.env.NEXTAUTH_SECRET,
        trustHostConfigured: !!process.env.AUTH_TRUST_HOST,
      },
      filesystem: {} as any,
      errors: [] as string[]
    }

    // Test d'authentification
    try {
      const session = await auth()
      diagnostics.authentication.sessionWorks = true
      diagnostics.authentication.hasSession = !!session
      diagnostics.authentication.userRole = session?.user?.role
    } catch (authError) {
      diagnostics.authentication.sessionWorks = false
      diagnostics.authentication.error = authError instanceof Error ? authError.message : 'Erreur auth inconnue'
      diagnostics.errors.push('AUTH_ERROR: ' + (authError instanceof Error ? authError.message : 'Inconnu'))
    }

    // Test du système de fichiers
    const testPaths = [
      process.cwd(),
      join(process.cwd(), 'public'),
      join(process.cwd(), 'public', 'uploads'),
      join(process.cwd(), 'public', 'uploads', 'products')
    ]

    for (const testPath of testPaths) {
      const pathKey = testPath.replace(process.cwd(), '').replace(/^\//, '') || 'root'
      try {
        const exists = existsSync(testPath)
        diagnostics.filesystem[pathKey] = {
          exists,
          path: testPath,
          accessible: false,
          writable: false
        }

        if (exists) {
          // Test d'accès
          try {
            await access(testPath)
            diagnostics.filesystem[pathKey].accessible = true
          } catch (accessError) {
            diagnostics.errors.push(`ACCESS_ERROR ${pathKey}: ${accessError instanceof Error ? accessError.message : 'Inconnu'}`)
          }

          // Test d'écriture
          if (diagnostics.filesystem[pathKey].accessible) {
            try {
              const testFile = join(testPath, `test-diagnostic-${Date.now()}.txt`)
              await writeFile(testFile, 'test diagnostic')
              await writeFile(testFile, '') // Effacer
              diagnostics.filesystem[pathKey].writable = true
            } catch (writeError) {
              diagnostics.errors.push(`WRITE_ERROR ${pathKey}: ${writeError instanceof Error ? writeError.message : 'Inconnu'}`)
            }
          }
        }
      } catch (pathError) {
        diagnostics.errors.push(`PATH_ERROR ${pathKey}: ${pathError instanceof Error ? pathError.message : 'Inconnu'}`)
      }
    }

    // Test de création de dossier si nécessaire
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
    if (!existsSync(uploadsDir)) {
      try {
        await mkdir(uploadsDir, { recursive: true })
        diagnostics.filesystem.uploadDirCreated = true
      } catch (mkdirError) {
        diagnostics.filesystem.uploadDirCreated = false
        diagnostics.errors.push(`MKDIR_ERROR: ${mkdirError instanceof Error ? mkdirError.message : 'Inconnu'}`)
      }
    }

    // Résumé
    const hasErrors = diagnostics.errors.length > 0
    const authOk = diagnostics.authentication.sessionWorks
    const filesystemOk = diagnostics.filesystem['public/uploads/products']?.writable || false

    const summary = {
      overall: hasErrors ? 'ERRORS' : 'OK',
      authentication: authOk ? 'OK' : 'ERROR',
      filesystem: filesystemOk ? 'OK' : 'ERROR',
      readyForUpload: authOk && filesystemOk && !hasErrors
    }

    console.log('🔍 [DIAGNOSTIC] Résumé:', summary)

    return NextResponse.json({
      status: 'success',
      summary,
      diagnostics,
      recommendations: hasErrors ? [
        'Vérifiez les logs serveur pour plus de détails',
        'Vérifiez les permissions du dossier public/',
        'Vérifiez les variables d\'environnement d\'auth',
        'Vérifiez l\'espace disque disponible'
      ] : [
        'Système prêt pour l\'upload d\'images'
      ]
    })

  } catch (error) {
    console.error('🚨 [DIAGNOSTIC] Erreur lors du diagnostic:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
