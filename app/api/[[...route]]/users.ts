import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const syncUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
});

const app = new Hono()
  .post(
    "/sync",
    clerkMiddleware(),
    zValidator("json", syncUserSchema),
    async (c) => {
      const auth = getAuth(c);
      const { email, name } = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const database = db;
        const existingUsers = await database
          .select()
          .from(users)
          .where(eq(users.clerkId, auth.userId))
          .limit(1);

        if (existingUsers.length > 0) {
          // User exists, update if needed
          const user = existingUsers[0];
          if (user.email !== email || user.name !== name) {
            const [updatedUser] = await database
              .update(users)
              .set({
                email,
                name: name || null,
                updatedAt: new Date(),
              })
              .where(eq(users.id, user.id))
              .returning();

            return c.json(updatedUser);
          }

          return c.json(user);
        }

        // Create new user
        const [newUser] = await database
          .insert(users)
          .values({
            id: createId(),
            clerkId: auth.userId,
            email,
            name: name || null,
          })
          .returning();

        return c.json(newUser, 201);
      } catch (error) {
        console.error("Error syncing user:", error);
        return c.json({ error: "Failed to sync user" }, 500);
      }
    }
  )
  .get("/me", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const database = db;
      const [user] = await database
        .select()
        .from(users)
        .where(eq(users.clerkId, auth.userId))
        .limit(1);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  });

export default app;