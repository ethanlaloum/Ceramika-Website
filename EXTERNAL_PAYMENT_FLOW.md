# Flow de paiement externe Polar

## 🚀 **Nouveau comportement de paiement**

Le paiement utilise maintenant une **redirection externe** vers Polar/Stripe, sans iframe intégrée.

### **Étapes du processus :**

1. **Clic sur "Procéder au paiement"**
   - Création d'un checkout via l'API Polar
   - Redirection automatique vers la page de paiement externe

2. **Page de paiement Polar/Stripe**
   - Formulaire de paiement complet sur le domaine Polar
   - Toutes les fonctionnalités Stripe disponibles
   - Interface optimisée et sécurisée

3. **Retour automatique sur Ceramika**
   - **Succès** : `/checkout/success` + panier automatiquement vidé
   - **Échec/Annulation** : `/checkout/cancel` + panier conservé

### **Avantages :**

✅ **UX optimisée** - Page de paiement dédiée, plus rapide et fiable
✅ **Sécurité renforcée** - Traitement sur les serveurs Polar/Stripe
✅ **Fonctionnalités complètes** - Toutes les options de paiement Stripe
✅ **Mobile-friendly** - Interface responsive native
✅ **Moins de bugs** - Pas de problème d'iframe ou de chargement

### **URLs de redirection :**

- `success_url`: `https://ceramika.com/checkout/success`
- `cancel_url`: `https://ceramika.com/checkout/cancel`

### **Test en sandbox :**

Utilisez les cartes de test Stripe depuis `PAYMENT_TEST_GUIDE.md` pour tester tous les scénarios.

---

**Configuration :** Voir `/components/polar-checkout-button.tsx` pour la logique de redirection.
