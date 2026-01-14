import { useAuthStore } from "@/store/authStore";

const BASE = ""; // FORCE same-origin. Never call :5000 from the browser.

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

function buildUrl(path: string) {
  return BASE ? `${BASE}${path}` : path;
}

async function parseErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  try {
    if (isJson) {
      const body = await res.json().catch(() => null);
      return body?.message || `HTTP ${res.status}`;
    }
    const text = await res.text().catch(() => "");
    return text || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

// Friendly messaging rules (standardized)
function toFriendlyMessage(status: number, raw: string) {
  if (status === 0) return "Network error. Please check your connection.";
  if (status === 401)
    return raw || "Your session expired. Please log in again.";
  if (status === 403) return raw || "You don't have access to that resource.";
  if (status >= 500)
    return "We're having trouble on our end. Please try again shortly.";
  return raw || `Request failed (HTTP ${status}).`;
}

async function doFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers);

  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    // IMPORTANT: await so offline errors get caught
    const res = await fetch(url, {
      ...init,
      headers,
      credentials: "include",
    });
    return res;
  } catch {
    throw new ApiError(0, "Network error. Please check your connection.");
  }
}

let refreshInFlight: Promise<boolean> | null = null;

// Prevent redirect loops when multiple requests fail at once
let redirectingToLogin = false;

function forceLogoutAndRedirect(reason: string) {
  if (redirectingToLogin) return;
  redirectingToLogin = true;

  // Clear client auth state immediately
  useAuthStore.getState().clear();

  // Hard redirect guarantees middleware + app state reset
  if (typeof window !== "undefined") {
    const next = window.location.pathname + window.location.search;
    window.location.href =
      `/login?reason=${encodeURIComponent(reason)}` +
      `&next=${encodeURIComponent(next)}`;
  }
}

let refreshPermanentlyFailed = false;

async function refreshSession(): Promise<boolean> {
  if (refreshPermanentlyFailed) return false;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await doFetch("/api/auth/refresh", { method: "POST" });

      if (!res.ok) {
        if (res.status === 401) refreshPermanentlyFailed = true;
        return false;
      }

      return true;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export async function apiClient<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  let res = await doFetch(path, init);

  const isAuthRoute = path.startsWith("/api/auth/");

  // Handle 401 with refresh (only once, only for non-auth routes)
  if (res.status === 401 && !isAuthRoute) {
    const refreshed = await refreshSession();

    if (!refreshed) {
      const raw = await parseErrorMessage(res);
      forceLogoutAndRedirect("expired");
      throw new ApiError(401, toFriendlyMessage(401, raw));
    }

    // Retry once after refresh
    res = await doFetch(path, init);

    // Still 401 after refresh -> force logout + redirect
    if (res.status === 401) {
      const raw = await parseErrorMessage(res);
      forceLogoutAndRedirect("expired");
      throw new ApiError(401, toFriendlyMessage(401, raw));
    }
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const raw = await parseErrorMessage(res);
    throw new ApiError(res.status, toFriendlyMessage(res.status, raw));
  }

  return (isJson ? await res.json() : ((await res.text()) as any)) as T;
}
