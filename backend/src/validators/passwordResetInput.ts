import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20), // your token will be longer than this
  password: z.string().min(8, "Password must be at least 8 characters"),
});
