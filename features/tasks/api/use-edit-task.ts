import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":id"]["$patch"]
>["json"];

export const useEditTask = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.tasks[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["task", { id }] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  return mutation;
};
