import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type ResponseType = User;
type RequestType = {
  email: string;
  name?: string;
};

export const useSyncUser = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ email, name }) => {
      const response = await client.api.users.sync.$post({
        json: {
          email,
          name,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error("Failed to sync user");
      }

      const data = await response.json();

      // Transform the data to ensure dates are Date objects
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    },
  });

  return mutation;
};
