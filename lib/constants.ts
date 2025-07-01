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
  POLAR_CURRENCY: 'usd', // Polar n'accepte que USD pour le moment
} as const

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  MINIMUM_ORDER: (current: number, minimum: number) => 
    `Le montant minimum de commande est de ${minimum}€. Votre panier est de ${current.toFixed(2)}€.`,
  
  MINIMUM_ORDER_PRODUCT: (price: number, minimum: number) => 
    `Le montant minimum de commande est de ${minimum}€. Ce produit coûte ${price}€. Veuillez ajouter d'autres articles à votre panier.`,
} as const
