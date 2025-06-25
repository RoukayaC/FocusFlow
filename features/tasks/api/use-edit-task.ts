import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { UpdateTaskInput, Task } from "@/types/task"

type ResponseType = Task
type RequestType = {
  id: string
  data: UpdateTaskInput
}

export const useEditTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update task")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success("Task updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      queryClient.invalidateQueries({ queryKey: ["task", data.id] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task")
    },
  })

  return mutation
}