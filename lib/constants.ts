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
  POLAR_CURRENCY: 'usd', // Polar force USD même en production
  EUR_TO_USD_RATE: 1.08, // Taux de change approximatif EUR → USD
} as const

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  MINIMUM_ORDER: (current: number, minimum: number) => 
    `Le montant minimum de commande est de ${minimum}€. Votre panier est de ${current.toFixed(2)}€.`,
  
  MINIMUM_ORDER_PRODUCT: (price: number, minimum: number) => 
    `Le montant minimum de commande est de ${minimum}€. Ce produit coûte ${price}€. Veuillez ajouter d'autres articles à votre panier.`,
} as const

// Utilitaires de prix pour Polar
export const PRICE_UTILS = {
  /**
   * Convertit un prix en euros vers le format attendu par Polar (centimes USD)
   * @param euroPrice Prix en euros (ex: 14.99)
   * @returns Prix en centimes USD (ex: 1618 pour ~16.18 USD)
   */
  euroToPolarCents: (euroPrice: number): number => {
    const usdPrice = euroPrice * PAYMENT_CONFIG.EUR_TO_USD_RATE
    return Math.round(usdPrice * 100)
  },

  /**
   * Convertit un prix en euros vers USD (sans centimes)
   * @param euroPrice Prix en euros (ex: 14.99)
   * @returns Prix en USD (ex: 16.18)
   */
  euroToUsd: (euroPrice: number): number => {
    return euroPrice * PAYMENT_CONFIG.EUR_TO_USD_RATE
  },

  /**
   * Convertit un prix en centimes Polar (USD) vers des euros
   * @param polarCents Prix en centimes USD (ex: 1618)
   * @returns Prix en euros (ex: 14.99)
   */
  polarCentsToEuro: (polarCents: number): number => {
    const usdPrice = polarCents / 100
    return usdPrice / PAYMENT_CONFIG.EUR_TO_USD_RATE
  },

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
   * Formate un prix avec équivalence USD pour la transparence
   * @param euroPrice Prix en euros
   * @returns Prix formaté avec équivalence (ex: "14,99 € (~16,18 USD)")
   */
  formatPriceWithUsdEquivalent: (euroPrice: number): string => {
    const usdPrice = PRICE_UTILS.euroToUsd(euroPrice)
    return `${PRICE_UTILS.formatPrice(euroPrice)} (~${usdPrice.toFixed(2)} USD)`
  }
} as const
