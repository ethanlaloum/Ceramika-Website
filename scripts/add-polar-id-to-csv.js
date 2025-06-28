import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csvFilePath = path.join(__dirname, '..', 'Produits_clean.csv');
const backupFilePath = path.join(__dirname, '..', 'Produits_clean_backup.csv');

function addPolarIdColumnToCSV() {
  try {
    console.log('📂 Lecture du fichier CSV...');
    
    // Créer une sauvegarde du fichier original
    const originalContent = fs.readFileSync(csvFilePath, 'utf8');
    fs.writeFileSync(backupFilePath, originalContent);
    console.log('💾 Sauvegarde créée: Produits_clean_backup.csv');

    // Diviser le contenu en lignes
    const lines = originalContent.split('\n');
    
    if (lines.length === 0) {
      throw new Error('Le fichier CSV est vide');
    }

    // Traiter l'en-tête (première ligne)
    const headerLine = lines[0];
    console.log('📋 En-tête original:', headerLine);
    
    // Ajouter la colonne polarId à l'en-tête
    const newHeaderLine = headerLine.replace(/"\s*$/, '') + ',"polarId"';
    console.log('📋 Nouvel en-tête:', newHeaderLine);

    // Traiter les lignes de données
    const updatedLines = [newHeaderLine];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Ignorer les lignes vides
      if (line === '') {
        continue;
      }
      
      // Ajouter une valeur vide pour la colonne polarId
      const updatedLine = line.replace(/"\s*$/, '') + ',""';
      updatedLines.push(updatedLine);
    }

    console.log(`📊 ${updatedLines.length - 1} lignes de données traitées`);

    // Écrire le fichier modifié
    const updatedContent = updatedLines.join('\n');
    fs.writeFileSync(csvFilePath, updatedContent);
    
    console.log('✅ Fichier CSV mis à jour avec succès!');
    console.log('📂 Fichier: Produits_clean.csv');
    console.log('💾 Sauvegarde: Produits_clean_backup.csv');
    
    // Afficher un aperçu des premières lignes
    console.log('\n📖 Aperçu des premières lignes:');
    const previewLines = updatedLines.slice(0, 3);
    previewLines.forEach((line, index) => {
      console.log(`${index === 0 ? 'En-tête' : `Ligne ${index}`}: ${line}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du CSV:', error.message);
    
    // Restaurer la sauvegarde en cas d'erreur
    if (fs.existsSync(backupFilePath)) {
      const backupContent = fs.readFileSync(backupFilePath, 'utf8');
      fs.writeFileSync(csvFilePath, backupContent);
      console.log('🔄 Fichier original restauré depuis la sauvegarde');
    }
    
    process.exit(1);
  }
}

// Exécuter le script
addPolarIdColumnToCSV();
