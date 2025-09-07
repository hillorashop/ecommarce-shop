"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getUser, User, UserResponse } from "@/actions/user";
import { useUserQuery } from "@/hooks/use-user";

// allow partial token-based data
type PartialUser = Partial<User>;

interface UserContextType {
  user: User | PartialUser | null;
  loaded: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | PartialUser | null>>;
  logout: () => void;
  refreshUser: (newToken: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // Decode token for immediate data (can be partial)
  const [user, setUser] = useState<User | PartialUser | null>(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload as PartialUser;
    } catch {
      return null;
    }
  });

  const [loaded, setLoaded] = useState(true);

  // Fetch backend user and merge with token data
  const { data: fetchedUser } = useUserQuery(token || undefined);

  useEffect(() => {
    if (fetchedUser) {
      setUser(prev => ({ ...(prev ?? {}), ...fetchedUser }));
    }
  }, [fetchedUser]);

  // Refresh user manually
  const refreshUser = async (newToken: string) => {
    localStorage.setItem("auth_token", newToken);

    try {
      const response: UserResponse = await getUser(newToken);
      if (response.success && response.user) {
        setUser(prev => ({ ...(prev ?? {}), ...response.user }));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }

    queryClient.setQueryData(["user", newToken], () =>
      getUser(newToken).then(res => res.user!)
    );
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    queryClient.removeQueries({ queryKey: ["user"], exact: false });
  };

  return (
    <UserContext.Provider value={{ user, loaded, setUser, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
