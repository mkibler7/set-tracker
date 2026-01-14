import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];
const PUBLIC_PREFIXES = ["/_next", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Never guard/protect API proxy routes
  if (pathname.startsWith("/api")) {
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
