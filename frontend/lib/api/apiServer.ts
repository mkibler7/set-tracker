import { headers, cookies } from "next/headers";

export class ApiServerError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function getBaseUrl() {
  // Prefer explicit env when deployed
  const envBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (envBase) return envBase;

  // Derive from request headers (dev + reverse proxies)
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) throw new Error("Missing Host header");
  return `${proto}://${host}`;
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

export async function apiServer<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const baseUrl = await getBaseUrl();

  const reqCookies = await cookies();
  const cookieHeader = reqCookies.toString(); // includes at/rt

  const reqHeaders = new Headers(init?.headers);

  if (cookieHeader && !reqHeaders.has("cookie")) {
    reqHeaders.set("cookie", cookieHeader);
  }

  if (init?.body != null && !reqHeaders.has("Content-Type")) {
    reqHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: reqHeaders,
    cache: "no-store", // auth-dependent, do not cache
  });

  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    throw new ApiServerError(res.status, msg);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  return (isJson ? await res.json() : ((await res.text()) as any)) as T;
}
