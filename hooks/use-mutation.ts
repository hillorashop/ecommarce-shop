import { toast } from "sonner";
import {
  useMutation,
  useQueryClient,
  MutationKey,
  QueryKey,
} from "@tanstack/react-query";

interface MutationResponse {
  message?: string;
  [key: string]: any;
}

export const useCustomMutation = <
  TData extends MutationResponse = any,
  TVariables = unknown
>(
  mutationKey: MutationKey,
  mutationFn: (data: TVariables) => Promise<TData>,
  queryKeys: QueryKey[] | QueryKey,
  onSuccess?: (data: TData) => void
) => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, data, error } = useMutation({
    mutationKey,
    mutationFn,

    onSuccess: (data: any) => {
      const isFailed =
        data?.success === false ||
        (typeof data?.status === "number" && data.status >= 400) ||
        (data?.error && data.error !== "");

      if (isFailed) {
        const isSecurityBlock =
          data?.error === "ORDER_BLOCKED" ||
          data?.errorCode === "ORDER_BLOCKED" ||
          data?.error === "ORDER_FRAUD_DETECTED" ||
          Boolean(data?.blockedType);

        if (!isSecurityBlock) {
          toast.error(data?.message || data?.error || "Operation failed");
        }

        onSuccess?.(data);
        return;
      }

      const keys = Array.isArray(queryKeys[0])
        ? (queryKeys as QueryKey[])
        : [queryKeys as QueryKey];

      keys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: key,
          exact: false,
        });
      });

      onSuccess?.(data);

      toast.success(data?.message || "Operation completed successfully");
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    },
  });

  return {
    mutate,
    mutateAsync,
    isPending,
    data,
    error,
  };
};

