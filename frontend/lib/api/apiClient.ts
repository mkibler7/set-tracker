const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""; // "" means same-origin

export async function apiClient<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = BASE ? `${BASE}${path}` : path;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const message = isJson ? (await res.json())?.message : await res.text();
    throw new Error(message || `HTTP ${res.status}`);
  }

  return (isJson ? await res.json() : ((await res.text()) as any)) as T;
}
