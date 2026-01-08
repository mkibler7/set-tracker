import { ApiError } from "@/lib/api/apiClient";

export default function ApiErrorBanner({ error }: { error: unknown }) {
  if (!error) return null;

  const err = error as any;
  const message =
    err?.status === 0
      ? "Network error. Please check your connection."
      : err?.message || "Something went wrong.";

  return (
    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
      {message}
    </div>
  );
}
