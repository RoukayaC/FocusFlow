import { useQuery } from "@tanstack/react-query"
import type { Task } from "@/types/task"

export const useGetTask = (id?: string) => {
  const query = useQuery<Task, Error>({
    enabled: !!id,
    queryKey: ["task", { id }],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${id}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch task")
      }

      const data = await response.json()
      
      // Transform the data to ensure dates are Date objects
      return {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }
    },
  })

  return query
}