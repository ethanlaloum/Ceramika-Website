import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvFilePath = path.join(__dirname, '..', 'Produits_clean.csv');

const prisma = new PrismaClient();

async function updateCSVWithPolarIds() {
  try {
    console.log('🔗 Connexion à la base de données...');
    
    // Récupérer tous les produits avec leur polarId depuis la base de données
    const products = await prisma.product.findMany({
      select: {
        id: true,
        polarId: true,
      }
    });

    console.log(`📊 ${products.length} produits récupérés de la base de données`);

    // Créer un map pour un accès rapide aux polarId
    const productPolarIds = new Map();
    products.forEach(product => {
      if (product.polarId) {
        productPolarIds.set(product.id, product.polarId);
      }
    });

    console.log(`🔗 ${productPolarIds.size} produits ont un polarId défini`);

    // Lire le fichier CSV
    console.log('📂 Lecture du fichier CSV...');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.split('\n');

    if (lines.length === 0) {
      throw new Error('Le fichier CSV est vide');
    }

    // Analyser l'en-tête pour trouver les index des colonnes
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.replace(/"/g, ''));
    
    const idIndex = headers.indexOf('id');
    const polarIdIndex = headers.indexOf('polarId');

    if (idIndex === -1) {
      throw new Error('Colonne "id" non trouvée dans le CSV');
    }
    
    if (polarIdIndex === -1) {
      throw new Error('Colonne "polarId" non trouvée dans le CSV');
    }

    console.log(`📋 Index de la colonne id: ${idIndex}`);
    console.log(`📋 Index de la colonne polarId: ${polarIdIndex}`);

    // Traiter les lignes de données
    const updatedLines = [headerLine]; // Garder l'en-tête tel quel
    let updatedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Ignorer les lignes vides
      if (line === '') {
        continue;
      }

      // Parser la ligne CSV (simple split sur virgule, fonctionne pour ce format)
      const columns = line.split(',');
      
      if (columns.length < Math.max(idIndex, polarIdIndex) + 1) {
        console.warn(`⚠️  Ligne ${i}: Nombre de colonnes insuffisant, ignorée`);
        updatedLines.push(line);
        continue;
      }

      // Extraire l'ID du produit (supprimer les guillemets)
      const productId = columns[idIndex].replace(/"/g, '');
      
      // Récupérer le polarId correspondant
      const polarId = productPolarIds.get(productId);
      
      if (polarId) {
        // Mettre à jour la colonne polarId
        columns[polarIdIndex] = `"${polarId}"`;
        updatedCount++;
      } else {
        // Garder la valeur vide si pas de polarId
        columns[polarIdIndex] = '""';
      }

      updatedLines.push(columns.join(','));
    }

    console.log(`✏️  ${updatedCount} lignes mises à jour avec un polarId`);

    // Créer une sauvegarde avant d'écraser
    const backupFilePath = csvFilePath.replace('.csv', '_before_polar_update.csv');
    fs.writeFileSync(backupFilePath, csvContent);
    console.log(`💾 Sauvegarde créée: ${path.basename(backupFilePath)}`);

    // Écrire le fichier mis à jour
    const updatedContent = updatedLines.join('\n');
    fs.writeFileSync(csvFilePath, updatedContent);
    
    console.log('✅ Fichier CSV mis à jour avec les polarId!');
    console.log(`📊 Statistiques:`);
    console.log(`  - Total produits dans CSV: ${updatedLines.length - 1}`);
    console.log(`  - Produits avec polarId: ${updatedCount}`);
    console.log(`  - Produits sans polarId: ${updatedLines.length - 1 - updatedCount}`);

    // Afficher quelques exemples de produits mis à jour
    console.log('\n📖 Exemples de produits avec polarId:');
    let exampleCount = 0;
    for (let i = 1; i < Math.min(updatedLines.length, 6) && exampleCount < 3; i++) {
      const line = updatedLines[i];
      const columns = line.split(',');
      const productId = columns[idIndex].replace(/"/g, '');
      const productName = columns[1].replace(/"/g, '');
      const polarId = columns[polarIdIndex].replace(/"/g, '');
      
      if (polarId) {
        console.log(`  - ${productName} (${productId}) → polarId: ${polarId}`);
        exampleCount++;
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du CSV:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateCSVWithPolarIds();
