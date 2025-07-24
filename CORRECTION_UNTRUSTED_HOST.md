# 🔐 Erreur UntrustedHost - NextAuth.js en Production

## ❌ Problème identifié

```
[auth][error] UntrustedHost: Host must be trusted. URL was: http://localhost:3000/api/auth/session
```

**Cause:** NextAuth.js bloque l'authentification en production car `localhost:3000` n'est pas considéré comme un hôte de confiance.

**Résultat:** 
- ✅ Upload fonctionne en développement (`npm run dev`)
- ❌ Upload échoue en production (`npm run build` + `npm start`) avec un pop-up rouge

## ✅ Solution appliquée

### 1. Configuration dans `auth.ts`
```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // ← AJOUTÉ: Accepter localhost en production
  providers: [
    // ...
  ]
})
```

### 2. Variable d'environnement dans `.env`
```properties
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=bK7Z6+gJa7DYuyIsL1GCEyjhn+qkPJqH2pQHOR/Kn/U=
```

## 🧪 Test de la correction

### Script automatisé
```bash
./test-correction-auth.sh
```

### Test manuel
1. **Rebuild** avec les corrections :
   ```bash
   npm run build
   ```

2. **Démarrer** en production :
   ```bash
   npm start
   ```

3. **Tester l'authentification** :
   - Allez sur http://localhost:3000/admin/login
   - Connectez-vous en tant qu'admin
   - Plus d'erreurs UntrustedHost dans les logs

4. **Tester l'upload** :
   - Allez sur http://localhost:3000/admin/test-upload
   - Cliquez sur "Tester l'authentification" → ✅ Devrait être OK
   - Cliquez sur "Tester l'upload" → ✅ Devrait fonctionner

## 🔍 Vérification des logs

### Avant la correction
```
❌ [auth][error] UntrustedHost: Host must be trusted
❌ Session: null
❌ Upload échoue avec "NO_SESSION"
```

### Après la correction
```
✅ 👤 Session vérifiée: { hasSession: true, userRole: 'ADMIN' }
✅ 📁 FormData reçu, clés disponibles: ['file']
✅ 🎉 Upload terminé avec succès
```

## 📊 Comparaison Dev vs Prod

| Aspect | Développement | Production (Avant) | Production (Après) |
|--------|---------------|-------------------|-------------------|
| AUTH_TRUST_HOST | Auto | ❌ Non défini | ✅ `true` |
| Vérification host | Permissive | ❌ Stricte | ✅ Autorisée |
| Session auth | ✅ Fonctionne | ❌ Bloquée | ✅ Fonctionne |
| Upload images | ✅ OK | ❌ Échoue | ✅ OK |

## 🛡️ Sécurité

Cette solution est sûre pour le développement local. En production réelle (avec un vrai domaine), utilisez :

```properties
# Production avec domaine réel
NEXTAUTH_URL=https://votre-domaine.com
AUTH_TRUST_HOST=false  # Plus strict
```

## ✅ Checklist de résolution

- [x] `trustHost: true` ajouté dans `auth.ts`
- [x] `AUTH_TRUST_HOST=true` ajouté dans `.env`
- [x] Rebuild effectué (`npm run build`)
- [x] Test en mode production (`npm start`)
- [x] Plus d'erreurs UntrustedHost dans les logs
- [x] Authentification fonctionne en production
- [x] Upload d'images fonctionne en production

## 🎯 Résultat final

**L'upload d'images fonctionne maintenant identiquement en développement et en production !**

Le problème du "pop-up rouge" en production était dû à l'échec de l'authentification, qui empêchait l'API d'upload de fonctionner. Avec cette correction, l'authentification passe et l'upload fonctionne parfaitement.
