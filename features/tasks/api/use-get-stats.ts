import { useQuery } from "@tanstack/react-query"

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
}

export const useGetStats = () => {
  const query = useQuery<TaskStats, Error>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats")

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch stats")
      }

      return response.json()
    },
  })

  return query
}