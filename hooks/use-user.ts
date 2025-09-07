"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser, updateUser, User, userInput } from "@/actions/user";
import { useUser } from "@/contexts/UserContext";
import { useCustomMutation } from "./use-custom-query";
import { ONE_DAY } from "@/data";

export function useUserQuery(token?: string) {
  return useQuery<User, Error>({
    queryKey: ["user", token],
    queryFn: async () => {
      const response = await getUser(token);
      if (!response.success || !response.user) {
        throw new Error("Failed to fetch user");
      }
      return response.user;
    },
    staleTime: ONE_DAY,
    gcTime:ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!token, // only run if token exists
  });
}

export const useUpdateUser = () => {
  const { setUser } = useUser();

  return useCustomMutation(
    ["updateUser"],       // mutation key
    (data: userInput) => updateUser(data), // mutation function
    ["user"],             // query key to invalidate (so user refetches)
    (data) => {
      if (data?.user) setUser(data.user); // update context automatically
    }
  );
}