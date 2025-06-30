"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

// Infer the response type from your Hono client
type ResponseType = InferResponseType<typeof client.api.polar.products.$get>;

/**
 * Hook to fetch all products from the API
 */
export const useGetProducts = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await client.api.polar.products.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return await response.json();
    },
  });
};
