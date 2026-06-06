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

function LoginCard({
  className,
  ref,
  close,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  close?: () => void;
}) {
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
