import * as z from "zod";
import { ZodSchema } from "zod";
import { AppError } from "@/src/lib/app-error";
import HttpStatusCode from "@/src/lib/http-status-code";
import crypto from "crypto";

const algorithm = "aes-256-gcm";

const passwordRegexp = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$/;

const registerSchema = z.object({
  username: z
    .string("username is required")
    .trim()
    .min(3, "username must be at least 3 characters")
    .max(30, "username must be at most 30 characters"),

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string("password is required")
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 characters")
    .regex(
      passwordRegexp,
      "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string("password is required")
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 characters")
    .regex(
      passwordRegexp,
      "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

const addApiKeySchema = z.object({
  fashnApiKey: z
    .string("Fashn API Key is required")
    .trim()
    .min(1, "Fashn API Key is required"),
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

function getKey() {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET;

  if (!secret) {
    throw new Error("API_KEY_ENCRYPTION_SECRET is missing");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

function encryptText(plainText: string) {
  const iv = crypto.randomBytes(12);
  const key = getKey();

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedText: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

function decryptText(encryptedText: string, iv: string, authTag: string) {
  const key = getKey();

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export {
  registerSchema,
  loginSchema,
  addApiKeySchema,
  validateBody,
  encryptText,
  decryptText,
};
