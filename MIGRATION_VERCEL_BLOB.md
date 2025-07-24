# Migration vers Vercel Blob Storage

## 🎯 Objectif
Résoudre les erreurs d'upload d'images (`EROFS: read-only file system`) en migrant du stockage local vers Vercel Blob Storage.

## ❌ Problème résolu
```
Error: EACCES: permission denied, mkdir '/var/task/public'
Error: EROFS: read-only file system, mkdir '/var/task/public/uploads'
```

## ✅ Solution implémentée
Migration complète vers **Vercel Blob Storage** avec l'API `@vercel/blob`.

## 📦 Configuration requise

### 1. Package installé
```bash
npm install @vercel/blob
```
✅ Déjà installé dans `package.json`

### 2. Variable d'environnement Vercel
Dans le dashboard Vercel, configurer :
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

**Comment obtenir le token :**
1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Aller dans Storage > Create Database > Blob
3. Créer un store Blob
4. Copier le token `BLOB_READ_WRITE_TOKEN`

### 3. Variable locale (.env)
```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

## 🔄 Changements apportés

### API Upload (`app/api/admin/upload/route.ts`)
**AVANT (stockage local) :**
```typescript
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Créer dossier local
const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
await mkdir(uploadDir, { recursive: true })

// Sauvegarder localement
await writeFile(filePath, buffer)
```

**APRÈS (Vercel Blob) :**
```typescript
import { put } from '@vercel/blob'

// Upload direct vers Vercel Blob
const blob = await put(filename, file, {
  access: 'public',
  handleUploadUrl: 'https://ceramika-seven.vercel.app/api/admin/upload',
})

// Retourner l'URL Vercel Blob
return { url: blob.url }
```

### Composant React (`components/admin/products/image-upload.tsx`)
**Changement minimal :** Le composant continue de fonctionner identiquement car il reçoit une URL d'image valide.

**AVANT :** `/uploads/products/image.jpg`
**APRÈS :** `https://xxxxxx.blob.vercel-storage.com/products/image.jpg`

## 🔧 Test en développement

### 1. Démarrer le serveur
```bash
npm run dev
```

### 2. Test manuel
```bash
./test-vercel-blob-upload.sh
```

### 3. Test dans l'interface admin
1. Se connecter en tant qu'admin
2. Aller dans "Produits" > "Nouveau produit"
3. Uploader une image
4. Vérifier que l'URL générée pointe vers `*.blob.vercel-storage.com`

## 🚀 Déploiement en production

### 1. Configurer la variable d'environnement
Dans Vercel Dashboard :
- Settings > Environment Variables
- Ajouter `BLOB_READ_WRITE_TOKEN`
- Valeur : `vercel_blob_rw_XXXXXXXXXX`

### 2. Redéployer
```bash
git push origin main
# ou via Vercel Dashboard : Deployments > Redeploy
```

### 3. Vérification post-déploiement
1. Tester l'upload d'image en production
2. Vérifier que les images sont accessibles
3. Vérifier les logs Vercel pour les erreurs

## 📊 Avantages de la migration

### ✅ Résolu
- ❌ `EROFS: read-only file system` 
- ❌ `EACCES: permission denied`
- ❌ Stockage local impossible sur Vercel
- ❌ Images perdues entre déploiements

### ✅ Bénéfices
- ☁️ Stockage persistant et fiable
- 🔗 URLs directes et optimisées
- 📈 Pas de limite de stockage local
- 🌍 CDN global automatique
- 🔒 Sécurité et permissions intégrées

## 🔍 Debugging

### Erreurs possibles

#### 1. Token manquant
```
Error: BLOB_TOKEN_MANQUANT
```
**Solution :** Configurer `BLOB_READ_WRITE_TOKEN` dans Vercel

#### 2. Quota dépassé
```
Error: QUOTA_BLOB_DEPASSE
```
**Solution :** Vérifier le plan Vercel et l'usage Blob Storage

#### 3. Erreur réseau
```
Error: ERREUR_RESEAU
```
**Solution :** Vérifier la connectivité et les domaines autorisés

### Logs de debugging
Tous les logs sont préfixés `[VERCEL BLOB]` pour faciliter le debugging.

## 🧹 Nettoyage

### Fichiers obsolètes (à supprimer)
- `app/uploads/products/[...path]/route.ts` (API route locale)
- `public/uploads/products/` (dossier local)
- Scripts de création de dossiers dans `package.json`

### Configuration obsolète
- Rewrites pour `/uploads/` dans `next.config.ts`
- RemotePatterns pour domaine local

## 📚 Documentation Vercel Blob
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [API Reference](https://vercel.com/docs/storage/vercel-blob/server-upload)
- [Pricing](https://vercel.com/docs/storage/vercel-blob/pricing)
