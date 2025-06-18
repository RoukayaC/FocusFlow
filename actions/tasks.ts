// actions/tasks.ts
'use server'

import { createServerClient } from '@/lib/supabase'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createId } from '@paralleldrive/cuid2'
import type { Task } from '@/types/task'

interface CreateTaskData {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  category: 'coding' | 'life' | 'self-care'
  dueDate?: Date
}

interface UpdateTaskData {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: 'coding' | 'life' | 'self-care'
  dueDate?: Date
}

// Get user from database or create if doesn't exist
async function ensureUserExists(clerkId: string, email: string, name?: string) {
  const supabase = createServerClient()
  
  // Check if user exists
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (existingUser) {
    return existingUser
  }

  // If user doesn't exist, create new user with manual ID generation
  const userId = createId()
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      id: userId, // Manually generate ID
      clerk_id: clerkId,
      email,
      name
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw new Error(`Failed to create user: ${error.message}`)
  }

  return newUser
}

export async function createTask(taskData: CreateTaskData) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      throw new Error('Not authenticated')
    }

    // Get current user from Clerk
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new Error('User not found')
    }

    const supabase = createServerClient()
    
    // Ensure user exists in our database
    const user = await ensureUserExists(
      clerkId,
      clerkUser.emailAddresses[0]?.emailAddress || '',
      clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}` 
        : clerkUser.firstName || 'User'
    )

    // Generate task ID manually
    const taskId = createId()
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id: taskId, // Manually generate ID
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        category: taskData.category,
        due_date: taskData.dueDate?.toISOString(),
        completed: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      throw new Error(`Failed to create task: ${error.message}`)
    }

    revalidatePath('/dashboard')
    return { success: true, data }
  } catch (error) {
    console.error('Error creating task:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create task' 
    }
  }
}

export async function getTasks(): Promise<{ success: boolean; data?: Task[]; error?: string }> {
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
      return { success: true, data: [] }
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    // Transform data to match your Task interface
    const tasks: Task[] = data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      createdAt: new Date(task.created_at),
      dueDate: task.due_date ? new Date(task.due_date) : undefined
    }))

    return { success: true, data: tasks }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch tasks' 
    }
  }
}

export async function updateTask(taskId: string, updates: UpdateTaskData) {
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
      throw new Error('User not found')
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.completed !== undefined) updateData.completed = updates.completed
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString()

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`)
    }

    revalidatePath('/dashboard')
    return { success: true, data }
  } catch (error) {
    console.error('Error updating task:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update task' 
    }
  }
}

export async function deleteTask(taskId: string) {
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
      throw new Error('User not found')
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete task' 
    }
  }
}

export async function toggleTask(taskId: string) {
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
      throw new Error('User not found')
    }

    // First get the current task to toggle its completion status
    const { data: currentTask } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single()

    if (!currentTask) {
      throw new Error('Task not found')
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        completed: !currentTask.completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to toggle task: ${error.message}`)
    }

    revalidatePath('/dashboard')
    return { success: true, data }
  } catch (error) {
    console.error('Error toggling task:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to toggle task' 
    }
  }
}