"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { IUser } from "../models/user";
import { api } from "../lib/api";
import { CustomOptions } from "../lib/api-response";
import { IVtonJob } from "../models/vton-job";
import { toast } from "sonner";
import { useApp } from "./app-provider";

type GalleryProviderProps = {
  children: React.ReactNode;
};

type GalleryProviderState = {
  vJobs: IVtonJob[];
  setVJobs: React.Dispatch<React.SetStateAction<IVtonJob[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchVtonJobs: (showToaster?: boolean) => Promise<void>;
  deleteVtonJob: (jobId: string) => Promise<void>;
};

const GalleryProviderContext = createContext<GalleryProviderState | undefined>(
  undefined,
);

export function GalleryProvider({ children }: GalleryProviderProps) {
  const [vJobs, setVJobs] = useState<IVtonJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useApp();
  const limit = 5;

  async function fetchVtonJobs(showToaster = false) {
    try {
      setIsLoading(true);

      const userId = user?._id;
      if (!userId) return;

      const offset = vJobs.length;

      const { data: apiResponse } = await api.get<CustomOptions<IVtonJob[]>>(
        `/vton/get-job?userId=${userId}&offset=${offset}&limit=${limit}&status=completed`,
      );

      const isSuccess = apiResponse.status.toString().startsWith("2");

      if (!isSuccess) {
        toast.error(apiResponse.message || "Failed to fetch gallery.");
        return;
      }

      const newJobs = apiResponse.data || [];

      setVJobs((prev) => [...prev, ...newJobs]);

      if (showToaster) {
        toast.success("Gallery loaded successfully.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteVtonJob(jobId: string) {
    try {
      setIsLoading(true);
      const { data: apiResponse } = await api.delete<CustomOptions<IVtonJob>>(
        `/vton/delete-job?jobId=${jobId}`,
      );

      const isSuccess = apiResponse.status.toString().startsWith("2");
      if (!isSuccess) {
        toast.error(apiResponse.message || "Failed to delete the job.");
        return;
      }

      setVJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      toast.success("Job deleted successfully.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GalleryProviderContext.Provider
      value={{
        isLoading,
        setIsLoading,
        vJobs,
        setVJobs,
        fetchVtonJobs,
        deleteVtonJob,
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </GalleryProviderContext.Provider>
  );
}

export const useGallery = () => {
  const context = useContext(GalleryProviderContext);

  if (context === undefined) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }

  return context;
};
