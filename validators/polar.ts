import { z } from "zod";

export const createCheckoutSchema = z.object({
  products: z.array(z.string().min(1, "Product ID is required")),
});

export type CreateCheckoutBody = z.infer<typeof createCheckoutSchema>;