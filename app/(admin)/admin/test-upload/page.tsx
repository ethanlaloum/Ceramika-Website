"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  step: string
  status: 'pending' | 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export default function TestUploadPage() {
  const [isTestingUpload, setIsTestingUpload] = useState(false)
  const [isTestingAuth, setIsTestingAuth] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result])
  }

  const testAuth = async () => {
    setIsTestingAuth(true)
    setTestResults([])
    
    try {
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      
      if (session?.user) {
        addTestResult({
          step: 'Session utilisateur',
          status: 'success',
          message: `Connecté en tant que ${session.user.email} (${session.user.role})`,
          details: session.user
        })
        
        if (session.user.role === 'ADMIN') {
          addTestResult({
            step: 'Permissions admin',
            status: 'success',
            message: 'Utilisateur a les permissions d\'admin'
          })
        } else {
          addTestResult({
            step: 'Permissions admin',
            status: 'error',
            message: 'Utilisateur n\'a pas les permissions d\'admin'
          })
        }
      } else {
        addTestResult({
          step: 'Session utilisateur',
          status: 'error',
          message: 'Aucune session active'
        })
      }
    } catch (error) {
      addTestResult({
        step: 'Test auth',
        status: 'error',
        message: `Erreur lors du test d'auth: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    } finally {
      setIsTestingAuth(false)
    }
  }

  const testUpload = async () => {
    setIsTestingUpload(true)
    setTestResults([])
    setUploadedImageUrl(null)
    
    // Créer un fichier de test
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    
    // Dessiner un carré coloré simple
    ctx.fillStyle = '#ff6b6b'
    ctx.fillRect(0, 0, 50, 50)
    ctx.fillStyle = '#4ecdc4'
    ctx.fillRect(50, 0, 50, 50)
    ctx.fillStyle = '#45b7d1'
    ctx.fillRect(0, 50, 50, 50)
    ctx.fillStyle = '#96ceb4'
    ctx.fillRect(50, 50, 50, 50)
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        addTestResult({
          step: 'Création du fichier test',
          status: 'error',
          message: 'Impossible de créer le fichier de test'
        })
        setIsTestingUpload(false)
        return
      }
      
      addTestResult({
        step: 'Création du fichier test',
        status: 'success',
        message: `Fichier de test créé (${blob.size} bytes)`
      })
      
      const file = new File([blob], 'test-image.png', { type: 'image/png' })
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        addTestResult({
          step: 'Préparation de la requête',
          status: 'success',
          message: 'FormData préparé avec le fichier'
        })
        
        console.log('🧪 Test upload - Envoi de la requête...')
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        addTestResult({
          step: 'Envoi de la requête',
          status: response.ok ? 'success' : 'error',
          message: `Réponse reçue avec le statut ${response.status}`,
          details: { status: response.status, statusText: response.statusText }
        })
        
        const result = await response.json()
        console.log('🧪 Test upload - Réponse:', result)
        
        if (response.ok && result.success) {
          addTestResult({
            step: 'Upload réussi',
            status: 'success',
            message: `Image uploadée avec succès: ${result.filename}`,
            details: result
          })
          setUploadedImageUrl(result.url)
        } else {
          addTestResult({
            step: 'Traitement de la réponse',
            status: 'error',
            message: result.error || 'Erreur inconnue',
            details: result
          })
        }
        
      } catch (error) {
        console.error('🧪 Test upload - Erreur:', error)
        addTestResult({
          step: 'Erreur de requête',
          status: 'error',
          message: `Erreur lors de la requête: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          details: error
        })
      } finally {
        setIsTestingUpload(false)
      }
    }, 'image/png')
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'pending':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test du système d'upload d'images</h1>
          <p className="text-muted-foreground mt-2">
            Diagnostiquez les problèmes d'upload d'images en temps réel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Test d'authentification
              </CardTitle>
              <CardDescription>
                Vérifiez si vous êtes connecté et avez les bonnes permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testAuth} 
                disabled={isTestingAuth}
                className="w-full"
              >
                {isTestingAuth && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tester l'authentification
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Test d'upload
              </CardTitle>
              <CardDescription>
                Testez l'upload avec un fichier généré automatiquement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testUpload} 
                disabled={isTestingUpload}
                className="w-full"
              >
                {isTestingUpload && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tester l'upload
              </Button>
            </CardContent>
          </Card>
        </div>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats des tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.step}</span>
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.message}
                      </p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                            Voir les détails
                          </summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {uploadedImageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Image uploadée avec succès</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    L'image a été uploadée avec succès à l'URL : {uploadedImageUrl}
                  </AlertDescription>
                </Alert>
                <div className="border rounded-lg p-4">
                  <img 
                    src={uploadedImageUrl} 
                    alt="Image uploadée" 
                    className="max-w-full h-auto rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      console.error('Erreur lors du chargement de l\'image:', uploadedImageUrl)
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Instructions :</strong> 
            <br />1. Testez d'abord l'authentification pour vérifier vos permissions
            <br />2. Ensuite testez l'upload pour voir s'il y a des erreurs
            <br />3. Consultez la console du navigateur (F12) pour plus de détails
            <br />4. Consultez également la console du serveur Next.js pour les logs côté serveur
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
