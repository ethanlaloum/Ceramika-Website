"use server"

import { KoalaWelcomeEmail } from '@/emails/welcome'
import { resend } from '@/lib/resend'

interface WelcomeEmailParams {
  email: string
  userFirstname: string
}

export async function sendWelcomeEmail({ email, userFirstname }: WelcomeEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ethan.laloum@epitech.eu',
      to: email,
      subject: 'Bienvenue sur Ceramika !',
      react: KoalaWelcomeEmail({ userFirstname }),
    })

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Exception lors de l\'envoi de l\'email de bienvenue:', error)
    return { success: false, error }
  }
}