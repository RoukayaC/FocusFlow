import { Hono } from "hono";
import { handle } from "hono/vercel";

import tasks from "./tasks";
import preferences from "./preferences";
import stats from "./stats";
import users from "./users";

const app = new Hono().basePath("/api");

const routes = app
  .route("/tasks", tasks)
  .route("/preferences", preferences)
  .route("/stats", stats)
  .route("/users", users);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
