"use client";

import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.polar.checkout.$post>;

export const useCreateCheckout = () => {
  return useMutation<void, Error, string>({
    mutationKey: ["create-checkout"],
    mutationFn: async (productId: string) => {
      const response = await client.api.polar.checkout.$post({
        json: { products : [ productId ] },
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      if (data) {
        window.location.href = data;
      }
    },
  });
};
