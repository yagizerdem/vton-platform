"use client";

import { createContext, useContext } from "react";
import { ThemeProvider } from "./theme-provider";
import { AppProvider } from "./app-provider";
import { GalleryProvider } from "./gallery-provider";

type BaseProviderProps = {
  children: React.ReactNode;
};

type BaseProviderState = {};

const initialState: BaseProviderState = {};

const BaseProviderContext = createContext<BaseProviderState>(initialState);

export function BaseProvider({ children }: BaseProviderProps) {
  return (
    <BaseProviderContext.Provider value={{}}>
      <AppProvider>
        <GalleryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </GalleryProvider>
      </AppProvider>
    </BaseProviderContext.Provider>
  );
}

export const useBase = () => {
  const context = useContext(BaseProviderContext);

  if (context === undefined) {
    throw new Error("useBase must be used within a BaseProvider");
  }

  return context;
};
