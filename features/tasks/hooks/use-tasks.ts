import { useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import type { TaskCategory } from '@/types/task'

// Import the new API hooks
import { useGetTasks } from '../api/use-get-tasks'
import { useCreateTask } from '../api/use-create-task'
import { useEditTask } from '../api/use-edit-task'
import { useDeleteTask } from '../api/use-delete-task'
import { useBulkDeleteTasks } from '../api/use-bulk-delete-tasks'
import { useGetStats } from '../api/use-get-stats'

export function useTasks() {
  const { user } = useUser()
  
  // API hooks
  const tasksQuery = useGetTasks()
  const createTaskMutation = useCreateTask()
  const editTaskMutation = useEditTask()
  const deleteTaskMutation = useDeleteTask()
  const bulkDeleteMutation = useBulkDeleteTasks()
  const statsQuery = useGetStats()

  // Memoized tasks data
  const tasks = useMemo(() => tasksQuery.data || [], [tasksQuery.data])

  // Helper functions
  const getTasksByCategory = (category: TaskCategory) => {
    return tasks.filter(task => task.category === category)
  }

  const getStats = () => {
    return statsQuery.data || { total: 0, completed: 0, pending: 0, overdue: 0 }
  }

  // Mutation functions
  const createTask = createTaskMutation.mutate
  const updateTask = (id: string, data: any) => editTaskMutation.mutate({ id, data })
  const deleteTask = (id: string) => deleteTaskMutation.mutate({ id })
  const bulkDeleteTasks = (ids: string[]) => bulkDeleteMutation.mutate({ ids })

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    updateTask(taskId, { completed: !task.completed })
  }

  return {
    // Data
    tasks,
    
    // Loading states
    isLoading: tasksQuery.isLoading,
    isCreating: createTaskMutation.isPending,
    isUpdating: editTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending || bulkDeleteMutation.isPending,
    
    // Error states
    error: tasksQuery.error?.message || 
           createTaskMutation.error?.message || 
           editTaskMutation.error?.message || 
           deleteTaskMutation.error?.message ||
           bulkDeleteMutation.error?.message,
    
    // Actions
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    bulkDeleteTasks,
    
    // Helpers
    getTasksByCategory,
    getStats,
    
    // Refetch
    refetch: tasksQuery.refetch,
  }
}