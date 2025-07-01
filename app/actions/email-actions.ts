"use server"

import { CeramikaWelcomeEmail } from '@/emails/welcome'
import { resend } from '@/lib/resend'

interface WelcomeEmailParams {
  email: string
  userFirstname: string
}

export async function sendWelcomeEmail({ email, userFirstname }: WelcomeEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ceramika <contact@cerami-ka.com>',
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