import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.preferences.$get>;

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  defaultCategory: 'coding' | 'life' | 'self-care';
  notifications: boolean;
  motivationalMessages: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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