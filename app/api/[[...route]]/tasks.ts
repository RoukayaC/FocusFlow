import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { getCurrentUser } from "@/db/operations";
import { db } from "@/db/drizzle";
import { tasks, users } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { createTaskInputSchema, updateTaskInputSchema } from "@/types/task";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const user = await getCurrentUser(auth.userId);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      const database = db;
      const userTasks = await database
        .select()
        .from(tasks)
        .where(eq(tasks.userId, user.id))
        .orderBy(desc(tasks.createdAt));

      return c.json(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return c.json({ error: "Failed to fetch tasks" }, 500);
    }
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", createTaskInputSchema),
    async (c) => {
      const auth = getAuth(c);
      const validatedData = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const user = await getCurrentUser(auth.userId);
        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const database = db;
        const newTasks = await database
          .insert(tasks)
          .values({
            id: createId(),
            userId: user.id,
            title: validatedData.title,
            description: validatedData.description || null,
            priority: validatedData.priority,
            category: validatedData.category,
            dueDate: validatedData.dueDate
              ? new Date(validatedData.dueDate)
              : null,
            completed: false,
          })
          .returning();

        return c.json(newTasks[0], 201);
      } catch (error) {
        console.error("Error creating task:", error);
        return c.json({ error: "Failed to create task" }, 400);
      }
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const user = await getCurrentUser(auth.userId);
        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const database = db;
        const [task] = await database
          .select()
          .from(tasks)
          .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
          .limit(1);

        if (!task) {
          return c.json({ error: "Task not found" }, 404);
        }

        return c.json(task);
      } catch (error) {
        console.error("Error fetching task:", error);
        return c.json({ error: "Failed to fetch task" }, 500);
      }
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator("json", updateTaskInputSchema),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const validatedData = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const user = await getCurrentUser(auth.userId);
        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const updateData: any = {
          ...validatedData,
          updatedAt: new Date(),
        };

        if (validatedData.dueDate !== undefined) {
          updateData.dueDate = validatedData.dueDate
            ? new Date(validatedData.dueDate)
            : null;
        }

        const database = db;
        const [updatedTask] = await database
          .update(tasks)
          .set(updateData)
          .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
          .returning();

        if (!updatedTask) {
          return c.json({ error: "Task not found" }, 404);
        }

        return c.json(updatedTask);
      } catch (error) {
        console.error("Error updating task:", error);
        return c.json({ error: "Failed to update task" }, 400);
      }
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const user = await getCurrentUser(auth.userId);
        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const database = db;
        const [deletedTask] = await database
          .delete(tasks)
          .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
          .returning();

        if (!deletedTask) {
          return c.json({ error: "Task not found" }, 404);
        }

        return c.json({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("Error deleting task:", error);
        return c.json({ error: "Failed to delete task" }, 500);
      }
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { ids } = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const user = await getCurrentUser(auth.userId);
        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const database = db;
        const deletedTasks = await database
          .delete(tasks)
          .where(and(inArray(tasks.id, ids), eq(tasks.userId, user.id)))
          .returning();

        return c.json({
          message: "Tasks deleted successfully",
          deletedCount: deletedTasks.length,
        });
      } catch (error) {
        console.error("Error bulk deleting tasks:", error);
        return c.json({ error: "Failed to delete tasks" }, 500);
      }
    }
  );

export default app;