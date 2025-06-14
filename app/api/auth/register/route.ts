import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, validatePassword } from "@/lib/auth-utils"
import type { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      companyName,  // Ajouter ces champs
      vatNumber,    // Ajouter ces champs
      siretNumber,  // Ajouter ces champs 
      role = "CUSTOMER" 
    } = body

    // Validation des données
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: "Mot de passe invalide", details: passwordValidation.errors }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer l'utilisateur avec les informations de facturation
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        companyName,  // Ajouter ces champs
        vatNumber,    // Ajouter ces champs 
        siretNumber,  // Ajouter ces champs
        role: role as UserRole,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,  // Optionnel : sélectionner pour la réponse
        vatNumber: true,    // Optionnel : sélectionner pour la réponse
        siretNumber: true,  // Optionnel : sélectionner pour la réponse
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ message: "Utilisateur créé avec succès", user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
