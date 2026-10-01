import type { Response } from "express";
import mongoose from "mongoose";
import type { ZodError } from "zod";

/**
 * Send an error response without leaking internals.
 * - Errors carrying a 4xx `status` (thrown by validators/services) keep their message.
 * - Mongoose validation/cast errors are client input problems -> 400.
 * - Anything else is logged server-side and returned as a generic 500.
 */
export function sendError(res: Response, err: unknown) {
  const status = (err as { status?: unknown } | null)?.status;

  if (typeof status === "number" && status >= 400 && status < 500) {
    const message = err instanceof Error ? err.message : "Request failed";
    return res.status(status).json({ message });
  }

  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({ message: err.message });
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({ message: "Internal server error" });
}

/** First Zod issue as a short, user-facing message (instead of the raw issues JSON). */
export function zodMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Invalid input";
}
