"use client"

import { useState } from 'react'
import type { Task, TaskCategory, TaskPriority } from '@/types/task'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
  details?: any[]
}

interface CreateTaskData {
  title: string
  description?: string
  priority: TaskPriority
  category: TaskCategory
  dueDate?: string
}

interface UpdateTaskData {
  title?: string
  description?: string
  completed?: boolean
  priority?: TaskPriority
  category?: TaskCategory
  dueDate?: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  preferences: Record<string, any>
  createdAt: string
}

interface UserStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  tasksByCategory: {
    coding: number
    life: number
    'self-care': number
  }
  tasksByPriority: {
    high: number
    medium: number
    low: number
  }
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Base API call function
  const apiCall = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user', // Replace with real user ID from auth
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Task API methods
  const tasks = {
    // Get all tasks
    getAll: async (): Promise<ApiResponse<Task[]>> => {
      return apiCall<Task[]>('/tasks')
    },

    // Get specific task
    getById: async (id: string): Promise<ApiResponse<Task>> => {
      return apiCall<Task>(`/tasks/${id}`)
    },

    // Create new task
    create: async (taskData: CreateTaskData): Promise<ApiResponse<Task>> => {
      return apiCall<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      })
    },

    // Update task
    update: async (id: string, updates: UpdateTaskData): Promise<ApiResponse<Task>> => {
      return apiCall<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    },

    // Delete task
    delete: async (id: string): Promise<ApiResponse<Task>> => {
      return apiCall<Task>(`/tasks/${id}`, {
        method: 'DELETE',
      })
    },

    // Bulk create tasks
    bulkCreate: async (tasks: CreateTaskData[]): Promise<ApiResponse<Task[]>> => {
      return apiCall<Task[]>('/tasks/bulk', {
        method: 'POST',
        body: JSON.stringify({ tasks }),
      })
    },

    // Toggle task completion
    toggle: async (id: string, completed: boolean): Promise<ApiResponse<Task>> => {
      return apiCall<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed }),
      })
    }
  }

  // User API methods
  const user = {
    // Get user profile
    getProfile: async (): Promise<ApiResponse<UserProfile>> => {
      return apiCall<UserProfile>('/user/profile')
    },

    // Update user profile
    updateProfile: async (updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
      return apiCall<UserProfile>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    },

    // Get user statistics
    getStats: async (): Promise<ApiResponse<UserStats>> => {
      return apiCall<UserStats>('/user/stats')
    }
  }

  // General API methods
  const general = {
    // Health check
    health: async (): Promise<ApiResponse<{ status: string; message: string; timestamp: string }>> => {
      return apiCall('/health')
    },

    // Get global stats
    getStats: async (): Promise<ApiResponse<any>> => {
      return apiCall('/stats')
    }
  }

  return {
    isLoading,
    error,
    clearError: () => setError(null),
    tasks,
    user,
    general,
    // Direct API call method for custom endpoints
    call: apiCall
  }
}

// Specialized hook for tasks with automatic error handling
export function useTasksApi() {
  const api = useApi()
  const [tasks, setTasks] = useState<Task[]>([])

  const refreshTasks = async () => {
    const response = await api.tasks.getAll()
    if (response.success && response.data) {
      setTasks(response.data)
    }
  }

  const addTask = async (taskData: CreateTaskData) => {
    const response = await api.tasks.create(taskData)
    if (response.success) {
      await refreshTasks()
    }
    return response
  }

  const updateTask = async (id: string, updates: UpdateTaskData) => {
    const response = await api.tasks.update(id, updates)
    if (response.success) {
      await refreshTasks()
    }
    return response
  }

  const deleteTask = async (id: string) => {
    const response = await api.tasks.delete(id)
    if (response.success) {
      await refreshTasks()
    }
    return response
  }

  const toggleTask = async (id: string, completed: boolean) => {
    const response = await api.tasks.toggle(id, completed)
    if (response.success) {
      await refreshTasks()
    }
    return response
  }

  return {
    tasks,
    isLoading: api.isLoading,
    error: api.error,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearError: api.clearError
  }
}