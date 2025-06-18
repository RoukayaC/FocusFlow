import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role key
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Types for your database tables
export interface DatabaseUser {
  id: string
  clerk_id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface DatabaseTask {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'coding' | 'life' | 'self-care'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface DatabaseUserPreferences {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
  default_category: 'coding' | 'life' | 'self-care'
  notifications: boolean
  motivational_messages: boolean
  created_at: string
  updated_at: string
}