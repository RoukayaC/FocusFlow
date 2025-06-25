import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.preferences.$patch>;
type RequestType = InferRequestType<
  typeof client.api.preferences.$patch
>["json"];

export const useEditPreferences = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.preferences.$patch({
        json: data,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
    onError: () => {
      toast.error("Failed to update preferences");
    },
  });

  return mutation;
};
