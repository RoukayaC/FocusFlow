// actions/users.ts
'use server'

import { createServerClient } from '@/lib/supabase'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createId } from '@paralleldrive/cuid2'

interface UserPreferencesData {
  theme?: 'light' | 'dark' | 'system'
  defaultCategory?: 'coding' | 'life' | 'self-care'
  notifications?: boolean
  motivationalMessages?: boolean
}

export async function getUserPreferences() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      throw new Error('Not authenticated')
    }

    const supabase = createServerClient()

    // Get user from database
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      return { success: true, data: null }
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch preferences: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch preferences' 
    }
  }
}

export async function updateUserPreferences(preferences: UserPreferencesData) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      throw new Error('Not authenticated')
    }

    const supabase = createServerClient()

    // Get current user from Clerk
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new Error('User not found')
    }
    
    // Ensure user exists in our database
    let { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      // Create user if doesn't exist with manual ID generation
      const userId = createId()
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          id: userId, // Manually generate ID
          clerk_id: clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || 'User'
        })
        .select('id')
        .single()

      if (userError) {
        throw new Error(`Failed to create user: ${userError.message}`)
      }

      user = newUser
    }

    // Check if preferences exist
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const updateData = {
      user_id: user.id,
      ...preferences,
      updated_at: new Date().toISOString()
    }

    let data, error

    if (existingPrefs) {
      // Update existing preferences
      ({ data, error } = await supabase
        .from('user_preferences')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single())
    } else {
      // Create new preferences with manual ID generation
      const prefsId = createId()
      ({ data, error } = await supabase
        .from('user_preferences')
        .insert({
          id: prefsId, // Manually generate ID
          ...updateData
        })
        .select()
        .single())
    }

    if (error) {
      throw new Error(`Failed to update preferences: ${error.message}`)
    }

    revalidatePath('/dashboard')
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update preferences' 
    }
  }
}

export async function getUserProfile() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      throw new Error('Not authenticated')
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user profile' 
    }
  }
}

export async function updateUserProfile(updates: { name?: string; email?: string }) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      throw new Error('Not authenticated')
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', clerkId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    revalidatePath('/dashboard')
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    }
  }
}