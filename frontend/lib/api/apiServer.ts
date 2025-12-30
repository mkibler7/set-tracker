const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function apiServer<T>(path: string): Promise<T> {
  if (!BASE) {
    throw new Error("API URL not configured");
  }

  const normalized = BASE.replace(/\/$/, "");
  const res = await fetch(`${normalized}${path}`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}
