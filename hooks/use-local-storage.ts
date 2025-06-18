"use client"

import { useState, useEffect } from 'react'

// Generic localStorage hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean, string | null] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get value from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedItem = JSON.parse(item)
        setStoredValue(parsedItem)
      }
      setError(null)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      setError(`Failed to load ${key} from storage`)
    } finally {
      setIsLoading(false)
    }
  }, [key])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
      
      setError(null)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
      setError(`Failed to save ${key} to storage`)
    }
  }

  return [storedValue, setValue, isLoading, error]
}

// Specialized hook for user preferences
export function useUserPreferences() {
  interface UserPreferences {
    theme: 'light' | 'dark' | 'system'
    name: string
    defaultCategory: 'coding' | 'life' | 'self-care'
    notifications: boolean
    motivationalMessages: boolean
  }

  const defaultPreferences: UserPreferences = {
    theme: 'light',
    name: '',
    defaultCategory: 'coding',
    notifications: true,
    motivationalMessages: true
  }

  const [preferences, setPreferences, isLoading, error] = useLocalStorage('user-preferences', defaultPreferences)

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return {
    preferences,
    setPreferences,
    updatePreference,
    isLoading,
    error
  }
}

// Hook for form data persistence
export function useFormPersistence<T extends Record<string, any>>(
  formKey: string,
  initialValues: T
) {
  const [formData, setFormData, isLoading, error] = useLocalStorage(`form-${formKey}`, initialValues)

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData(initialValues)
  }

  const clearForm = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`form-${formKey}`)
    }
    setFormData(initialValues)
  }

  return {
    formData,
    updateField,
    resetForm,
    clearForm,
    isLoading,
    error
  }
}