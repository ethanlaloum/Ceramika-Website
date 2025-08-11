"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings, AlertTriangle, CheckCircle, Globe, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MaintenanceControlProps {
  initialMaintenanceMode: boolean
}

export function MaintenanceControl({ initialMaintenanceMode }: MaintenanceControlProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleMaintenance = async (enabled: boolean) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maintenance: enabled }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Erreur lors du changement de mode')
      }

      setMaintenanceMode(enabled)
      
      toast({
        title: enabled ? 'Mode maintenance activé' : 'Mode maintenance désactivé',
        description: enabled 
          ? 'Le site public n\'est plus accessible aux visiteurs'
          : 'Le site public est maintenant accessible',
        variant: enabled ? 'destructive' : 'default'
      })

    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de changer le mode maintenance',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <div>
            <CardTitle>Mode Maintenance</CardTitle>
            <CardDescription>
              Contrôlez l'accessibilité du site public
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status actuel */}
        <Alert className={maintenanceMode ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <div className="flex items-center space-x-2">
            {maintenanceMode ? (
              <>
                <Lock className="w-4 h-4 text-red-600" />
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 text-green-600" />
                <CheckCircle className="w-4 h-4 text-green-600" />
              </>
            )}
          </div>
          <AlertDescription className={maintenanceMode ? 'text-red-800' : 'text-green-800'}>
            {maintenanceMode 
              ? 'Le site est actuellement en maintenance. Seuls les administrateurs peuvent y accéder.'
              : 'Le site est en ligne et accessible à tous les visiteurs.'
            }
          </AlertDescription>
        </Alert>

        {/* Contrôle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="text-sm font-medium">
              {maintenanceMode ? 'Désactiver' : 'Activer'} la maintenance
            </Label>
            <p className="text-xs text-muted-foreground">
              {maintenanceMode 
                ? 'Rendre le site accessible aux visiteurs'
                : 'Bloquer l\'accès au site pour les visiteurs'
              }
            </p>
          </div>
          
          <Switch
            checked={maintenanceMode}
            onCheckedChange={toggleMaintenance}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
