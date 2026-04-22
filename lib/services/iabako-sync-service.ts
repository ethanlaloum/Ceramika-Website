/**
 * Service de synchronisation avec l'ERP Iabako
 * Synchronise les clients, produits et commandes vers Iabako
 */

import { iabakoFetch } from '@/lib/iabako'
import { prisma } from '@/lib/prisma'

// ==================== TYPES ====================

interface IabakoAddress {
  street?: string
  zip?: string
  city?: string
  countryISOCode?: string
}

interface IabakoCustomerPayload {
  externalId: string
  customerType: 'individual' | 'company'
  companyName?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber1?: string
  address?: IabakoAddress
  legalIdentification?: string
  taxIdentification?: string
  tags?: string[]
}

interface IabakoProductPayload {
  externalId: string
  name: string
  description?: string
  stockQuantity?: number
  priceUnit?: string
  priceAfterTax?: number
  tags?: string[]
}

interface IabakoOrderLine {
  productExternalId: string
  productName: string
  quantity: number
  unitPriceAfterTax?: number
}

interface IabakoOrderPayload {
  externalId: string
  orderDate?: string
  customer?: {
    externalId: string
    customerType: 'individual' | 'company'
    firstName?: string
    lastName?: string
    companyName?: string
  }
  lines: IabakoOrderLine[]
  billingAddress?: IabakoAddress
  comment?: string
  internalNote?: string
}

// ==================== CUSTOMERS ====================

/**
 * Crée ou met à jour un client dans Iabako
 */
export async function syncCustomerToIabako(user: {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  companyName?: string | null
  siretNumber?: string | null
  vatNumber?: string | null
}): Promise<{ success: boolean; error?: string }> {
  try {
    const isCompany = !!user.companyName

    const payload: IabakoCustomerPayload = {
      externalId: user.id,
      customerType: isCompany ? 'company' : 'individual',
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      phoneNumber1: user.phone || undefined,
      companyName: isCompany ? user.companyName! : undefined,
      legalIdentification: user.siretNumber || undefined,
      taxIdentification: user.vatNumber || undefined,
      tags: ['ceramika', 'e-commerce'],
    }

    // Essayer de récupérer le client existant
    const existingResponse = await iabakoFetch(`/customers/external-id/${user.id}`)

    if (existingResponse.ok) {
      // Client existe → mise à jour
      const response = await iabakoFetch('/customers', {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ Iabako: Erreur mise à jour client:', error)
        return { success: false, error }
      }

      console.log('✅ Iabako: Client mis à jour:', user.email)
    } else {
      // Client n'existe pas → création
      const response = await iabakoFetch('/customers', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ Iabako: Erreur création client:', error)
        return { success: false, error }
      }

      console.log('✅ Iabako: Client créé:', user.email)
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Iabako: Erreur sync client:', error)
    return { success: false, error: String(error) }
  }
}

// ==================== PRODUCTS ====================

/**
 * Crée ou met à jour un produit dans Iabako
 */
export async function syncProductToIabako(product: {
  id: string
  name: string
  description?: string | null
  price: number
  stock: number
  category?: string | null
  artist?: { name: string } | null
}): Promise<{ success: boolean; error?: string }> {
  try {
    const tags = ['ceramika']
    if (product.category) tags.push(product.category)
    if (product.artist?.name) tags.push(product.artist.name)

    const payload: IabakoProductPayload = {
      externalId: product.id,
      name: product.name,
      description: product.description || undefined,
      stockQuantity: product.stock,
      priceUnit: 'unit',
      priceAfterTax: product.price,
      tags,
    }

    // Essayer de récupérer le produit existant
    const existingResponse = await iabakoFetch(`/products/external-id/${product.id}`)

    if (existingResponse.ok) {
      // Produit existe → mise à jour
      const response = await iabakoFetch('/products', {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ Iabako: Erreur mise à jour produit:', error)
        return { success: false, error }
      }

      console.log('✅ Iabako: Produit mis à jour:', product.name)
    } else {
      // Produit n'existe pas → création
      const response = await iabakoFetch('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ Iabako: Erreur création produit:', error)
        return { success: false, error }
      }

      console.log('✅ Iabako: Produit créé:', product.name)
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Iabako: Erreur sync produit:', error)
    return { success: false, error: String(error) }
  }
}

// ==================== ORDERS ====================

/**
 * Crée une commande dans Iabako (draft order)
 */
export async function syncOrderToIabako(order: {
  id: string
  createdAt: Date
  total: number
  shipping: number
  userId: string
  customerName?: string
  companyName?: string | null
  orderItems: Array<{
    quantity: number
    price: number
    product: {
      id: string
      name: string
      price: number
    }
  }>
}, shippingAddress?: {
  address?: string
  city?: string
  zipCode?: string
  country?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const lines: IabakoOrderLine[] = order.orderItems.map(item => ({
      productExternalId: item.product.id,
      productName: item.product.name,
      unitPriceAfterTax: item.price,
      quantity: item.quantity,
    }))

    const isCompany = !!order.companyName
    const nameParts = (order.customerName || '').split(' ')

    const payload: IabakoOrderPayload = {
      externalId: order.id,
      orderDate: order.createdAt.toISOString(),
      customer: {
        externalId: order.userId,
        customerType: isCompany ? 'company' : 'individual',
        firstName: nameParts[0] || undefined,
        lastName: nameParts.slice(1).join(' ') || undefined,
        companyName: isCompany ? order.companyName! : undefined,
      },
      lines,
      internalNote: `Commande e-commerce Ceramika - Total: ${order.total}€ (dont ${order.shipping}€ frais de port)`,
    }

    if (shippingAddress?.address) {
      payload.billingAddress = {
        street: shippingAddress.address,
        city: shippingAddress.city || undefined,
        zip: shippingAddress.zipCode || undefined,
        countryISOCode: shippingAddress.country === 'France' ? 'FR' : shippingAddress.country,
      }
    }

    const response = await iabakoFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Iabako: Erreur création commande:', error)
      return { success: false, error }
    }

    console.log('✅ Iabako: Commande créée:', order.id)
    return { success: true }
  } catch (error) {
    console.error('❌ Iabako: Erreur sync commande:', error)
    return { success: false, error: String(error) }
  }
}

// ==================== IMPORT DEPUIS IABAKO ====================

interface IabakoProduct {
  externalId?: string
  number?: string
  name: string
  description?: string
  stockQuantity?: number
  priceUnit?: string
  taxRate?: number
  priceBeforeTax?: number
  priceAfterTax?: number
  tags?: string[]
}

interface ImportResult {
  created: number
  updated: number
  errors: string[]
  scanned: number
  products: Array<{ name: string; number?: string; action: 'created' | 'updated' | 'error'; error?: string }>
}

/**
 * Récupère un produit Iabako par son numéro
 */
export async function fetchIabakoProductByNumber(number: string): Promise<IabakoProduct | null> {
  const response = await iabakoFetch(`/products/number/${encodeURIComponent(number)}`)

  if (response.status === 404) return null
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erreur récupération produit ${number} (${response.status}): ${errorText}`)
  }

  return response.json()
}

/**
 * Scanne tous les produits Iabako en itérant les numéros séquentiels (000001, 000002, ...).
 * L'API ne permet pas de lister les produits, donc on scanne jusqu'à N 404 consécutifs.
 * Crée les nouveaux produits et met à jour les existants dans la base locale.
 */
export async function importAllProductsFromIabako(defaultArtistId: string): Promise<ImportResult> {
  const result: ImportResult = { created: 0, updated: 0, errors: [], scanned: 0, products: [] }
  const MAX_CONSECUTIVE_404 = 20
  let consecutive404 = 0
  let currentNumber = 1

  console.log('🔄 [IABAKO SYNC] Début du scan des produits depuis Iabako...')
  const startTime = Date.now()

  while (consecutive404 < MAX_CONSECUTIVE_404) {
    const numberStr = String(currentNumber).padStart(6, '0')

    try {
      const iProduct = await fetchIabakoProductByNumber(numberStr)

      if (!iProduct) {
        consecutive404++
        currentNumber++
        continue
      }

      // Produit trouvé, reset du compteur 404
      consecutive404 = 0
      result.scanned++

      const iabakoNumber = iProduct.number || numberStr

      // Chercher un produit local qui a déjà ce numéro Iabako
      const existingProduct = await prisma.product.findUnique({
        where: { iabakoNumber },
      })

      const price = iProduct.priceAfterTax ?? iProduct.priceBeforeTax ?? 0
      const stock = iProduct.stockQuantity ?? 0
      const category = iProduct.tags?.find(t => t !== 'ceramika' && t !== 'e-commerce') || null

      if (existingProduct) {
        // Vérifier si quelque chose a vraiment changé
        const hasChanges =
          existingProduct.name !== iProduct.name ||
          existingProduct.price !== price ||
          existingProduct.stock !== stock ||
          existingProduct.inStock !== (stock > 0) ||
          existingProduct.category !== category

        if (hasChanges) {
          // Déterminer ce qui a changé pour le log
          const changes: string[] = []
          if (existingProduct.name !== iProduct.name) changes.push(`nom: ${existingProduct.name} → ${iProduct.name}`)
          if (existingProduct.price !== price) changes.push(`prix: ${existingProduct.price}€ → ${price}€`)
          if (existingProduct.stock !== stock) changes.push(`stock: ${existingProduct.stock} → ${stock}`)

          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: iProduct.name,
              description: iProduct.description || existingProduct.description,
              price,
              stock,
              inStock: stock > 0,
              category: category || existingProduct.category,
              updatedAt: new Date(),
            },
          })

          result.updated++
          result.products.push({
            name: iProduct.name,
            number: iabakoNumber,
            action: 'updated',
            error: changes.join(', '),
          })
          console.log(`  📝 ${iProduct.name} (${iabakoNumber}): ${changes.join(', ')}`)
        } else {
          console.log(`  ✓ ${iProduct.name} (${iabakoNumber}): aucun changement`)
        }
      } else {
        await prisma.product.create({
          data: {
            name: iProduct.name,
            description: iProduct.description || null,
            price,
            stock,
            inStock: stock > 0,
            category,
            artistId: defaultArtistId,
            iabakoNumber,
            images: [],
            features: [],
            featured: false,
          },
        })

        result.created++
        result.products.push({ name: iProduct.name, number: iabakoNumber, action: 'created' })
        console.log(`  ➕ ${iProduct.name} (${iabakoNumber}): nouveau produit`)
      }
    } catch (error) {
      const errMsg = `Erreur pour "${numberStr}": ${String(error)}`
      result.errors.push(errMsg)
      result.products.push({ name: numberStr, number: numberStr, action: 'error', error: String(error) })
      consecutive404 = 0
    }

    currentNumber++
  }

  const duration = Date.now() - startTime
  console.log(`✅ [IABAKO SYNC] Scan terminé (${duration}ms, scanné jusqu'à ${String(currentNumber - 1).padStart(6, '0')}): ${result.scanned} trouvé(s), ${result.created} créé(s), ${result.updated} mis à jour, ${result.errors.length} erreur(s)`)
  return result
}
