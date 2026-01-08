// const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

// export async function apiServer<T>(path: string): Promise<T> {
//   if (!BASE) {
//     throw new Error("API URL not configured");
//   }

//   const normalized = BASE.replace(/\/$/, "");
//   const res = await fetch(`${normalized}${path}`, { cache: "no-store" });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || `HTTP ${res.status}`);
//   }

//   return (await res.json()) as T;
// }
import { cookies } from "next/headers";

type ApiServerInit = RequestInit & {
  baseUrl?: string;
};

export async function apiServer<T>(
  path: string,
  init: ApiServerInit = {}
): Promise<T> {
  const baseUrl =
    init.baseUrl ??
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:5000";

  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  // Forward cookies from the incoming request to backend
  const cookieHeader = cookies().toString();

  const res = await fetch(url, {
    ...init,
    // Prevent cross-user caching issues in Server Components
    cache: "no-store",
    headers: {
      ...(init.headers ?? {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`apiServer ${res.status} ${res.statusText}: ${text}`);
  }

  return res.json() as Promise<T>;
}
