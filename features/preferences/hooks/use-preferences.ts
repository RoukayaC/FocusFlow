import { useUser } from '@clerk/nextjs'
import type { UserPreferencesInput } from '@/types/task'
import { useGetPreferences, type UserPreferences } from '../api/use-get-preferences'
import { useEditPreferences } from '../api/use-edit-preferences'

const defaultPreferences: Partial<UserPreferences> = {
  theme: 'light',
  defaultCategory: 'coding',
  notifications: true,
  motivationalMessages: true,
}

export function usePreferences() {
  const { user } = useUser()
  
  // API hooks
  const preferencesQuery = useGetPreferences()
  const editPreferencesMutation = useEditPreferences()

  // Update user preferences
  const updatePreferences = editPreferencesMutation.mutate

  // Update a single preference field
  const updatePreference = async <T extends keyof UserPreferencesInput>(
    key: T, 
    value: UserPreferencesInput[T]
  ): Promise<void> => {
    updatePreferences({ [key]: value } as UserPreferencesInput)
  }

  // Reset preferences to default
  const resetPreferences = async (): Promise<void> => {
    updatePreferences(defaultPreferences)
  }

  // Get a specific preference value with fallback
  const getPreference = <T extends keyof UserPreferences>(
    key: T, 
    fallback?: UserPreferences[T]
  ): UserPreferences[T] | undefined => {
    const preferences = preferencesQuery.data
    if (!preferences) {
      return fallback || defaultPreferences[key]
    }
    return preferences[key] ?? fallback ?? defaultPreferences[key]
  }

  return {
    preferences: preferencesQuery.data,
    isLoading: preferencesQuery.isLoading,
    isUpdating: editPreferencesMutation.isPending,
    error: preferencesQuery.error?.message || editPreferencesMutation.error?.message,
    
    updatePreferences,
    updatePreference,
    resetPreferences,
    getPreference,
    refetch: preferencesQuery.refetch,
  }
}