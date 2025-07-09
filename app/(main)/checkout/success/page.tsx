import { Suspense } from 'react'
import { CheckoutSuccessContent } from './success-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commande confirmée - Céramika',
  description: 'Votre commande a été confirmée avec succès',
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }
        >
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </div>
  )
}