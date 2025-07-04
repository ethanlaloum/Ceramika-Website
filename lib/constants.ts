/**
 * Constantes globales de l'application
 */

// Configuration des commandes
export const ORDER_CONFIG = {
  MINIMUM_AMOUNT: 200, // Montant minimum de commande en euros
} as const

// Configuration des paiements
export const PAYMENT_CONFIG = {
  CURRENCY: 'EUR',
} as const

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  MINIMUM_ORDER: (current: number, minimum: number) => 
    `Le montant minimum de commande est de ${minimum}€. Votre panier est de ${current.toFixed(2)}€.`,
  
  MINIMUM_ORDER_PRODUCT: (price: number, minimum: number) => 
    `Le montant minimum de commande est de ${minimum}€. Ce produit coûte ${price}€. Veuillez ajouter d'autres articles à votre panier.`,
} as const

// Utilitaires de prix
export const PRICE_UTILS = {
  /**
   * Formate un prix pour l'affichage
   * @param price Prix en euros
   * @returns Prix formaté (ex: "14,99 €")
   */
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: PAYMENT_CONFIG.CURRENCY,
    }).format(price)
  },

  /**
   * Convertit un prix en euros vers les centimes pour Stripe
   * @param euroPrice Prix en euros (ex: 14.99)
   * @returns Prix en centimes (ex: 1499)
   */
  euroToStripeCents: (euroPrice: number): number => {
    return Math.round(euroPrice * 100)
  },

  /**
   * Convertit des centimes Stripe vers des euros
   * @param cents Prix en centimes (ex: 1499)
   * @returns Prix en euros (ex: 14.99)
   */
  stripeCentsToEuro: (cents: number): number => {
    return cents / 100
  }
} as const
