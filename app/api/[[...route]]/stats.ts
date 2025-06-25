import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { tasks, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/db/operations";

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
      const allTasks = await database
        .select()
        .from(tasks)
        .where(eq(tasks.userId, user.id));

      const total = allTasks.length;
      const completed = allTasks.filter((task) => task.completed).length;
      const pending = total - completed;
      const overdue = allTasks.filter(
        (task) =>
          task.dueDate && !task.completed && new Date() > new Date(task.dueDate)
      ).length;

      return c.json({
        total,
        completed,
        pending,
        overdue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      return c.json({ error: "Failed to fetch stats" }, 500);
    }
  });

export default app;