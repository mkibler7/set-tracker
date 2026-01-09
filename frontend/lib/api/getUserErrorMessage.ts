import { ApiError, isApiError } from "@/lib/api/apiClient";

export function getUserErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.message;
  if (err instanceof Error) return err.message || "Something went wrong.";
  return "Something went wrong.";
}

export function getUserErrorTitle(err: unknown): string {
  if (isApiError(err)) {
    if (err.status === 0) return "You appear to be offline";
    if (err.status === 401) return "Session expired";
    if (err.status === 403) return "Access denied";
    if (err.status >= 500) return "Server error";
  }
  return "Error";
}
