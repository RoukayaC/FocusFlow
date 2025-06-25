import { useQuery } from "@tanstack/react-query"
import type { Task } from "@/types/task"

export const useGetTasks = () => {
  const query = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks")

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch tasks")
      }

      const data = await response.json()
      
      // Transform the data to ensure dates are Date objects
      return data.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }))
    },
  })

  return query
}