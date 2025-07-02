import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

// Define enums for better type safety
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const categoryEnum = pgEnum("category", ["coding", "life", "self-care"]);
export const themeEnum = pgEnum("theme", ["light", "dark", "system"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  priority: priorityEnum("priority").default("medium"),
  category: categoryEnum("category").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: themeEnum("theme").default("light"),
  defaultCategory: categoryEnum("default_category").default("coding"),
  notifications: boolean("notifications").default(true),
  motivationalMessages: boolean("motivational_messages").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Zod schemas for validation
export const prioritySchema = z.enum(["low", "medium", "high"]);
export const categorySchema = z.enum(["coding", "life", "self-care"]);
export const themeSchema = z.enum(["light", "dark", "system"]);

// User schemas
export const userSchema = z.object({
  id: z.string().cuid2(),
  clerkId: z.string().min(1),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const newUserSchema = z.object({
  id: z.string().cuid2().optional(),
  clerkId: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Task schemas
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
});

export const newTaskSchema = z.object({
  id: z.string().cuid2().optional(),
  userId: z.string().cuid2(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  priority: prioritySchema.default("medium"),
  category: categorySchema,
  dueDate: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User preferences schemas
export const userPreferencesSchema = z.object({
  id: z.string().cuid2(),
  userId: z.string().cuid2(),
  theme: themeSchema,
  defaultCategory: categorySchema,
  notifications: z.boolean(),
  motivationalMessages: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const newUserPreferencesSchema = z.object({
  id: z.string().cuid2().optional(),
  userId: z.string().cuid2(),
  theme: themeSchema.default("light"),
  defaultCategory: categorySchema.default("coding"),
  notifications: z.boolean().default(true),
  motivationalMessages: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Update schemas (for partial updates)
export const updateTaskSchema = newTaskSchema.partial().omit({ userId: true });
export const updateUserPreferencesSchema = newUserPreferencesSchema
  .partial()
  .omit({ userId: true });

// API input schemas (for forms/API endpoints)
export const createTaskInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  priority: prioritySchema.default("medium"),
  category: categorySchema,
  dueDate: z.string().datetime().optional().or(z.date().optional()),
});

export const updateTaskInputSchema = createTaskInputSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const updateUserPreferencesInputSchema = z.object({
  theme: themeSchema.optional(),
  defaultCategory: categorySchema.optional(),
  notifications: z.boolean().optional(),
  motivationalMessages: z.boolean().optional(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

// Zod inferred types
export type UserType = z.infer<typeof userSchema>;
export type NewUserType = z.infer<typeof newUserSchema>;
export type TaskType = z.infer<typeof taskSchema>;
export type NewTaskType = z.infer<typeof newTaskSchema>;
export type UserPreferencesType = z.infer<typeof userPreferencesSchema>;
export type NewUserPreferencesType = z.infer<typeof newUserPreferencesSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type UpdateUserPreferencesInput = z.infer<
  typeof updateUserPreferencesInputSchema
>;
