import { Webhooks } from "@polar-sh/nextjs";
import { CartService } from "@/lib/services/cart-service";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  
  // Gestionnaire spécifique pour les commandes payées
  onOrderPaid: async (payload) => {
    console.log('✅ Commande payée:', payload.data)
    
    // Si l'ordre contient un customerId, vider le panier
    if (payload.data.customerId) {
      try {
        await CartService.clearCart(payload.data.customerId)
        console.log('🗑️ Panier vidé pour le client:', payload.data.customerId)
      } catch (error) {
        console.error('❌ Erreur lors du vidage du panier:', error)
      }
    }
  },
  
  // Gestionnaire pour les checkouts créés
  onCheckoutCreated: async (payload) => {
    console.log('🎯 Checkout créé:', payload.data)
  },
  
  onCheckoutUpdated: async (payload) => {
    console.log('🔄 Checkout mis à jour:', payload.data)
    
    // Si le checkout échoue, enregistrer l'erreur
    if (payload.data.status === 'expired' || payload.data.status === 'open') {
      console.log('⚠️ Checkout expiré ou en attente:', {
        checkoutId: payload.data.id,
        status: payload.data.status,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Gestionnaire pour les paiements échoués
  onOrderUpdated: async (payload) => {
    console.log('📦 Commande mise à jour:', payload.data)
    
    // Logger tous les changements de statut pour comprendre les valeurs possibles
    console.log('� Statut de commande:', {
      orderId: payload.data.id,
      status: payload.data.status,
      customerId: payload.data.customerId,
      amount: payload.data.amount,
      currency: payload.data.currency,
      timestamp: new Date().toISOString()
    })
  },
  
  // Gestionnaire générique pour tous les autres événements
  onPayload: async (payload) => {
    console.log('🎉 Webhook Polar reçu:', {
      type: payload.type,
      data: payload.data,
      timestamp: new Date().toISOString()
    })
  },
});
