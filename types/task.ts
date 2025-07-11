import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);
export const categorySchema = z.enum(["coding", "life", "self-care"]);
export const themeSchema = z.enum(["light", "dark", "system"]);

export const taskSchema = z.object({
  id: z.string().cuid2(),
  userId: z.string().cuid2(),
  title: z.string().min(1),
  description: z.string().nullable(),
  completed: z.boolean().nullable(),
  priority: prioritySchema,
  category: categorySchema,
  dueDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime().nullable(),
});


export const createTaskInputSchema = taskSchema.pick({
  title: true,
  description: true,
  priority: true,
  category: true,
  dueDate: true,
})

export const updateTaskInputSchema = createTaskInputSchema.partial().extend({
  completed: z.boolean().nullable(),
});


// Types inférés
export type Task = z.infer<typeof taskSchema>;
export type TaskCategory = z.infer<typeof categorySchema>;
export type TaskPriority = z.infer<typeof prioritySchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

// Schémas pour les préférences utilisateur
export const userPreferencesInputSchema = z.object({
  theme: themeSchema.optional(),
  defaultCategory: categorySchema.optional(),
  notifications: z.boolean().optional(),
  motivationalMessages: z.boolean().optional(),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesInputSchema>;


