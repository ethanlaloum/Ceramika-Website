#!/usr/bin/env python3
import csv
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

async def update_products_polar_ids():
    """Met à jour les polarId des produits en base depuis le CSV"""
    
    # Connexion à la base de données
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL non trouvée dans les variables d'environnement")
        return
    
    try:
        conn = await asyncpg.connect(database_url)
        print("✅ Connexion à la base de données établie")
        
        # Lire le fichier CSV
        csv_file_path = "/Users/ethanlaloum/Desktop/Freelance/ceramika/Produits_clean.csv"
        products_data = []
        
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                products_data.append({
                    'id': row['id'],
                    'polarId': row['polarId']
                })
        
        print(f"📄 Lecture de {len(products_data)} produits depuis le CSV")
        
        # Mettre à jour chaque produit
        updated_count = 0
        for product in products_data:
            try:
                result = await conn.execute(
                    "UPDATE products SET \"polarId\" = $1 WHERE id = $2",
                    product['polarId'], product['id']
                )
                if result.endswith('1'):  # 1 ligne affectée
                    updated_count += 1
            except Exception as e:
                print(f"❌ Erreur pour le produit {product['id']}: {e}")
        
        print(f"✅ {updated_count} produits mis à jour avec leurs polarId")
        
        # Vérifier le résultat
        products_with_polar_id = await conn.fetchval(
            "SELECT COUNT(*) FROM products WHERE \"polarId\" IS NOT NULL AND \"polarId\" != ''"
        )
        
        print(f"📊 Produits avec polarId en base: {products_with_polar_id}")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Erreur lors de la mise à jour: {e}")

if __name__ == "__main__":
    asyncio.run(update_products_polar_ids())
