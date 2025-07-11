import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":id"]["$delete"]
>;

export const useDeleteTask = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.tasks[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  return mutation;
};
