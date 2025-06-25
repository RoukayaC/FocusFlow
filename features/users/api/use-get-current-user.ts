import { useQuery } from "@tanstack/react-query"
import type { User } from "./use-sync-user"

export const useGetCurrentUser = () => {
  const query = useQuery<User, Error>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch("/api/users/me")

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch current user")
      }

      const data = await response.json()
      
      // Transform the data to ensure dates are Date objects
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }
    },
  })

  return query
}