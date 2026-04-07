// Script de synchronisation des produits depuis le fichier Excel IABAKO
// Matching amélioré : expansion des abréviations, correction typos, fuzzy matching
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mots de taille (exclus du scoring fuzzy pour éviter faux positifs)
const SIZE_WORDS = new Set(['grand', 'petit', 'moyen', 'geant', 'mini', 'modele']);

// Normalisation améliorée avec expansion des abréviations et correction de typos
function enhancedNormalize(name: string): string {
  let n = name;

  // 1. Correction de typos connus
  n = n.replace(/Choppe/gi, 'Chope');
  n = n.replace(/Steack/gi, 'Steak');
  n = n.replace(/The[ïi][eè]re/gi, 'Theiere');
  n = n.replace(/Ustencile/gi, 'Ustensile');
  n = n.replace(/Maith[ée]/gi, 'Maite');
  n = n.replace(/Asp[eè]rges/gi, 'Asperges');
  n = n.replace(/\bTajine/gi, 'Tagine');

  // 2. Expansion des abréviations de taille entre parenthèses
  n = n.replace(/\(GM\)/gi, 'Grand Modele');
  n = n.replace(/\(PM\)/gi, 'Petit Modele');
  n = n.replace(/\(MM\)/gi, 'Moyen Modele');

  // 2b. Expansion des abréviations de taille isolées (sans parenthèses)
  n = n.replace(/\bGM\b/g, 'Grand Modele');
  n = n.replace(/\bPM\b/g, 'Petit Modele');
  n = n.replace(/\bMM\b/g, 'Moyen Modele');

  // 3. Gestion des mots de taille isolés
  n = n.replace(/\bG[ée]ante?\b/gi, 'Geant Modele');
  n = n.replace(/\bMaxi\b/gi, 'Geant Modele');
  n = n.replace(/\bpetite\b/gi, 'Petit Modele');

  // 4. Expansion d'abréviations de mots
  n = n.replace(/\bRect\b/gi, 'Rectangulaire');

  // 5. Normalisation des mesures : "de XX cm" et "(XX CM)" → "XXcm"
  n = n.replace(/\bde\s+(\d+)\s*cm\b/gi, '$1cm');
  n = n.replace(/\((\d+)\s*CM\)/gi, '$1cm');
  n = n.replace(/(\d+)\s*cm\b/gi, '$1cm');

  // 6. Normalisation de la numérotation : n°1, n° 1 → num1
  n = n.replace(/n[°º]\s*(\d)/gi, 'num$1');

  // 7. Normalisation des volumes : 0,25 l → 025l
  n = n.replace(/(\d+)[,.](\d+)\s*l\b/gi, '$1$2l');

  // 8. Normalisation standard
  n = n
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 9. Suppression des mots parasites, dédoublonnage et tri
  const noiseWords = new Set(['a', 'de', 'du', 'la', 'le', 'les', 'et', 'ou', 'sur', 'en', 'au', 'aux', 'avec', 'sans', 'pour', 'l', 'd']);
  const words = n.split(' ').filter(w => !noiseWords.has(w));
  const uniqueWords = [...new Set(words)]; // Dédoublonner (évite "modele modele")
  uniqueWords.sort();

  return uniqueWords.join(' ');
}

// Score de similarité basé sur le chevauchement de mots SUBSTANTIFS (hors mots de taille)
function overlapScore(a: string, b: string): { score: number; common: number; substantiveCommon: number } {
  const wordsA = a.split(' ');
  const wordsB = new Set(b.split(' '));

  // Mots substantifs (exclure les mots de taille pour éviter les faux positifs)
  const substantiveA = wordsA.filter(w => !SIZE_WORDS.has(w));
  const substantiveB = [...wordsB].filter(w => !SIZE_WORDS.has(w));
  const substantiveBSet = new Set(substantiveB);

  let substantiveCommon = 0;
  for (const w of substantiveA) {
    if (substantiveBSet.has(w)) substantiveCommon++;
  }

  // Score basé sur les mots substantifs
  const minSubstantive = Math.min(substantiveA.length, substantiveB.length);
  const score = minSubstantive > 0 ? substantiveCommon / minSubstantive : 0;

  // Compter aussi les mots totaux en commun (pour info)
  let totalCommon = 0;
  const allWordsB = new Set(b.split(' '));
  for (const w of wordsA) {
    if (allWordsB.has(w)) totalCommon++;
  }

  return { score, common: totalCommon, substantiveCommon, maxSubstantive: Math.max(substantiveA.length, substantiveB.length) };
}

async function syncProducts() {
  // 1. Lire le fichier Excel
  const wb = XLSX.readFile('IABAKO - Modifier produits - 20260407.xlsx');
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const excelProducts = rows.slice(2)
    .filter((row: any) => row[0] && row[1] && row[1] !== 'ERREUR')
    .map((row: any) => ({
      code: String(row[0]),
      name: String(row[1]),
      priceHT: Number(row[2]),
      priceTTC: Number(row[3]),
      ref: String(row[4] || ''),
      normalized: enhancedNormalize(String(row[1])),
    }));

  console.log(`📋 Fichier Excel: ${excelProducts.length} produits (hors ERREUR)`);

  // 2. Lire les produits existants en base
  const dbProducts = await prisma.product.findMany({
    select: { id: true, name: true, price: true },
    orderBy: { name: 'asc' },
  });
  console.log(`💾 Base de données: ${dbProducts.length} produits\n`);

  const dbWithNorm = dbProducts.map((p: any) => ({
    ...p,
    normalized: enhancedNormalize(p.name),
  }));

  // Index: normalized → array (gestion des doublons)
  const dbIndex: Record<string, any[]> = {};
  for (const p of dbWithNorm) {
    if (!dbIndex[p.normalized]) dbIndex[p.normalized] = [];
    dbIndex[p.normalized].push(p);
  }

  const matchedDbIds = new Set<string>();
  const matchedExcelCodes = new Set<string>();
  const matched: any[] = [];
  const priceChanges: any[] = [];
  const nameChanges: any[] = [];

  // --- TIER 1: Match exact sur nom normalisé amélioré ---
  for (const ep of excelProducts) {
    const candidates = dbIndex[ep.normalized];
    if (!candidates) continue;

    // Parmi les candidats non déjà matchés, choisir celui avec le prix le plus proche
    let best: any = null;
    let bestDiff = Infinity;
    for (const c of candidates) {
      if (matchedDbIds.has(c.id)) continue;
      const diff = Math.abs(c.price - ep.priceHT);
      if (diff < bestDiff) {
        best = c;
        bestDiff = diff;
      }
    }

    if (best) {
      matchedDbIds.add(best.id);
      matchedExcelCodes.add(ep.code);
      matched.push({ excel: ep, db: best });

      if (Math.abs(best.price - ep.priceHT) > 0.01) {
        priceChanges.push({
          id: best.id, oldName: best.name, newName: ep.name,
          oldPrice: best.price, newPrice: ep.priceHT,
        });
      }
      if (best.name !== ep.name) {
        nameChanges.push({ id: best.id, oldName: best.name, newName: ep.name });
      }
    }
  }

  console.log(`--- TIER 1 (match exact normalisé) ---`);
  console.log(`✅ Matchés: ${matched.length}`);

  // --- TIER 2: Fuzzy matching pour les restants ---
  const unmatchedExcel = excelProducts.filter((ep: any) => !matchedExcelCodes.has(ep.code));
  const unmatchedDb = dbWithNorm.filter((p: any) => !matchedDbIds.has(p.id));

  // Calculer toutes les paires fuzzy possibles
  const fuzzyPairs: { excel: any; db: any; score: number; substantiveCommon: number; priceDiff: number }[] = [];

  for (const ep of unmatchedExcel) {
    for (const dbp of unmatchedDb) {
      const { score, substantiveCommon, maxSubstantive } = overlapScore(ep.normalized, dbp.normalized);
      const priceDiff = Math.abs(dbp.price - ep.priceHT);
      const priceRatio = priceDiff / Math.max(dbp.price, ep.priceHT);

      // Seuils : au moins 60% de chevauchement substantif, prix dans 30%
      // Si 1 seul mot substantif commun : exiger score=100%, prix dans 10%, et max 2 mots substantifs
      // (évite "Panier (PM)" ↔ "Panier à Gratin Ovale n°4")
      const isStrictSingleWord = substantiveCommon === 1 && score >= 1.0 && priceRatio <= 0.1 && maxSubstantive <= 2;
      const isNormalMatch = substantiveCommon >= 2 && score >= 0.6 && priceRatio <= 0.3;

      if (isStrictSingleWord || isNormalMatch) {
        fuzzyPairs.push({ excel: ep, db: dbp, score, substantiveCommon, priceDiff });
      }
    }
  }

  // Trier par score décroissant, puis par prix le plus proche
  fuzzyPairs.sort((a, b) => b.score - a.score || a.priceDiff - b.priceDiff);

  // Assigner gloutonement
  const fuzzyMatches: any[] = [];
  for (const pair of fuzzyPairs) {
    if (matchedDbIds.has(pair.db.id) || matchedExcelCodes.has(pair.excel.code)) continue;

    matchedDbIds.add(pair.db.id);
    matchedExcelCodes.add(pair.excel.code);
    fuzzyMatches.push(pair);
    matched.push({ excel: pair.excel, db: pair.db });

    if (Math.abs(pair.db.price - pair.excel.priceHT) > 0.01) {
      priceChanges.push({
        id: pair.db.id, oldName: pair.db.name, newName: pair.excel.name,
        oldPrice: pair.db.price, newPrice: pair.excel.priceHT,
      });
    }
    if (pair.db.name !== pair.excel.name) {
      nameChanges.push({ id: pair.db.id, oldName: pair.db.name, newName: pair.excel.name });
    }
  }

  console.log(`\n--- TIER 2 (fuzzy matching) ---`);
  console.log(`✅ Matchés: ${fuzzyMatches.length}`);
  if (fuzzyMatches.length > 0) {
    fuzzyMatches.forEach((m: any) => {
      console.log(`  "${m.db.name}" ↔ "${m.excel.name}" (score: ${(m.score * 100).toFixed(0)}%, prix: ${m.db.price}€→${m.excel.priceHT}€)`);
    });
  }

  // --- RÉSUMÉ ---
  const finalUnmatchedExcel = excelProducts.filter((ep: any) => !matchedExcelCodes.has(ep.code));
  const finalUnmatchedDb = dbWithNorm.filter((p: any) => !matchedDbIds.has(p.id));

  console.log(`\n=== RÉSUMÉ FINAL ===`);
  console.log(`✅ Total matchés: ${matched.length} / ${excelProducts.length}`);
  console.log(`📝 Changements de nom: ${nameChanges.length}`);
  console.log(`💰 Changements de prix: ${priceChanges.length}`);
  console.log(`❓ Non matchés Excel: ${finalUnmatchedExcel.length}`);
  console.log(`❓ Non matchés DB: ${finalUnmatchedDb.length}`);

  if (nameChanges.length > 0) {
    console.log('\n--- CHANGEMENTS DE NOM ---');
    nameChanges.forEach((c: any) => console.log(`  "${c.oldName}" → "${c.newName}"`));
  }

  if (priceChanges.length > 0) {
    console.log('\n--- CHANGEMENTS DE PRIX ---');
    priceChanges.forEach((c: any) => console.log(`  ${c.newName}: ${c.oldPrice}€ → ${c.newPrice}€`));
  }

  if (finalUnmatchedExcel.length > 0) {
    console.log('\n--- PRODUITS EXCEL SANS MATCH EN BASE ---');
    finalUnmatchedExcel.forEach((p: any) => console.log(`  [${p.code}] ${p.name} - ${p.priceHT}€ HT (ref: ${p.ref})`));
  }

  if (finalUnmatchedDb.length > 0) {
    console.log(`\n--- PRODUITS EN BASE SANS MATCH EXCEL (${finalUnmatchedDb.length}) ---`);
    finalUnmatchedDb.forEach((p: any) => console.log(`  ${p.name} - ${p.price}€ [norm: ${p.normalized}]`));
  }

  // 4. Appliquer les modifications
  if (process.argv.includes('--apply')) {
    console.log('\n🔄 Application des modifications...');

    const processedIds = new Set<string>();
    let updated = 0;

    for (const m of matched) {
      if (processedIds.has(m.db.id)) continue;
      processedIds.add(m.db.id);

      const updateData: any = {};
      const hasNameChange = nameChanges.find((n: any) => n.id === m.db.id);
      const hasPriceChange = priceChanges.find((p: any) => p.id === m.db.id);

      if (hasNameChange) updateData.name = hasNameChange.newName;
      if (hasPriceChange) updateData.price = hasPriceChange.newPrice;

      if (Object.keys(updateData).length > 0) {
        await prisma.product.update({
          where: { id: m.db.id },
          data: updateData,
        });
        updated++;
      }
    }

    console.log(`✅ ${updated} produits mis à jour`);

    // 5. Supprimer les produits en base qui n'ont pas de match dans Excel
    if (finalUnmatchedDb.length > 0) {
      console.log(`\n🗑️ Suppression de ${finalUnmatchedDb.length} produits sans match Excel...`);

      let deleted = 0;
      let skipped = 0;

      for (const p of finalUnmatchedDb) {
        // Vérifier s'il y a des OrderItems liés (ne pas supprimer si commande existante)
        const orderItemCount = await prisma.orderItem.count({
          where: { productId: p.id },
        });

        if (orderItemCount > 0) {
          console.log(`  ⚠️ SKIP "${p.name}" - ${orderItemCount} commande(s) liée(s)`);
          skipped++;
          continue;
        }

        // Supprimer les CartItem et WishlistItem liés (cascade en DB mais soyons explicites)
        await prisma.cartItem.deleteMany({ where: { productId: p.id } });
        await prisma.wishlistItem.deleteMany({ where: { productId: p.id } });

        await prisma.product.delete({ where: { id: p.id } });
        console.log(`  🗑️ "${p.name}" supprimé`);
        deleted++;
      }

      console.log(`\n✅ ${deleted} produits supprimés, ${skipped} conservés (commandes liées)`);
    }
  } else {
    console.log('\n💡 Pour appliquer les modifications, relancer avec: npx tsx sync-iabako-products.ts --apply');
  }
}

syncProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
