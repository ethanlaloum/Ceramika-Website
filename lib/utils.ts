import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix avec maximum 2 décimales
 * @param price - Le prix à formater
 * @returns Le prix formaté avec 2 décimales
 */
export function formatPrice(price: number): string {
  return price.toFixed(2)
}
