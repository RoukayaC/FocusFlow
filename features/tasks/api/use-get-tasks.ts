import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.tasks.$get>;

export const useGetTasks = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await client.api.tasks.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return await response.json();
    },
  });
};
