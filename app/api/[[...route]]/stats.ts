import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { tasks, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/db/operations";
import { HTTPException } from "hono/http-exception";

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  try {
    const user = await getCurrentUser(auth.userId);
    if (!user) {
      throw new HTTPException(404, {
        message: "User not found",
      });
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
    throw new HTTPException(500, {
      message: "Failed to fetch stats",
    });
  }
});

export default app;
