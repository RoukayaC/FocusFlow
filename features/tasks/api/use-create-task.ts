import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTaskInput, Task } from "@/types/task";
import { client } from "@/lib/hono";

type ResponseType = Task;
type RequestType = CreateTaskInput;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.tasks.$post({
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
      }

      const data = await response.json();

      return {
        ...data,
        priority: data.priority ?? "low", 
        completed: data.completed ?? false,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        description: data.description ?? null,
      };
    },
    onSuccess: (data) => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  return mutation;
};
