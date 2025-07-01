import { Webhooks } from "@polar-sh/nextjs";
import { CartService } from "@/lib/services/cart-service";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  
  // Gestionnaire spécifique pour les commandes payées
  onOrderPaid: async (payload) => {
    // Si l'ordre contient un customerId, vider le panier
    if (payload.data.customerId) {
      try {
        await CartService.clearCart(payload.data.customerId)
      } catch (error) {
        // Erreur silencieuse
      }
    }
  },
  
  // Gestionnaire pour les checkouts créés
  onCheckoutCreated: async (payload) => {
    // Événement de checkout créé - traitement silencieux
  },
  
  onCheckoutUpdated: async (payload) => {
    // Si le checkout échoue, enregistrer l'erreur
    if (payload.data.status === 'expired' || payload.data.status === 'open') {
      // Enregistrer l'erreur de manière silencieuse
    }
  },

  // Gestionnaire pour les paiements échoués
  onOrderUpdated: async (payload) => {
    // Logger tous les changements de statut pour comprendre les valeurs possibles
    // Traitement silencieux des mises à jour de commande
  },
  
  // Gestionnaire générique pour tous les autres événements
  onPayload: async (payload) => {
    // Traitement générique silencieux
  },
});
