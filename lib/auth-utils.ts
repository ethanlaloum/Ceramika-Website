import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre minuscule")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre")
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
