import { polar } from "@/lib/polar";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createCheckoutSchema } from "@/validators/polar";
import { CustomerPortal } from "@polar-sh/hono";
import { Webhooks } from "@polar-sh/hono";

const app = new Hono()
  .get("/products", async (c) => {
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
  })
  .post("/checkout", zValidator("json", createCheckoutSchema), async (c) => {
    const { products } = c.req.valid("json");

    const result = await polar.checkouts.create({
      products,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });
    return c.json(result.url, 201);
  })
  .get(
    "/portal",
    CustomerPortal({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      getCustomerId: async (c) => {
        const customerId = c.req.query("customerId");
        if (!customerId) {
          throw new HTTPException(400, {
            message: "Customer ID is required",
          });
        }
        return customerId;
      },
      server: "sandbox",
    })
  )
  .post(
    "/polar/webhooks",
    Webhooks({
      webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
      onPayload: async (payload) => {
        console.log("Received webhook payload:", payload);
      },
    })
  );

export default app;
