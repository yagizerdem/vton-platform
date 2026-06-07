"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useApp } from "../provider/app-provider";
import { toast } from "sonner";
import { CustomOptions } from "../lib/api-response";
import { api } from "../lib/api";

function AddApiKeyCard({
  className,
  ref,
  close,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  close?: () => void;
}) {
  const [key, setKey] = useState<string | undefined>(undefined);

  const app = useApp();

  async function handleAddApiKey() {
    try {
      app.setIsLoading(true);
      if (!key) {
        return toast.error("Please enter a valid API key.");
      }

      const { data: apiResponse } = await api.post<CustomOptions<null>>(
        "/vton/add-api-key",
        {
          fashnApiKey: key,
        },
      );

      if (apiResponse.status.toString().startsWith("2")) {
        toast.success("API key added successfully!");
        close?.();
      } else {
        toast.error(
          apiResponse.message || "Failed to add API key. Please try again.",
        );
      }
    } finally {
      app.setIsLoading(false);
    }
  }

  return (
    <Card
      ref={ref}
      className={twMerge("mx-auto max-w-sm bg-card p-4", className)}
    >
      <CardHeader>
        <Button
          variant="ghost"
          onMouseUp={close}
          className="absolute top-2 right-2 w-fit h-fit  cursor-pointer rounded-full p-1 opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <XIcon />
        </Button>
        <CardTitle className="text-2xl">Add API Key</CardTitle>
        <CardDescription>
          Enter your API key below to add it to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleAddApiKey}>
            Add API Key
          </Button>
          <span>
            Don't have an API key? Get one from{" "}
            <a
              href="https://app.fashn.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700"
            >
              Fashn AI
            </a>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddApiKeyCard;
