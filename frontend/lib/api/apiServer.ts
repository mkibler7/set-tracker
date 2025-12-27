const BASE =
  process.env.API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : null);

export async function apiServer<T>(path: string): Promise<T> {
  if (!BASE) throw new Error("API_URL is not set");

  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
