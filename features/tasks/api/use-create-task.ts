import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CreateTaskInput, Task } from "@/types/task"

type ResponseType = Task
type RequestType = CreateTaskInput

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create task")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success("Task created successfully!")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task")
    },
  })

  return mutation
}