const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

if (!BASE) throw new Error("API base URL is not defined");

export async function apiClient<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message ?? `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}
