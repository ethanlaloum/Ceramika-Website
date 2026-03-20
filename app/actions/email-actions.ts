"use server"

import { CeramikaWelcomeEmail } from '@/emails/welcome'
import { OrderConfirmationEmail } from '@/emails/order-confirmation'
import { NewOrderAdminEmail } from '@/emails/new-order-admin'
import { resend } from '@/lib/resend'

interface WelcomeEmailParams {
  email: string
  userFirstname: string
}

interface OrderEmailItem {
  name: string
  artist: string
  quantity: number
  price: number
}

interface OrderConfirmationEmailParams {
  email: string
  userFirstname: string
  orderNumber: string
  orderDate: string
  items: OrderEmailItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    zipCode: string
    country: string
  }
}

interface NewOrderAdminEmailParams {
  orderNumber: string
  orderDate: string
  customerName: string
  customerEmail: string
  items: { name: string; quantity: number; price: number }[]
  subtotal: number
  shipping: number
  total: number
  deliveryMode: 'delivery' | 'collect'
  shippingAddress: {
    name: string
    address: string
    city: string
    zipCode: string
    country: string
  }
}

export async function sendWelcomeEmail({ email, userFirstname }: WelcomeEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ceramika <noreply@mail.cerami-ka.com>',
      to: email,
      subject: 'Bienvenue sur Ceramika !',
      react: CeramikaWelcomeEmail({ userFirstname }),
    })

    if (error) {
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ceramika <noreply@mail.cerami-ka.com>',
      to: params.email,
      subject: `Confirmation de votre commande #${params.orderNumber}`,
      react: OrderConfirmationEmail({
        userFirstname: params.userFirstname,
        orderNumber: params.orderNumber,
        orderDate: params.orderDate,
        items: params.items,
        subtotal: params.subtotal,
        tax: params.tax,
        shipping: params.shipping,
        total: params.total,
        shippingAddress: params.shippingAddress,
      }),
    })

    if (error) {
      console.error('Erreur envoi email confirmation commande:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Erreur envoi email confirmation commande:', error)
    return { success: false, error }
  }
}

export async function sendNewOrderAdminEmail(params: NewOrderAdminEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ceramika <noreply@mail.cerami-ka.com>',
      to: 'contact@cerami-ka.com',
      subject: `Nouvelle commande #${params.orderNumber} - ${params.customerName}`,
      react: NewOrderAdminEmail({
        orderNumber: params.orderNumber,
        orderDate: params.orderDate,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        items: params.items,
        subtotal: params.subtotal,
        shipping: params.shipping,
        total: params.total,
        deliveryMode: params.deliveryMode,
        shippingAddress: params.shippingAddress,
      }),
    })

    if (error) {
      console.error('Erreur envoi email notification admin:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Erreur envoi email notification admin:', error)
    return { success: false, error }
  }
}