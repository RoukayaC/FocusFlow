import { Polar } from '@polar-sh/sdk'

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.POLAR_SERVER === 'production' ? 'production' : 'sandbox',
})

export const POLAR_ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID!

