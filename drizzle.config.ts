import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./db/schema.ts", 
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;