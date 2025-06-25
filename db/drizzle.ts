import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create the postgres client with Edge Runtime compatible configuration
const client = postgres(databaseUrl, {
  prepare: false, // Required for Supabase
  ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
})

// Create the drizzle database instance and export it directly
export const db = drizzle(client, { schema })

// Export a function to test the connection (optional)
export async function testConnection() {
  try {
    const result = await client`SELECT 1 as test`
    console.log('Database connection successful:', result)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}