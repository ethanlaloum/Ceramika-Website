import { PrismaClient } from '@prisma/client';
import XLSX from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  // 1. Créer ou récupérer l'artiste par défaut
  const defaultArtist = await prisma.artist.upsert({
    where: { email: "atelier@bruzzisi.fr" },
    update: {},
    create: {
      name: "Atelier Bruzzisi",
      email: "atelier@bruzzisi.fr",
      bio: "Fabricant de céramiques traditionnelles à Vallauris",
      specialty: "Céramique artisanale",
      location: "10 Rue Solferino, 06220 Vallauris, France",
      featured: true,
    }
  });

  // 2. Lire le fichier Excel
  const workbook = XLSX.readFile('FACTURE Atelier 2025.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // 3. Extraire les produits (à partir de la ligne 58)
  const products = [];
  let row = 58;
  
  while (sheet[`B${row}`]) {
    const code = sheet[`B${row}`].v;
    const name = sheet[`C${row}`].v;
    const price = sheet[`D${row}`].v;

    products.push({
      code,
      name,
      price,
    });

    row++;
  }

  // 4. Insérer dans la base de données
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: `Code produit: ${product.code}`,
        price: product.price,
        images: [],
        stock: 10, // Valeur par défaut
        featured: false,
        artistId: defaultArtist.id,
        features: [],
      }
    });
  }

  console.log(`✅ ${products.length} produits importés avec succès !`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
