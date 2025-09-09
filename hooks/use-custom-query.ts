
import { ONE_DAY } from "@/data";
import { queryClient } from "@/provider/queryClient-provider";

import { useQuery, QueryFunction, QueryKey, UseQueryResult, UseQueryOptions,   useMutation, MutationKey} from "@tanstack/react-query"; 
import { toast } from "sonner";

type MutateFunction = (variables: any) => Promise<any>;

 
export const useCustomQuery = <
  TQueryFnData = unknown,
  TError = Error
>(
  queryKey: QueryKey,
  queryFunction: QueryFunction<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TQueryFnData, QueryKey>,
    "queryKey" | "queryFn"
  > & { initialData?: TQueryFnData }
): UseQueryResult<TQueryFnData, TError> => {
  return useQuery<TQueryFnData, TError>({
    queryKey,
    queryFn: queryFunction,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options, // now you can safely override staleTime
  });
}




export const useCustomMutation = (
  mutationKey: MutationKey,
  mutationFn: MutateFunction,
  queryKey: QueryKey, // the query root to invalidate
  onSuccess?: (data: any) => void
) => {
  const { mutate, isPending, data, error } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (data: any) => {
      // ✅ invalidate all queries starting with this key
      queryClient.invalidateQueries({ queryKey, exact: false });

      if (onSuccess) {
        onSuccess(data);
      }

      toast.success(data?.message || "Success");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      toast.error(errorMessage);
    },
  });

  return { mutate, isPending, data, error };
};


