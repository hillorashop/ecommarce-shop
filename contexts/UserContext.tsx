"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/actions/user";
import { useUserQuery } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
 refreshUser: (token: string) => Promise<void>;
interface UserContextType {
  user: User | null;
  loaded: boolean;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
   refreshUser: (token: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // React Query fetch
const { data: fetchedUser } = useUserQuery(token!);

  // Merge decoded token immediately + backend user later
  useEffect(() => {
    if (!token) {
      setLoaded(true);
      setUser(null);
      return;
    }

    let decoded: Partial<User> | null = null;
    try {
      decoded = jwtDecode<Partial<User>>(token);
      // show decoded token immediately
      setUser(decoded as User);
      setLoaded(true);
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
      setLoaded(true);
      return;
    }
  }, [token]);

  // Merge backend user once fetched
  useEffect(() => {
    if (fetchedUser) {
      setUser(prev => ({ ...prev, ...fetchedUser }));
    }
  }, [fetchedUser]);


    const refreshUser = async (newToken: string) => {
    localStorage.setItem("auth_token", newToken);
    const { data } = await useUserQuery(newToken).refetch();
    if (data) setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);

    queryClient.removeQueries({ queryKey: ["user"], exact: false });
  };

  return (
    <UserContext.Provider value={{ user, loaded, logout, setUser , refreshUser}}>
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
