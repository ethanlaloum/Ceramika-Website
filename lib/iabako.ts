/**
 * Client API Iabako - Gestion de l'authentification et des appels API
 * Documentation: https://iabako.readme.io/reference/start
 */

const IABAKO_API_URL = 'https://api.iabako.com'

interface IabakoTokens {
  access_token: string
  refresh_token: string
  expires_at: number // timestamp ms
}

let cachedTokens: IabakoTokens | null = null

function getCredentials(): { username: string; password: string } {
  const username = process.env.IABAKO_USERNAME
  const password = process.env.IABAKO_PASSWORD

  if (!username || !password) {
    throw new Error('Variables d\'environnement IABAKO_USERNAME et IABAKO_PASSWORD requises')
  }

  return { username, password }
}

/**
 * Obtient un access_token via Basic Auth (username:password)
 */
async function authenticate(): Promise<IabakoTokens> {
  const { username, password } = getCredentials()
  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64')

  const response = await fetch(`${IABAKO_API_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': `Basic ${basicAuth}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Iabako authentication failed: ${response.status}`)
  }

  const data = await response.json()

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    // Le token expire dans 5 min, on renouvelle 30s avant
    expires_at: Date.now() + 4.5 * 60 * 1000,
  }
}

/**
 * Retourne un access_token valide (avec cache et renouvellement automatique)
 */
async function getAccessToken(): Promise<string> {
  if (cachedTokens && cachedTokens.expires_at > Date.now()) {
    return cachedTokens.access_token
  }

  cachedTokens = await authenticate()
  return cachedTokens.access_token
}

/**
 * Effectue un appel authentifié à l'API Iabako
 */
export async function iabakoFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken()

  const response = await fetch(`${IABAKO_API_URL}${path}`, {
    ...options,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  // Si 403, le token a peut-être expiré, on réessaie une fois
  if (response.status === 403) {
    cachedTokens = null
    const newToken = await getAccessToken()

    return fetch(`${IABAKO_API_URL}${path}`, {
      ...options,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${newToken}`,
        ...options.headers,
      },
    })
  }

  return response
}
