import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth-utils"

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@ceramique.com",
        password: await hashPassword("Admin123!"),
        firstName: "Admin",
        lastName: "Ceramique",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "client@example.com",
        password: await hashPassword("Client123!"),
        firstName: "Marie",
        lastName: "Dubois",
        role: "CUSTOMER",
      },
    }),
  ])

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
