import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(60, "Display name is too long")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});
