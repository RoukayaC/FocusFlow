import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

// Create the postgres client
const client = postgres(process.env.DATABASE_URL, {
  prepare: false, // Required for Supabase
})

// Create the drizzle database instance
const db = drizzle(client, { schema })

async function main() {
  try {
    console.log('Connected to database successfully!')
    
    // Example: Query all users
    const allUsers = await db.select().from(schema.users)
    console.log('Users:', allUsers)
    
    // Add your application logic here
    
  } catch (error) {
    console.error('Database error:', error)
  } finally {
    // Close the connection when done
    await client.end()
  }
}

main().catch(console.error)