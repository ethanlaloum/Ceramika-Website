/**
 * Validation stricte des variables d'environnement pour la production
 * Ce fichier s'assure que toutes les variables critiques sont présentes
 */

interface EnvironmentConfig {
  // Base de données
  DATABASE_URL: string
  
  // Authentification
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  
  // Stripe (CRITIQUE pour les paiements)
  STRIPE_SECRET_KEY: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  
  // Email
  RESEND_API_KEY: string
  
  // Application
  NEXT_PUBLIC_URL: string
}

/**
 * Valide que toutes les variables d'environnement requises sont présentes
 */
function validateEnvironment(): EnvironmentConfig {
  const config: Partial<EnvironmentConfig> = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  }

  const missingVars: string[] = []

  // Vérification de chaque variable
  Object.entries(config).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missingVars.push(key)
    }
  })

  // Validations spécifiques pour Stripe (critique)
  if (config.STRIPE_SECRET_KEY) {
    const isLiveMode = config.STRIPE_SECRET_KEY.startsWith('sk_live_')
    const isTestMode = config.STRIPE_SECRET_KEY.startsWith('sk_test_')
    
    if (!isLiveMode && !isTestMode) {
      missingVars.push('STRIPE_SECRET_KEY (format invalide)')
    }
  }

  if (config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    const isLiveMode = config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')
    const isTestMode = config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')
    
    if (!isLiveMode && !isTestMode) {
      missingVars.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (format invalide)')
    }
  }

  if (config.STRIPE_WEBHOOK_SECRET && !config.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    missingVars.push('STRIPE_WEBHOOK_SECRET (format invalide)')
  }

  // Vérifier la cohérence entre les clés Stripe (live vs test)
  if (config.STRIPE_SECRET_KEY && config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    const secretIsLive = config.STRIPE_SECRET_KEY.startsWith('sk_live_')
    const publicIsLive = config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')
    
    if (secretIsLive !== publicIsLive) {
      missingVars.push('STRIPE_KEYS (incohérence live/test entre clé secrète et publique)')
    }
  }

  if (missingVars.length > 0) {
    const error = `❌ Variables d'environnement manquantes ou invalides:
${missingVars.map(v => `  - ${v}`).join('\n')}

📋 Action requise:
1. Vérifiez votre fichier .env
2. Assurez-vous que toutes les clés Stripe sont correctes
3. En production, utilisez les clés 'live', en développement utilisez les clés 'test'
`
    throw new Error(error)
  }

  return config as EnvironmentConfig
}

// Validation au chargement du module
let envConfig: EnvironmentConfig

try {
  envConfig = validateEnvironment()
  
  // Log du mode actuel
  const isProduction = envConfig.STRIPE_SECRET_KEY.startsWith('sk_live_')
  console.log(`🔧 Configuration chargée: ${isProduction ? '🔴 PRODUCTION' : '🟡 TEST'}`)
  
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Erreur de configuration'
  console.error(errorMessage)
  process.exit(1)
}

export default envConfig
