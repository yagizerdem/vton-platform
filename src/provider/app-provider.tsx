"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { IUser } from "../models/user";
import { api } from "../lib/api";
import { CustomOptions } from "../lib/api-response";

type AppProviderProps = {
  children: React.ReactNode;
};

type AppProviderState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  initApp: boolean;
  setInitApp: (initApp: boolean) => void;
};

const AppProviderContext = createContext<AppProviderState | undefined>(
  undefined,
);

export function AppProvider({ children }: AppProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initApp, setInitApp] = useState(false);

  useEffect(() => {
    async function tryFetchMe() {
      try {
        const { data: apiResponse } =
          await api.get<CustomOptions<IUser>>("/auth/me");

        setUser({
          email: apiResponse.data?.email || "",
          username: apiResponse.data?.username || "",
          _id: apiResponse.data?._id || "",
          password: "",
        });

        const isSuccess = apiResponse.status.toString().startsWith("2");

        if (isSuccess) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } finally {
        setInitApp(true);
      }
    }

    tryFetchMe();
  }, []);

  return (
    <AppProviderContext.Provider
      value={{
        isLoading,
        setIsLoading,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        initApp,
        setInitApp,
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </AppProviderContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppProviderContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};
