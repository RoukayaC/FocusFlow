import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType, InferRequestType } from "hono";

type ResponseType = InferResponseType<typeof client.api.preferences.$get>;
type RequestType = InferRequestType<typeof client.api.preferences.$get>;

export const useGetPreferences = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await client.api.preferences.$get();
      
      if (!response.ok) {
        throw new Error("Failed to fetch preferences");
      }
      
      return await response.json();
    },
  });

  return query;
};