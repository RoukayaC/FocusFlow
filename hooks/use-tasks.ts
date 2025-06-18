// hooks/use-tasks.ts
"use client"

import { useState, useEffect } from "react"
import { useUser } from '@clerk/nextjs'
import type { Task, TaskCategory } from "@/types/task"
import { createTask, getTasks, updateTask, deleteTask, toggleTask } from "@/actions/tasks"
import { useToast } from "@/hooks/use-toast"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn } = useUser()
  const { toast } = useToast()

  // Load tasks from Supabase
  const loadTasks = async () => {
    if (!isSignedIn) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const result = await getTasks()
      
      if (result.success && result.data) {
        setTasks(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to load tasks')
        toast({
          title: "Error loading tasks",
          description: result.error || 'Failed to load tasks',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks'
      setError(errorMessage)
      toast({
        title: "Error loading tasks",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load tasks when component mounts or user signs in
  useEffect(() => {
    loadTasks()
  }, [isSignedIn])

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      const result = await createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate
      })

      if (result.success) {
        // Reload tasks to get the latest data
        await loadTasks()
        toast({
          title: "Task created",
          description: "Your task has been created successfully."
        })
      } else {
        setError(result.error || 'Failed to create task')
        toast({
          title: "Error creating task",
          description: result.error || 'Failed to create task',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      setError(errorMessage)
      toast({
        title: "Error creating task",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const updateTaskById = async (id: string, updates: Partial<Task>) => {
    try {
      const result = await updateTask(id, {
        title: updates.title,
        description: updates.description,
        completed: updates.completed,
        priority: updates.priority,
        category: updates.category,
        dueDate: updates.dueDate
      })

      if (result.success) {
        // Update local state immediately for better UX
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ))
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully."
        })
      } else {
        setError(result.error || 'Failed to update task')
        toast({
          title: "Error updating task",
          description: result.error || 'Failed to update task',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task'
      setError(errorMessage)
      toast({
        title: "Error updating task",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const deleteTaskById = async (id: string) => {
    try {
      const result = await deleteTask(id)

      if (result.success) {
        // Update local state immediately
        setTasks(prev => prev.filter(task => task.id !== id))
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully."
        })
      } else {
        setError(result.error || 'Failed to delete task')
        toast({
          title: "Error deleting task",
          description: result.error || 'Failed to delete task',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task'
      setError(errorMessage)
      toast({
        title: "Error deleting task",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const toggleTaskById = async (id: string) => {
    try {
      // Optimistically update the UI
      const currentTask = tasks.find(task => task.id === id)
      if (currentTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        ))
      }

      const result = await toggleTask(id)

      if (!result.success) {
        // Revert the optimistic update
        if (currentTask) {
          setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, completed: currentTask.completed } : task
          ))
        }
        
        setError(result.error || 'Failed to toggle task')
        toast({
          title: "Error updating task",
          description: result.error || 'Failed to toggle task',
          variant: "destructive"
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task'
      setError(errorMessage)
      toast({
        title: "Error updating task",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const getTasksByCategory = (category: TaskCategory) => {
    return tasks.filter((task) => task.category === category)
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date() > new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate() + 1)
    ).length

    return { total, completed, pending, overdue }
  }

  const clearError = () => setError(null)

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask: updateTaskById,
    deleteTask: deleteTaskById,
    toggleTask: toggleTaskById,
    getTasksByCategory,
    getTaskStats,
    clearError,
    refreshTasks: loadTasks
  }
}