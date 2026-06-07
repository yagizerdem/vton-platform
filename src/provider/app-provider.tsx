"use client";

import { createContext, useContext, useState } from "react";
import { ThemeProvider } from "./theme-provider";

type AppProviderProps = {
  children: React.ReactNode;
};

type AppProviderState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const AppProviderContext = createContext<AppProviderState | undefined>(
  undefined,
);

export function AppProvider({ children }: AppProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppProviderContext.Provider value={{ isLoading, setIsLoading }}>
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
