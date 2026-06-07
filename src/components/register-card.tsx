"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { XIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { api } from "../lib/api";
import { useState } from "react";
import { CustomOptions } from "../lib/api-response";
import UserModel from "../models/user";
import { toast } from "sonner";
import { useApp } from "../provider/app-provider";

function RegisterCard({
  className,
  ref,
  close,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  close?: () => void;
}) {
  const [firstName, setFirstName] = useState("test");
  const [lastName, setLastName] = useState("erdem");
  const [email, setEmail] = useState("test10@example.com");
  const [password, setPassword] = useState("12345aA!");
  const app = useApp();

  async function handleRegister() {
    try {
      app.setIsLoading(true);
      const username = `${firstName} ${lastName}`;

      const { data: apiResponse } = await api.post<
        CustomOptions<typeof UserModel>
      >("/auth/register", {
        username,
        email,
        password,
      });

      if (apiResponse.toString().startsWith("2")) {
        toast.success("Account created successfully! You can now log in.");
        close?.();
      } else {
        toast.error(
          apiResponse.message || "Failed to create account. Please try again.",
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
      <CardHeader className="bg-card">
        <Button
          variant="ghost"
          onMouseUp={close}
          className="absolute top-2 right-2 w-fit h-fit  cursor-pointer rounded-full p-1 opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <XIcon />
        </Button>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 bg-card">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleRegister}>
            Create an account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterCard;
