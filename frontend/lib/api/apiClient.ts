import { useAuthStore } from "@/store/authStore";

const BASE = ""; // FORCE same-origin. Never call :5000 from the browser.

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildUrl(path: string) {
  return BASE ? `${BASE}${path}` : path;
}

async function parseErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  try {
    if (isJson) {
      const body = await res.json();
      return body?.message || `HTTP ${res.status}`;
    }
    const text = await res.text();
    return text || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function doFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers);

  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    return fetch(url, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(0, "Network error. Please check your connection.");
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await doFetch("/api/auth/refresh", { method: "POST" });
      return res.ok;
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
  if (res.status === 401 && !isAuthRoute) {
    const refreshed = await refreshSession();

    if (!refreshed) {
      useAuthStore.getState().clear();
      const message = await parseErrorMessage(res);
      throw new ApiError(401, message || "Unauthorized");
    }

    res = await doFetch(path, init);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new ApiError(res.status, message);
  }

  return (isJson ? await res.json() : ((await res.text()) as any)) as T;
}
