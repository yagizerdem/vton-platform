import * as z from "zod";

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
export { registerSchema };
