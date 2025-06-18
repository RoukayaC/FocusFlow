// hooks/use-user-preferences.ts
"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getUserPreferences, updateUserPreferences } from '@/actions/users'
import { useToast } from '@/hooks/use-toast'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  name: string
  defaultCategory: 'coding' | 'life' | 'self-care'
  notifications: boolean
  motivationalMessages: boolean
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    name: '',
    defaultCategory: 'coding',
    notifications: true,
    motivationalMessages: true
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isSignedIn } = useUser()
  const { toast } = useToast()

  // Load preferences from Supabase
  const loadPreferences = async () => {
    if (!isSignedIn || !user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const result = await getUserPreferences()
      
      if (result.success) {
        if (result.data) {
          // Map database fields to component state
          setPreferences({
            theme: result.data.theme || 'light',
            name: user.firstName || user.fullName || '',
            defaultCategory: result.data.default_category || 'coding',
            notifications: result.data.notifications ?? true,
            motivationalMessages: result.data.motivational_messages ?? true
          })
        } else {
          // No preferences found, use defaults with user name from Clerk
          setPreferences(prev => ({
            ...prev,
            name: user.firstName || user.fullName || ''
          }))
        }
        setError(null)
      } else {
        setError(result.error || 'Failed to load preferences')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load preferences'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Load preferences when component mounts or user signs in
  useEffect(() => {
    loadPreferences()
  }, [isSignedIn, user])

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    try {
      // Update local state immediately for better UX
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }))

      // Map component fields to database fields
      const dbUpdates: any = {}
      
      switch (key) {
        case 'theme':
          dbUpdates.theme = value
          break
        case 'defaultCategory':
          dbUpdates.defaultCategory = value
          break
        case 'notifications':
          dbUpdates.notifications = value
          break
        case 'motivationalMessages':
          dbUpdates.motivationalMessages = value
          break
        case 'name':
          // Name is stored in Clerk, not in our preferences table
          // You might want to update Clerk user data here if needed
          return
      }

      const result = await updateUserPreferences(dbUpdates)

      if (!result.success) {
        // Revert local state if update failed
        setPreferences(prev => ({
          ...prev,
          [key]: prev[key] // revert to previous value
        }))
        
        setError(result.error || 'Failed to update preferences')
        toast({
          title: "Error updating preferences",
          description: result.error || 'Failed to update preferences',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences'
      setError(errorMessage)
      toast({
        title: "Error updating preferences",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const setPreferencesAll = async (newPreferences: Partial<UserPreferences>) => {
    try {
      // Update local state
      setPreferences(prev => ({
        ...prev,
        ...newPreferences
      }))

      // Map to database fields
      const dbUpdates: any = {}
      if (newPreferences.theme) dbUpdates.theme = newPreferences.theme
      if (newPreferences.defaultCategory) dbUpdates.defaultCategory = newPreferences.defaultCategory
      if (newPreferences.notifications !== undefined) dbUpdates.notifications = newPreferences.notifications
      if (newPreferences.motivationalMessages !== undefined) dbUpdates.motivationalMessages = newPreferences.motivationalMessages

      const result = await updateUserPreferences(dbUpdates)

      if (result.success) {
        toast({
          title: "Preferences updated",
          description: "Your preferences have been saved successfully."
        })
      } else {
        setError(result.error || 'Failed to update preferences')
        toast({
          title: "Error updating preferences",
          description: result.error || 'Failed to update preferences',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences'
      setError(errorMessage)
      toast({
        title: "Error updating preferences",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  return {
    preferences,
    setPreferences: setPreferencesAll,
    updatePreference,
    isLoading,
    error,
    refreshPreferences: loadPreferences
  }
}