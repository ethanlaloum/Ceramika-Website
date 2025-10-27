"use client"

import { Wrench, Clock, User, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <Wrench className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Site en maintenance
          </h1>
          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Nous effectuons actuellement des améliorations sur notre site web.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Nos équipes travaillent pour vous offrir une meilleure expérience. Nous serons de retour très prochainement !
            </p>
          </div>
        </div>

        {/* Espaces de connexion */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Accès sécurisé
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Si vous avez un compte, vous pouvez accéder à votre espace personnel même pendant la maintenance.
          </p>
          
          {/* Bouton unique de connexion */}
          <Link href="/customer/login">
            <Button className="w-full h-14 flex items-center justify-center space-x-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-medium border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <User className="w-5 h-5" />
              <span>Se connecter</span>
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <Globe className="w-4 h-4 mr-2" />
            Actualiser la page
          </Button>

          <div className="text-xs text-slate-400 dark:text-slate-600 space-y-1">
            <p>
              En cas de problème, contactez-nous à{' '}
              <a
                href="mailto:contact@ceramika.fr" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                contact@cerami-ka.com
              </a>
            </p>
            <p>Notre équipe support reste disponible durant la maintenance.</p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <span>Maintenance en cours...</span>
        </div>
      </div>
    </div>
  )
}
