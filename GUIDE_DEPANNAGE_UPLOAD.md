# 🔧 GUIDE DE DÉPANNAGE - UPLOAD D'IMAGES

## 🚨 Erreur Pop-up Rouge lors de l'Upload

### 🔍 **Étapes de Diagnostic**

#### 1️⃣ **Vérifier les Logs du Navigateur**
1. Ouvrez les **DevTools** (F12)
2. Allez dans l'onglet **Console**
3. Essayez d'uploader une image
4. Notez les erreurs affichées

**Messages à rechercher :**
- `❌ Erreur serveur:` - Erreur côté API
- `📤 Envoi de la requête` - État de l'envoi
- `Network error` - Problème de connexion

#### 2️⃣ **Vérifier les Logs du Serveur**
Dans votre terminal où tourne `npm run dev`, recherchez :
- `🔍 Début de l'upload` - La requête arrive-t-elle ?
- `❌ Accès refusé` - Problème d'authentification
- `❌ Type de fichier` - Problème de format
- `❌ Fichier trop volumineux` - Problème de taille

---

## 🛠️ **Solutions par Type d'Erreur**

### 🔐 **Erreur d'Authentification**
**Symptôme :** `Accès non autorisé`

**Solution :**
1. Vérifiez que vous êtes **connecté en tant qu'admin**
2. Déconnectez-vous et reconnectez-vous
3. Vérifiez votre rôle dans la base de données

### 📁 **Erreur de Type de Fichier**
**Symptôme :** `Type de fichier non autorisé`

**Solution :**
- Utilisez uniquement : **JPG, PNG, WebP**
- Évitez : GIF, SVG, TIFF, etc.
- Vérifiez l'extension du fichier

### 📏 **Erreur de Taille**
**Symptôme :** `Le fichier est trop volumineux`

**Solution :**
- Réduisez la taille à **moins de 5MB**
- Compressez l'image avec un outil en ligne
- Utilisez une résolution plus petite

### 🌐 **Erreur de Connexion**
**Symptôme :** `Network Error` ou pas de logs serveur

**Solution :**
1. **Redémarrez le serveur** :
   ```bash
   npm run dev
   ```
2. Vérifiez l'URL : `http://localhost:3000`
3. Testez l'API directement : `/api/admin/upload`

### 💾 **Erreur de Sauvegarde**
**Symptôme :** Erreur lors de l'écriture du fichier

**Solution :**
1. Vérifiez les permissions du dossier :
   ```bash
   ls -la public/uploads/products/
   ```
2. Créez le dossier si nécessaire :
   ```bash
   mkdir -p public/uploads/products
   ```
3. Vérifiez l'espace disque disponible

---

## 🔍 **Tests de Diagnostic**

### Test 1 : Connexion Serveur
```bash
curl http://localhost:3000/api/admin/upload
```
**Attendu :** Erreur 405 (Method Not Allowed) ou 401 (Non autorisé)

### Test 2 : Permissions Dossier
```bash
./diagnostic-upload.sh
```

### Test 3 : Upload Manuel
1. Allez sur `/admin/products`
2. Cliquez "Ajouter un Produit"
3. Essayez avec une **petite image** (< 1MB)
4. Surveillez les **logs** dans les deux consoles

---

## 📋 **Checklist de Vérification**

### Avant l'Upload
- [ ] Serveur démarré (`npm run dev`)
- [ ] Connecté en tant qu'**admin**
- [ ] Image **< 5MB** et format **JPG/PNG/WebP**
- [ ] Dossier `public/uploads/products/` existe

### Pendant l'Upload
- [ ] Console navigateur ouverte (F12)
- [ ] Terminal serveur visible
- [ ] Pas d'autre upload en cours

### En cas d'échec
- [ ] Logs navigateur capturés
- [ ] Logs serveur capturés
- [ ] Détails du fichier notés (nom, taille, type)

---

## 🚀 **Solutions Rapides**

### Solution Express #1
```bash
# Redémarrer complètement
pkill -f "npm run dev"
npm run dev
```

### Solution Express #2
```bash
# Recréer le dossier d'upload
rm -rf public/uploads/products
mkdir -p public/uploads/products
```

### Solution Express #3
```javascript
// Dans la console navigateur, vérifier l'auth
console.log(document.cookie)
```

---

## 📞 **Support Avancé**

Si le problème persiste, partagez :

1. **Logs complets** de la console navigateur
2. **Logs complets** du terminal serveur
3. **Détails du fichier** (nom, taille, format)
4. **Screenshots** du problème
5. **Étapes exactes** pour reproduire

### Logs à Capturer
```bash
# Côté serveur
🔍 Début de l'upload - Timestamp: [DATE]
👤 Session vérifiée: { hasSession: true, userRole: 'ADMIN' }
📄 Fichier reçu: { fileName: 'image.jpg', fileSize: 123456 }
# ... suite des logs

# Côté navigateur  
🚀 Début upload côté client: { fileName: 'image.jpg' }
📤 Envoi de la requête vers /api/admin/upload...
❌ Erreur serveur: [ERREUR DÉTAILLÉE]
```

---

## 🎯 **Résolution Garantie**

Avec les **logs détaillés** ajoutés, nous pouvons maintenant :
1. **Identifier précisément** où l'erreur survient
2. **Voir les données** transmises à chaque étape  
3. **Diagnostiquer rapidement** le problème
4. **Corriger** efficacement la cause

**📧 Envoyez-moi les logs et nous résoudrons cela immédiatement !**
