import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const PUBLIC_PREFIXES = ["/_next", "/favicon.ico"];

// The backend sits behind Cloudflare, so it cannot see who the user is.
// Pass the real client IP along with a shared secret that proves the request
// came through this app (see backend/src/utils/clientIp.ts).
function forwardToBackend(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.delete("x-client-ip");
  headers.delete("x-proxy-secret");

  const secret = process.env.PROXY_SHARED_SECRET;
  const clientIp =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (secret && clientIp) {
    headers.set("x-client-ip", clientIp);
    headers.set("x-proxy-secret", secret);
  }

  return NextResponse.next({ request: { headers } });
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Never guard/protect API proxy routes
  if (pathname.startsWith("/api")) {
    return forwardToBackend(req);
  }

  // Uptime checks have no session; let them reach the backend health endpoint
  if (pathname === "/health") {
    return NextResponse.next();
  }

  // Allow Next internals/static
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const hasAccessCookie = Boolean(req.cookies.get("at")?.value);
  const hasRefreshCookie = Boolean(req.cookies.get("rt")?.value);

  if (hasAccessCookie || hasRefreshCookie) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  // url.searchParams.set("reason", "expired");
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
