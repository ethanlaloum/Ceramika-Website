"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLayoutPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test de l'espacement */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Test d'espacement avec la navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Cette page teste si le contenu est correctement espacé par rapport à la barre de navigation fixe.
              Le texte ne devrait pas être masqué par la navigation.
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-sm text-gray-600">
                Layout actuel : pt-24 (96px)<br/>
                Navigation : h-20 (80px)<br/>
                Logo : w-20 h-20 (80px)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Simuler le contenu de checkout */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation du checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Zone de checkout (iframe simulée)
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Hauteur : 600px
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test de la hauteur de l'iframe */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div 
              className="w-full h-[600px] border-0 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center"
              style={{
                minHeight: '600px',
              }}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Zone iframe de checkout
                </div>
                <div className="text-sm text-gray-500">
                  600px de hauteur
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
