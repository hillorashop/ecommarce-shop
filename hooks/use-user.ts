"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser, User, userInput, updateUser } from "@/actions/user";
import { useUser as useUserContext } from "@/contexts/UserContext";
import { useCustomMutation } from "./use-custom-query";
import { ONE_DAY } from "@/data";
import { jwtDecode } from "jwt-decode";

// React Query fetch user
export function useUserQuery(token?: string) {
  return useQuery<User, Error>({
    queryKey: ["user", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");
      const res = await getUser(token);
      if (!res.success || !res.user) throw new Error("Failed to fetch user");
      return res.user;
    },
    initialData: token ? (() => {
      try {
        const decoded = jwtDecode<Partial<User>>(token);
        return decoded as User;
      } catch {
        return undefined;
      }
    })() : undefined,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!token,
  });
}

// React Query mutation for updating user
export const useUpdateUser = () => {
  const { setUser } = useUserContext();

  return useCustomMutation(
    ["updateUser"],
    (data: userInput) => updateUser(data),
    ["user"],
    (data) => {
      if (data?.user) setUser(data.user); // update context immediately
    }
  );
};
