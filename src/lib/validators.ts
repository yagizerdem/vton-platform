import * as z from "zod";
import { ZodSchema } from "zod";
import { AppError } from "@/src/lib/app-error";
import HttpStatusCode from "@/src/lib/http-status-code";

const passwordRegexp = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6}$/;

const registerSchema = z.object({
  username: z
    .string("Username is required")
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      passwordRegexp,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      passwordRegexp,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

function validateBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new AppError({
      message: result.error.issues[0]?.message ?? "Validation failed",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  return result.data;
}

export { registerSchema, loginSchema, validateBody };
