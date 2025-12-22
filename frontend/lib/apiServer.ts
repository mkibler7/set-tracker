const BASE = process.env.API_URL || "http://localhost:5000/api";

if (!BASE) throw new Error("API_URL is not set");

export async function apiServer<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
