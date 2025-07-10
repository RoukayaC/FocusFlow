"use client";

import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.tasks.$get>;

export const useGetStats = () => {
  useQuery<ResponseType, Error>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await client.api.tasks.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return await response.json();
    },
  });
};
