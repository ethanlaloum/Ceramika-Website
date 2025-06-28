#!/usr/bin/env python3
import csv
import os

# Chemin vers le fichier CSV
csv_file_path = "/Users/ethanlaloum/Desktop/Freelance/ceramika/Produits_clean.csv"
backup_file_path = "/Users/ethanlaloum/Desktop/Freelance/ceramika/Produits_clean_backup_sequential.csv"

# Faire une sauvegarde du fichier actuel
print("Création d'une nouvelle sauvegarde...")
os.system(f'cp "{csv_file_path}" "{backup_file_path}"')

# Lire le fichier CSV
print("Lecture du fichier CSV...")
rows = []
with open(csv_file_path, 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    rows = list(reader)

print(f"Nombre de lignes lues: {len(rows)}")

# Vérifier la structure
if len(rows) > 0:
    header = rows[0]
    print(f"En-têtes: {header}")
    
    # Trouver l'index de la colonne polarId
    if 'polarId' in header:
        polar_id_index = header.index('polarId')
        print(f"Index de la colonne polarId: {polar_id_index}")
        
        # Modifier toutes les lignes de données avec des valeurs séquentielles
        modified_count = 0
        for i in range(1, len(rows)):  # Commencer à 1 pour ignorer l'en-tête
            if len(rows[i]) > polar_id_index:
                # Assigner une valeur séquentielle (1, 2, 3, ...)
                sequential_value = str(i)  # i commence à 1, donc la première ligne de données aura polarId = 1
                rows[i][polar_id_index] = sequential_value
                modified_count += 1
        
        print(f"Nombre de lignes modifiées: {modified_count}")
        print(f"Valeurs polarId assignées de 1 à {modified_count}")
        
        # Écrire le fichier modifié
        print("Écriture du fichier modifié...")
        with open(csv_file_path, 'w', encoding='utf-8', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(rows)
        
        print("✅ Fichier CSV mis à jour avec des valeurs séquentielles!")
        print(f"📁 Nouvelle sauvegarde créée: {backup_file_path}")
        
    else:
        print("❌ Erreur: Colonne 'polarId' non trouvée dans le fichier CSV")
else:
    print("❌ Erreur: Le fichier CSV est vide")
