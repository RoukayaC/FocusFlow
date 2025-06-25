// types/task.ts
import { z } from 'zod'

// Import des schémas Zod depuis votre schema.ts
export const prioritySchema = z.enum(['low', 'medium', 'high'])
export const categorySchema = z.enum(['coding', 'life', 'self-care'])
export const themeSchema = z.enum(['light', 'dark', 'system'])

// Schémas pour les formulaires et API
export const createTaskInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: prioritySchema.default('medium'),
  category: categorySchema,
  dueDate: z.string().datetime().optional().or(z.date().optional()),
})

export const updateTaskInputSchema = createTaskInputSchema.partial().extend({
  completed: z.boolean().optional(),
})

// Schéma complet pour les tâches
export const taskSchema = z.object({
  id: z.string().cuid2(),
  userId: z.string().cuid2(),
  title: z.string().min(1),
  description: z.string().nullable(),
  completed: z.boolean(),
  priority: prioritySchema,
  category: categorySchema,
  dueDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Types inférés
export type Task = z.infer<typeof taskSchema>
export type TaskCategory = z.infer<typeof categorySchema>
export type TaskPriority = z.infer<typeof prioritySchema>
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>

// Schémas pour les préférences utilisateur
export const userPreferencesInputSchema = z.object({
  theme: themeSchema.optional(),
  defaultCategory: categorySchema.optional(),
  notifications: z.boolean().optional(),
  motivationalMessages: z.boolean().optional(),
})

export type UserPreferencesInput = z.infer<typeof userPreferencesInputSchema>