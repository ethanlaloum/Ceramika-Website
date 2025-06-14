"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Theme Context
type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

// Language Context - Default to French
type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  fr: {
    // Navigation
    "nav.collections": "Collections",
    "nav.artists": "Artistes",
    "nav.about": "À Propos",
    "nav.contact": "Contact",
    "nav.search": "Rechercher céramiques...",
    "nav.cart": "Panier",
    "nav.customer": "Connexion Client",
    "nav.admin": "Connexion Admin",

    // Homepage
    "hero.title": "Céramiques Artisanales",
    "hero.subtitle":
      "Découvrez des ustensiles en céramique faits à la main qui transforment vos repas quotidiens en expérience artistique",
    "hero.explore": "Explorer les Collections",
    "hero.artists": "Rencontrer nos Artistes",
    "featured.title": "Pièces Vedettes",
    "featured.subtitle": "Sélections soigneusement choisies de nos artistes les plus célèbres",
    "collections.title": "Nos Collections",
    "collections.subtitle":
      "Explorez des collections thématiques qui racontent des histoires uniques à travers l'art céramique",
    "artists.title": "Rencontrez nos Artistes",
    "artists.subtitle":
      "Chaque pièce de notre collection est créée par des artisans qualifiés qui apportent des décennies d'expérience et de passion à leur travail.",

    // Collections Page
    "collections.page.title": "Nos Collections",
    "collections.page.subtitle":
      "Découvrez des collections organisées qui présentent la diversité et l'art de la céramique contemporaine",
    "collections.featured": "Vedette",
    "collections.pieces": "pièces",
    "collections.by": "par",
    "collections.cant.find": "Vous ne trouvez pas ce que vous cherchez ?",
    "collections.custom.description":
      "Nos artistes créent également des pièces sur mesure. Contactez-nous pour discuter de la commande d'une pièce céramique unique adaptée à votre vision.",
    "collections.commission": "Commander un Travail Personnalisé",

    // Artists Page
    "artists.page.title": "Nos Artistes",
    "artists.page.subtitle":
      "Rencontrez les artisans talentueux qui donnent vie à l'argile avec leurs mains habiles et leur vision créative",
    "artists.featured.title": "Artistes Vedettes",
    "artists.featured.subtitle": "Pleins feux sur nos artistes céramistes les plus célèbres",
    "artists.all.title": "Tous les Artistes",
    "artists.interested": "Intéressé à devenir un Artiste Partenaire ?",
    "artists.looking":
      "Nous recherchons toujours des artistes céramistes talentueux pour rejoindre notre communauté. Partagez votre travail avec des passionnés de céramique du monde entier.",
    "artists.apply": "Postuler pour Rejoindre",

    // Product
    "product.addToCart": "Ajouter au Panier",
    "product.addToWishlist": "Ajouter aux Favoris",
    "product.inStock": "En Stock",
    "product.outOfStock": "Rupture de Stock",
    "product.reviews": "avis",
    "product.details": "Détails",
    "product.care": "Instructions d'Entretien",
    "product.quantity": "Quantité",
    "product.save": "Économisez",
    "product.by": "par",
    "product.home": "Accueil",
    "product.collections": "Collections",
    "product.features": "Caractéristiques du Produit",
    "product.care.intro":
      "Pour assurer la longévité de vos pièces céramiques, veuillez suivre ces directives d'entretien :",
    "product.dishwasher": "• Compatible lave-vaisselle en cycle normal",
    "product.microwave": "• Compatible micro-ondes pour réchauffer",
    "product.temp.changes": "• Évitez les changements de température soudains",
    "product.hand.wash": "• Lavage à la main recommandé pour un meilleur entretien",
    "product.store": "• Rangez soigneusement pour éviter les éclats",
    "product.customer.reviews": "Avis Clients",
    "product.verified": "Achat Vérifié",
    "product.review.text":
      "Magnifique artisanat et parfait pour un usage quotidien. Le glaçage est superbe et chaque bol a son propre caractère unique.",
    "product.more.from": "Plus de",
    "product.free.shipping": "Livraison gratuite",
    "product.secure.payment": "Paiement sécurisé",
    "product.returns": "Retours 30 jours",

    // Cart
    "cart.title": "Panier d'Achat",
    "cart.empty": "Votre panier est vide",
    "cart.continue": "Continuer les Achats",
    "cart.checkout": "Procéder au Paiement",
    "cart.remove": "Supprimer",
    "cart.quantity": "Quantité",
    "cart.subtotal": "Sous-total",
    "cart.shipping": "Livraison",
    "cart.total": "Total",

    // Auth
    "auth.welcome": "Bienvenue dans votre voyage céramique",
    "auth.sign.in": "Se Connecter",
    "auth.create.account": "Créer un Compte",
    "auth.welcome.back": "Bon retour ! Veuillez vous connecter à votre compte.",
    "auth.join.community": "Rejoignez notre communauté de passionnés de céramique.",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.first.name": "Prénom",
    "auth.last.name": "Nom",
    "auth.enter.password": "Entrez votre mot de passe",
    "auth.create.password": "Créez un mot de passe",
    "auth.confirm.password": "Confirmez votre mot de passe",
    "auth.forgot.password": "Mot de passe oublié ?",
    "auth.no.account": "Vous n'avez pas de compte ?",
    "auth.create.one": "Créez-en un",
    "auth.have.account": "Vous avez déjà un compte ?",
    "auth.sign.in.link": "Connectez-vous",
    "auth.back.store": "Retour au magasin",
    "auth.back.to.login": "Retour à la Connexion",
    "auth.back.to.admin.login": "Retour à la Connexion Admin",

    // Admin
    "admin.portal": "Portail d'Accès Administratif",
    "admin.sign.in": "Connexion Admin",
    "admin.description": "Entrez vos identifiants administratifs pour accéder au tableau de bord.",
    "admin.email": "Email",
    "admin.password": "Mot de passe",
    "admin.password.placeholder": "Entrez le mot de passe admin",
    "admin.sign.in.dashboard": "Se Connecter au Tableau de Bord",
    "admin.forgot.password": "Mot de passe admin oublié ?",
    "admin.back.site": "Retour au site principal",

    // Dashboard
    orders: "Commandes",
    wishlist: "Liste de Souhaits",
    profile: "Profil",
    settings: "Paramètres",
    sign_out: "Se Déconnecter",
    my_orders: "Mes Commandes",
    track_and_manage_your_ceramic_purchases: "Suivez et gérez vos achats de céramiques",
    order: "Commande",
    placed_on: "Passée le",
    view_details: "Voir les Détails",
    my_wishlist: "Ma Liste de Souhaits",
    save_your_favorite_ceramic_pieces_for_later: "Sauvegardez vos pièces céramiques préférées pour plus tard",
    out_of_stock: "Rupture de Stock",
    add_to_cart: "Ajouter au Panier",
    notify_when_available: "Notifier Quand Disponible",
    my_profile: "Mon Profil",
    manage_your_personal_information: "Gérez vos informations personnelles",
    personal_information: "Informations Personnelles",
    first_name: "Prénom",
    last_name: "Nom",
    phone: "Téléphone",
    save_changes: "Enregistrer les Modifications",
    shipping_address: "Adresse de Livraison",
    address_line_1: "Ligne d'Adresse 1",
    address_line_2: "Ligne d'Adresse 2",
    apartment_suite_etc: "Appartement, suite, etc.",
    city: "Ville",
    state: "État/Province",
    zip_code: "Code Postal",
    update_address: "Mettre à Jour l'Adresse",
    manage_your_account_preferences: "Gérez vos préférences de compte",
    email_preferences: "Préférences Email",
    new_product_notifications: "Notifications Nouveaux Produits",
    get_notified_about_new_ceramic_arrivals: "Soyez notifié des nouvelles arrivées céramiques",
    order_updates: "Mises à Jour Commandes",
    receive_updates_about_your_orders: "Recevez des mises à jour sur vos commandes",
    artist_spotlights: "Pleins Feux Artistes",
    learn_about_featured_artists_and_their_work: "Découvrez les artistes vedettes et leur travail",
    special_offers: "Offres Spéciales",
    receive_exclusive_discounts_and_promotions: "Recevez des remises exclusives et promotions",
    account_security: "Sécurité du Compte",
    change_password: "Changer le Mot de Passe",
    enable_two_factor_authentication: "Activer l'Authentification à Deux Facteurs",
    delete_account: "Supprimer le Compte",

    // Admin Dashboard
    manageCeramicMarketplace: "Gérez votre marché céramique",
    totalProducts: "Total Produits",
    activeArtists: "Artistes Actifs",
    ordersToday: "Commandes Aujourd'hui",
    revenue: "Revenus",
    overview: "Aperçu",
    products: "Produits",
    artists: "Artistes",
    recentOrders: "Commandes Récentes",
    latestCustomerOrders: "Dernières commandes clients et leur statut",
    addProduct: "Ajouter Produit",
    searchProducts: "Rechercher produits...",
    filter: "Filtrer",
    product: "Produit",
    artist: "Artiste",
    price: "Prix",
    stock: "Stock",
    status: "Statut",
    actions: "Actions",
    addArtist: "Ajouter Artiste",
    name: "Nom",
    email: "Email",

    // Coming Soon
    "coming.soon.title": "Bientôt Disponible",
    "coming.soon.description": "Nous travaillons dur pour vous apporter cette fonctionnalité. Restez à l'écoute !",
    "coming.soon.notify.title": "Être Notifié",
    "coming.soon.notify.description": "Soyez le premier à savoir quand cette fonctionnalité sera disponible",
    "coming.soon.email.placeholder": "Entrez votre email",
    "coming.soon.notify.button": "Me Notifier",

    // Page-specific Coming Soon
    "about.coming.soon.title": "À Propos - Bientôt Disponible",
    "about.coming.soon.description":
      "Découvrez notre histoire, notre mission et les artisans derrière nos belles céramiques.",
    "contact.coming.soon.title": "Contact - Bientôt Disponible",
    "contact.coming.soon.description": "Contactez notre équipe pour des demandes, commandes personnalisées et support.",
    "products.coming.soon.title": "Tous les Produits - Bientôt Disponible",
    "products.coming.soon.description": "Parcourez notre catalogue complet de pièces céramiques artisanales.",
    "collection.detail.coming.soon.title": "Détails de Collection - Bientôt Disponible",
    "collection.detail.coming.soon.description": "Explorez les collections individuelles et leurs histoires uniques.",
    "artist.detail.coming.soon.title": "Profil d'Artiste - Bientôt Disponible",
    "artist.detail.coming.soon.description":
      "Découvrez les histoires et techniques derrière le travail de chaque artiste.",
    "forgot.password.coming.soon.title": "Réinitialisation de Mot de Passe - Bientôt Disponible",
    "forgot.password.coming.soon.description":
      "La fonctionnalité de récupération de mot de passe sera bientôt disponible.",
    "admin.forgot.password.coming.soon.title": "Réinitialisation Admin - Bientôt Disponible",
    "admin.forgot.password.coming.soon.description": "La récupération de mot de passe admin sera bientôt disponible.",

    // Common
    "common.loading": "Chargement...",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.close": "Fermer",
    "common.back.home": "Retour à l'Accueil",
    "common.featured": "Vedette",
    "common.pieces": "pièces",
    "common.by": "par",
  },
  en: {
    // Navigation
    "nav.collections": "Collections",
    "nav.artists": "Artists",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.search": "Search ceramics...",
    "nav.cart": "Cart",
    "nav.customer": "Customer Login",
    "nav.admin": "Admin Login",

    // Homepage
    "hero.title": "Artisan Ceramics",
    "hero.subtitle": "Discover handcrafted ceramic utensils that transform everyday dining into an artistic experience",
    "hero.explore": "Explore Collections",
    "hero.artists": "Meet Our Artists",
    "featured.title": "Featured Pieces",
    "featured.subtitle": "Carefully curated selections from our most celebrated artists",
    "collections.title": "Our Collections",
    "collections.subtitle": "Explore themed collections that tell unique stories through ceramic artistry",
    "artists.title": "Meet Our Artists",
    "artists.subtitle":
      "Each piece in our collection is crafted by skilled artisans who bring decades of experience and passion to their work.",

    // Collections Page
    "collections.page.title": "Our Collections",
    "collections.page.subtitle":
      "Discover curated collections that showcase the diversity and artistry of contemporary ceramics",
    "collections.featured": "Featured",
    "collections.pieces": "pieces",
    "collections.by": "by",
    "collections.cant.find": "Can't Find What You're Looking For?",
    "collections.custom.description":
      "Our artists also create custom pieces. Contact us to discuss commissioning a unique ceramic piece tailored to your vision.",
    "collections.commission": "Commission Custom Work",

    // Artists Page
    "artists.page.title": "Our Artists",
    "artists.page.subtitle":
      "Meet the talented artisans who bring clay to life with their skilled hands and creative vision",
    "artists.featured.title": "Featured Artists",
    "artists.featured.subtitle": "Spotlight on our most celebrated ceramic artists",
    "artists.all.title": "All Artists",
    "artists.interested": "Interested in Becoming an Artist Partner?",
    "artists.looking":
      "We're always looking for talented ceramic artists to join our community. Share your work with ceramic enthusiasts worldwide.",
    "artists.apply": "Apply to Join",

    // Product
    "product.addToCart": "Add to Cart",
    "product.addToWishlist": "Add to Wishlist",
    "product.inStock": "In Stock",
    "product.outOfStock": "Out of Stock",
    "product.reviews": "reviews",
    "product.details": "Details",
    "product.care": "Care Instructions",
    "product.quantity": "Quantity",
    "product.save": "Save",
    "product.by": "by",
    "product.home": "Home",
    "product.collections": "Collections",
    "product.features": "Product Features",
    "product.care.intro": "To ensure the longevity of your ceramic pieces, please follow these care guidelines:",
    "product.dishwasher": "• Dishwasher safe on normal cycle",
    "product.microwave": "• Microwave safe for reheating",
    "product.temp.changes": "• Avoid sudden temperature changes",
    "product.hand.wash": "• Hand washing recommended for best care",
    "product.store": "• Store carefully to prevent chipping",
    "product.customer.reviews": "Customer Reviews",
    "product.verified": "Verified Purchase",
    "product.review.text":
      "Beautiful craftsmanship and perfect for everyday use. The glaze is stunning and each bowl has its own unique character.",
    "product.more.from": "More from",
    "product.free.shipping": "Free shipping",
    "product.secure.payment": "Secure payment",
    "product.returns": "30-day returns",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.continue": "Continue Shopping",
    "cart.checkout": "Proceed to Checkout",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.total": "Total",

    // Auth
    "auth.welcome": "Welcome to your ceramic journey",
    "auth.sign.in": "Sign In",
    "auth.create.account": "Create Account",
    "auth.welcome.back": "Welcome back! Please sign in to your account.",
    "auth.join.community": "Join our community of ceramic enthusiasts.",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.first.name": "First Name",
    "auth.last.name": "Last Name",
    "auth.enter.password": "Enter your password",
    "auth.create.password": "Create a password",
    "auth.confirm.password": "Confirm your password",
    "auth.forgot.password": "Forgot password?",
    "auth.no.account": "Don't have an account?",
    "auth.create.one": "Create one",
    "auth.have.account": "Already have an account?",
    "auth.sign.in.link": "Sign in",
    "auth.back.store": "Back to store",
    "auth.back.to.login": "Back to Login",
    "auth.back.to.admin.login": "Back to Admin Login",

    // Admin
    "admin.portal": "Administrative Access Portal",
    "admin.sign.in": "Admin Sign In",
    "admin.description": "Enter your administrative credentials to access the dashboard.",
    "admin.email": "Email",
    "admin.password": "Password",
    "admin.password.placeholder": "Enter admin password",
    "admin.sign.in.dashboard": "Sign In to Dashboard",
    "admin.forgot.password": "Forgot your admin password?",
    "admin.back.site": "Back to main site",

    // Dashboard
    orders: "Orders",
    wishlist: "Wishlist",
    profile: "Profile",
    settings: "Settings",
    sign_out: "Sign Out",
    my_orders: "My Orders",
    track_and_manage_your_ceramic_purchases: "Track and manage your ceramic purchases",
    order: "Order",
    placed_on: "Placed on",
    view_details: "View Details",
    my_wishlist: "My Wishlist",
    save_your_favorite_ceramic_pieces_for_later: "Save your favorite ceramic pieces for later",
    out_of_stock: "Out of Stock",
    add_to_cart: "Add to Cart",
    notify_when_available: "Notify When Available",
    my_profile: "My Profile",
    manage_your_personal_information: "Manage your personal information",
    personal_information: "Personal Information",
    first_name: "First Name",
    last_name: "Last Name",
    phone: "Phone",
    save_changes: "Save Changes",
    shipping_address: "Shipping Address",
    address_line_1: "Address Line 1",
    address_line_2: "Address Line 2",
    apartment_suite_etc: "Apartment, suite, etc.",
    city: "City",
    state: "State",
    zip_code: "ZIP Code",
    update_address: "Update Address",
    manage_your_account_preferences: "Manage your account preferences",
    email_preferences: "Email Preferences",
    new_product_notifications: "New Product Notifications",
    get_notified_about_new_ceramic_arrivals: "Get notified about new ceramic arrivals",
    order_updates: "Order Updates",
    receive_updates_about_your_orders: "Receive updates about your orders",
    artist_spotlights: "Artist Spotlights",
    learn_about_featured_artists_and_their_work: "Learn about featured artists and their work",
    special_offers: "Special Offers",
    receive_exclusive_discounts_and_promotions: "Receive exclusive discounts and promotions",
    account_security: "Account Security",
    change_password: "Change Password",
    enable_two_factor_authentication: "Enable Two-Factor Authentication",
    delete_account: "Delete Account",

    // Admin Dashboard
    manageCeramicMarketplace: "Manage your ceramic marketplace",
    totalProducts: "Total Products",
    activeArtists: "Active Artists",
    ordersToday: "Orders Today",
    revenue: "Revenue",
    overview: "Overview",
    products: "Products",
    artists: "Artists",
    recentOrders: "Recent Orders",
    latestCustomerOrders: "Latest customer orders and their status",
    addProduct: "Add Product",
    searchProducts: "Search products...",
    filter: "Filter",
    product: "Product",
    artist: "Artist",
    price: "Price",
    stock: "Stock",
    status: "Status",
    actions: "Actions",
    addArtist: "Add Artist",
    name: "Name",
    email: "Email",

    // Coming Soon
    "coming.soon.title": "Coming Soon",
    "coming.soon.description": "We're working hard to bring you this feature. Stay tuned!",
    "coming.soon.notify.title": "Get Notified",
    "coming.soon.notify.description": "Be the first to know when this feature becomes available",
    "coming.soon.email.placeholder": "Enter your email",
    "coming.soon.notify.button": "Notify Me",

    // Page-specific Coming Soon
    "about.coming.soon.title": "About Us - Coming Soon",
    "about.coming.soon.description": "Learn about our story, mission, and the artisans behind our beautiful ceramics.",
    "contact.coming.soon.title": "Contact Us - Coming Soon",
    "contact.coming.soon.description": "Get in touch with our team for inquiries, custom orders, and support.",
    "products.coming.soon.title": "All Products - Coming Soon",
    "products.coming.soon.description": "Browse our complete catalog of handcrafted ceramic pieces.",
    "collection.detail.coming.soon.title": "Collection Details - Coming Soon",
    "collection.detail.coming.soon.description": "Explore individual collections and their unique stories.",
    "artist.detail.coming.soon.title": "Artist Profile - Coming Soon",
    "artist.detail.coming.soon.description": "Discover the stories and techniques behind each artist's work.",
    "forgot.password.coming.soon.title": "Password Reset - Coming Soon",
    "forgot.password.coming.soon.description": "Password recovery functionality will be available soon.",
    "admin.forgot.password.coming.soon.title": "Admin Password Reset - Coming Soon",
    "admin.forgot.password.coming.soon.description": "Admin password recovery functionality will be available soon.",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.back.home": "Back to Home",
    "common.featured": "Featured",
    "common.pieces": "pieces",
    "common.by": "by",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr") // Default to French

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"))
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

// Cart Context
interface CartItem {
  id: number
  name: string
  artist: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prev.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
