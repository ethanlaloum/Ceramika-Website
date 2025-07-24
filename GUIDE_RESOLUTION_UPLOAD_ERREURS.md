# 🚨 Guide de résolution - Erreur d'upload d'images

## Problème
Vous obtenez un **pop-up rouge** lors du téléchargement d'images dans l'espace admin des produits.

## Solutions par ordre de priorité

### 🔧 Solution 1: Démarrer le serveur et tester
```bash
# 1. Démarrer le serveur
./test-serveur.sh

# 2. Ouvrir le navigateur sur http://localhost:3000
# 3. Se connecter en tant qu'admin
# 4. Aller sur http://localhost:3000/admin/test-upload
# 5. Tester l'upload avec le bouton "Tester l'upload"
```

### 🔍 Solution 2: Diagnostiquer les erreurs spécifiques

#### A. Vérifier les logs du navigateur
1. Appuyez sur **F12** dans votre navigateur
2. Allez dans l'onglet **Console**
3. Tentez un upload d'image
4. Relevez les erreurs affichées en rouge

#### B. Vérifier les logs du serveur
1. Dans le terminal où tourne Next.js, surveillez les messages
2. Recherchez les lignes avec des emojis 🔍, ❌, ✅
3. Relevez les erreurs spécifiques

### 🎯 Solution 3: Erreurs communes et corrections

#### Erreur: "Aucune session active"
```bash
# Solution: Se reconnecter
1. Aller sur /admin/login
2. Se connecter avec vos identifiants admin
3. Retester l'upload
```

#### Erreur: "Permissions insuffisantes"
```bash
# Solution: Vérifier le rôle utilisateur
1. Vérifier que votre compte a le rôle "ADMIN"
2. Dans la base de données, table users, colonne role doit être "ADMIN"
```

#### Erreur: "Type de fichier non autorisé"
```bash
# Solution: Utiliser des formats supportés
1. Utilisez uniquement: JPG, JPEG, PNG, WebP
2. Évitez: GIF, BMP, TIFF, SVG
```

#### Erreur: "Fichier trop volumineux"
```bash
# Solution: Réduire la taille du fichier
1. Taille maximum: 5MB
2. Compressez l'image avant upload
3. Utilisez des outils comme TinyPNG
```

#### Erreur: "Erreur lors de la lecture du fichier"
```bash
# Solution: Vérifier l'intégrité du fichier
1. Essayez avec une autre image
2. Vérifiez que le fichier n'est pas corrompu
3. Tentez avec une image plus petite (< 1MB)
```

#### Erreur: "Erreur lors de la création du dossier"
```bash
# Solution: Vérifier les permissions du système
chmod 755 public/uploads/products
```

#### Erreur: "Erreur lors de la sauvegarde du fichier"
```bash
# Solution: Vérifier l'espace disque
df -h .  # Vérifier l'espace disponible
```

### 🛠️ Solution 4: Réinitialisation complète

Si rien ne fonctionne :

```bash
# 1. Supprimer et recréer le dossier d'upload
rm -rf public/uploads/products
mkdir -p public/uploads/products

# 2. Vérifier les permissions
chmod 755 public/uploads/products

# 3. Reinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# 4. Rebuild le projet
npm run build

# 5. Redémarrer le serveur
npm run dev
```

### 📊 Solution 5: Utiliser la page de test dédiée

1. Allez sur `http://localhost:3000/admin/test-upload`
2. Cliquez sur "Tester l'authentification"
3. Cliquez sur "Tester l'upload"
4. Observez les résultats détaillés

### 🔬 Solution 6: Debug avancé

Si vous êtes développeur, ajoutez des breakpoints :

```javascript
// Dans image-upload.tsx, ligne ~45
console.log('🚀 Début upload côté client:', {
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type
});

// Dans app/api/admin/upload/route.ts, ligne ~8
console.log('🔍 Début de l\'upload - Timestamp:', new Date().toISOString());
```

### 📞 Support

Si le problème persiste après avoir essayé toutes ces solutions :

1. **Collectez les informations suivantes :**
   - Message d'erreur exact du pop-up rouge
   - Logs de la console navigateur (F12 > Console)
   - Logs du serveur Next.js
   - Type et taille du fichier testé
   - Navigateur utilisé

2. **Testez sur différents navigateurs :**
   - Chrome
   - Firefox  
   - Safari

3. **Testez avec différents fichiers :**
   - Une image très petite (< 100KB)
   - Format PNG simple
   - Image créée avec Paint/Preview

## Checklist de résolution ✅

- [ ] Serveur Next.js démarré avec `npm run dev`
- [ ] Connecté en tant qu'admin
- [ ] Testé sur http://localhost:3000/admin/test-upload
- [ ] Consulté la console du navigateur (F12)
- [ ] Surveillé les logs du serveur
- [ ] Testé avec différents formats d'image
- [ ] Testé avec différentes tailles d'image
- [ ] Vérifié les permissions du dossier public/uploads/products
- [ ] Tenté une réinitialisation complète si nécessaire

Cette approche méthodique devrait identifier et résoudre la cause du pop-up rouge lors de l'upload d'images.
