import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ResponseType = {
  message: string;
  deletedCount: number;
};

type RequestType = {
  ids: string[];
};

export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ ids }) => {
      const response = await client.api.tasks["bulk-delete"].$post({
        json: { ids },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error("Failed to delete tasks");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`${data.deletedCount} tasks deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete tasks");
    },
  });

  return mutation;
};
