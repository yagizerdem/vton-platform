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
import { CustomOptions } from "../lib/api-response";
import { api } from "../lib/api";
import { IUser } from "../models/user";
import { toast } from "sonner";
import { useApp } from "../provider/app-provider";

function LoginCard({
  className,
  ref,
  close,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  close?: () => void;
}) {
  const [email, setEmail] = useState("test10@example.com");
  const [password, setPassword] = useState("12345aA!");

  const app = useApp();

  async function handleLogin() {
    try {
      app.setIsLoading(true);
      const { data: apiResponse } = await api.post<CustomOptions<IUser>>(
        "/auth/login",
        {
          email,
          password,
        },
      );

      app.setUser({
        email: apiResponse.data?.email || "",
        username: apiResponse.data?.username || "",
        _id: apiResponse.data?._id || "",
        password: "",
      });

      const isSuccess = apiResponse.status.toString().startsWith("2");

      if (isSuccess) {
        app.setIsLoggedIn(true);
        toast.success("Logged in successfully!");
        close?.();
      } else {
        toast.error(
          apiResponse.message || "Failed to login. Please try again.",
        );
        close?.();
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
        <CardTitle className="text-2xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your details below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
