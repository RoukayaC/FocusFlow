import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.tasks.$get>;

export const useGetTask = (id?: string) => {
  return useQuery<ResponseType, Error>({
    queryKey: ["task", { id }],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        params: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      return await response.json();
    },
  });
};
