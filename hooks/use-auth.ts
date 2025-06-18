"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Simple auth state management
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  // Check auth state on mount
  useEffect(() => {
    const authState = localStorage.getItem('focusflow-auth')
    const userData = localStorage.getItem('focusflow-user')
    
    if (authState === 'authenticated' && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    
    setIsLoading(false)
  }, [])

  // Login function (for demo purposes)
  const login = (userData: { name: string; email: string }) => {
    localStorage.setItem('focusflow-auth', 'authenticated')
    localStorage.setItem('focusflow-user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    router.push('/dashboard')
  }

  // Logout function
  const logout = () => {
    // Clear all app data
    const keysToRemove = [
      'focusflow-auth',
      'focusflow-user',
      'daily-planner-tasks',
      'user-preferences',
      ...Object.keys(localStorage).filter(key => key.startsWith('form-'))
    ]

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })

    // Update state
    setIsAuthenticated(false)
    setUser(null)

    // Redirect to welcome page
    router.push('/')
  }

  // Quick login (for demo - creates a default user)
  const quickLogin = () => {
    const defaultUser = {
      name: localStorage.getItem('user-preferences') 
        ? JSON.parse(localStorage.getItem('user-preferences') || '{}').name || 'Beautiful'
        : 'Beautiful',
      email: 'demo@focusflow.app'
    }
    login(defaultUser)
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    quickLogin
  }
}