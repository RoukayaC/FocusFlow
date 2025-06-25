import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/drizzle";
import { userPreferences, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { userPreferencesInputSchema } from "@/types/task";
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
      const userPrefs = await database
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id))
        .limit(1);

      if (userPrefs.length === 0) {
        // Create default preferences
        const defaultPrefs = await database
          .insert(userPreferences)
          .values({
            id: createId(),
            userId: user.id,
            theme: "light",
            defaultCategory: "coding",
            notifications: true,
            motivationalMessages: true,
          })
          .returning();

        return c.json(defaultPrefs[0]);
      }

      return c.json(userPrefs[0]);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return c.json({ error: "Failed to fetch preferences" }, 500);
    }
  })
  .patch(
    "/",
    clerkMiddleware(),
    zValidator("json", userPreferencesInputSchema),
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
        const updatedPrefs = await database
          .update(userPreferences)
          .set({
            ...validatedData,
            updatedAt: new Date(),
          })
          .where(eq(userPreferences.userId, user.id))
          .returning();

        if (updatedPrefs.length === 0) {
          return c.json({ error: "Preferences not found" }, 404);
        }

        return c.json(updatedPrefs[0]);
      } catch (error) {
        console.error("Error updating preferences:", error);
        return c.json({ error: "Failed to update preferences" }, 500);
      }
    }
  );

export default app;