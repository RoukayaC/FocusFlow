import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Define enums for better type safety
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])
export const categoryEnum = pgEnum('category', ['coding', 'life', 'self-care'])
export const themeEnum = pgEnum('theme', ['light', 'dark', 'system'])

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false),
  priority: priorityEnum('priority').default('medium'),
  category: categoryEnum('category').notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const userPreferences = pgTable('user_preferences', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  theme: themeEnum('theme').default('light'),
  defaultCategory: categoryEnum('default_category').default('coding'),
  notifications: boolean('notifications').default(true),
  motivationalMessages: boolean('motivational_messages').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// Type exports for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type UserPreferences = typeof userPreferences.$inferSelect
export type NewUserPreferences = typeof userPreferences.$inferInsert