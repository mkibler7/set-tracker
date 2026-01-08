import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];
const PUBLIC_PREFIXES = ["/_next", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // never guard/protect API proxy routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow Next internals/static
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Cookie-based auth gate: access-token cookie must exist
  const hasAccessCookie = Boolean(req.cookies.get("at")?.value);

  if (!hasAccessCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
