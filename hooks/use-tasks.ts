"use client"

import { useState, useEffect } from "react"
import type { Task, TaskCategory } from "@/types/task"

const STORAGE_KEY = "daily-planner-tasks"

// Default tasks for demo
const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Complete React tutorial",
    description: "Finish the advanced React hooks tutorial",
    completed: false,
    priority: "high",
    category: "coding",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Fix navbar bug",
    description: "The mobile navigation menu is not closing properly",
    completed: true,
    priority: "medium",
    category: "coding",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Grocery shopping",
    description: "Buy ingredients for this week's meals",
    completed: false,
    priority: "medium",
    category: "life",
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Morning meditation",
    description: "10 minutes of mindfulness meditation",
    completed: true,
    priority: "high",
    category: "self-care",
    createdAt: new Date(),
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedTasks = JSON.parse(stored).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }))
        setTasks(parsedTasks)
      } else {
        setTasks(defaultTasks)
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
      setTasks(defaultTasks)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const getTasksByCategory = (category: TaskCategory) => {
    return tasks.filter((task) => task.category === category)
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed

    return { total, completed, pending }
  }

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksByCategory,
    getTaskStats,
  }
}
