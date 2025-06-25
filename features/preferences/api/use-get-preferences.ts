import { useQuery } from "@tanstack/react-query"

export interface UserPreferences {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  defaultCategory: 'coding' | 'life' | 'self-care'
  notifications: boolean
  motivationalMessages: boolean
  createdAt: Date
  updatedAt: Date
}

export const useGetPreferences = () => {
  const query = useQuery<UserPreferences, Error>({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await fetch("/api/preferences")

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch preferences")
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