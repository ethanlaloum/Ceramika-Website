# 🏭 Upload fonctionne en DEV mais pas en PRODUCTION - Solutions

## Problème identifié
L'upload d'images fonctionne en mode développement (`npm run dev`) mais échoue en mode production (`npm run build` + `npm start`).

## Causes communes et solutions

### 🔧 Solution 1: Dossier d'upload manquant en production

**Problème:** Le dossier `public/uploads/products` n'existe pas après le build.

**Solution appliquée:**
```bash
# Hooks ajoutés dans package.json
"prebuild": "mkdir -p public/uploads/products",
"postbuild": "mkdir -p public/uploads/products"
```

### 🔧 Solution 2: Configuration runtime de l'API

**Problème:** Les limites de runtime diffèrent entre dev et prod.

**Solution appliquée:**
```typescript
// Dans app/api/admin/upload/route.ts
export const runtime = 'nodejs'
export const preferredRegion = 'auto' 
export const maxDuration = 30
```

### 🔧 Solution 3: Gestion des chemins en production

**Problème:** `process.cwd()` peut pointer vers un dossier différent en production.

**Solution appliquée:**
- Logs détaillés pour déboguer les chemins
- Création explicite de tous les dossiers parents
- Test d'écriture avant sauvegarde

### 🔧 Solution 4: Configuration Next.js pour les images

**Problème:** Optimisations d'images peuvent interférer.

**Solution appliquée:**
```typescript
// Dans next.config.ts
images: {
  domains: ['localhost'],
  unoptimized: true,
}
```

## 🧪 Tests à effectuer

### Test 1: Mode développement
```bash
./test-serveur.sh
```
- Allez sur http://localhost:3000/admin/test-upload
- Testez l'upload d'une image
- ✅ Devrait fonctionner

### Test 2: Mode production
```bash
./test-production.sh
```
- Allez sur http://localhost:3000/admin/test-upload
- Testez l'upload d'une image
- 🎯 C'est ici que nous identifierons le problème

### Test 3: Comparaison des logs

**En développement, vous verrez:**
```
🔍 NODE_ENV: development
📂 CWD: /Users/ethanlaloum/Desktop/Freelance/ceramika
```

**En production, vous verrez:**
```
🔍 NODE_ENV: production
📂 CWD: /Users/ethanlaloum/Desktop/Freelance/ceramika
```

## 🔍 Diagnostic en temps réel

### Étape 1: Identifier l'erreur exacte
1. Démarrez en mode production
2. Ouvrez la console du navigateur (F12)
3. Tentez un upload
4. Relevez le message d'erreur exact

### Étape 2: Analyser les logs serveur
Surveillez dans le terminal les messages avec ces emojis :
- 🔍 Informations de debug
- ❌ Erreurs critiques
- ✅ Succès

### Étape 3: Vérifier les différences spécifiques

**Variables d'environnement:**
```bash
# En dev
NODE_ENV=development

# En prod  
NODE_ENV=production
```

**Chemins de fichiers:**
```bash
# Vérifier que le chemin est correct
📂 Chemin du dossier: /Users/ethanlaloum/Desktop/Freelance/ceramika/public/uploads/products
```

**Permissions:**
```bash
# Doit réussir en dev ET en prod
📁 Test d'écriture réussi
```

## 🚨 Erreurs spécifiques et solutions

### Erreur: "DIRECTORY_ERROR"
```json
{
  "error": "Erreur lors de la création du dossier de destination",
  "code": "DIRECTORY_ERROR"
}
```

**Solutions:**
1. Vérifier les permissions : `chmod 755 public/uploads/products`
2. Créer manuellement : `mkdir -p public/uploads/products`
3. Vérifier l'espace disque : `df -h .`

### Erreur: "FILE_WRITE_ERROR"  
```json
{
  "error": "Erreur lors de la sauvegarde du fichier",
  "code": "FILE_WRITE_ERROR"
}
```

**Solutions:**
1. Permissions insuffisantes sur le dossier
2. Espace disque plein
3. Nom de fichier invalide (caractères spéciaux)

### Erreur: "Fetch failed" côté client
```
NetworkError: Failed to fetch
```

**Solutions:**
1. L'API route n'est pas correctement buildée
2. Problème de routing en production
3. Limite de taille de requête dépassée

## 🎯 Script de test automatisé

Utilisez ces scripts pour tester rapidement :

```bash
# Test complet développement
./diagnostic-dev-vs-prod.sh

# Test mode développement
./test-serveur.sh

# Test mode production 
./test-production.sh
```

## 📊 Comparaison dev vs prod

| Aspect | Développement | Production |
|--------|---------------|------------|
| Hot reload | ✅ Oui | ❌ Non |
| Optimisations JS | ❌ Non | ✅ Oui |
| Cache agressif | ❌ Non | ✅ Oui |
| Gestion erreurs | 🔍 Détaillée | 🔒 Masquée |
| Variables env | Auto-reload | Statiques |
| Taille limites | Permissives | Strictes |

## ✅ Checklist de résolution

- [ ] Build réussi sans erreurs
- [ ] Dossier `public/uploads/products` existe après build
- [ ] Permissions d'écriture OK (755)
- [ ] Configuration runtime ajoutée à l'API
- [ ] Hooks prebuild/postbuild dans package.json
- [ ] Test en mode production effectué
- [ ] Logs serveur et client analysés
- [ ] Comparaison avec mode développement faite

Une fois ces vérifications faites, l'upload devrait fonctionner en production comme en développement.
