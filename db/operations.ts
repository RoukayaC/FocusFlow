import { eq } from "drizzle-orm";
import { users } from "./schema";
import { db } from "./drizzle";

// Helper function to get current user from database
export async function getCurrentUser(clerkUserId: string) {
  const database = db;
  const existingUsers = await database
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);

  return existingUsers[0] || null;
}
