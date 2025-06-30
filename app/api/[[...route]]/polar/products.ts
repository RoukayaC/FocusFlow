import { polar } from "@/lib/polar";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
const app = new Hono().get("/", async (c) => {
  const products = await polar.products.list({
    organizationId: process.env.POLAR_ORGANIZATION_ID!,
    limit: 100,
  });

  if (!products || products.result.items.length === 0) {
    throw new HTTPException(404, {
      message: "No products found",
    });
  }
  return c.json(products.result.items, 200);
});

export default app;
