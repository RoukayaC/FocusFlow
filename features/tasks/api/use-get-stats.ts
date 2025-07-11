import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.stats.$get>;

export const useGetStats = () => {
  return useQuery<ResponseType, Error>({
    initialData: {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
    },
    staleTime: 0,
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await client.api.stats.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return await response.json();
    },
  });
};
