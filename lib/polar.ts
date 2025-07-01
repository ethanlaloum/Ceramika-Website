import { Polar } from '@polar-sh/sdk'

console.log('Configuration Polar:', {
  hasToken: !!process.env.POLAR_ACCESS_TOKEN,
  tokenLength: process.env.POLAR_ACCESS_TOKEN?.length,
  server: 'production'
})

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? '',
  server: 'production' // Mode production
})

export default polar