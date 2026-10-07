import type { NextFunction, Request, Response } from "express";

// TEMPORARY diagnostic: logs which client-IP headers survive the
// browser -> Vercel rewrite -> Cloudflare -> Render chain, so the
// rate limiters can be keyed on the real client IP. Enabled only when
// LOG_IP_HEADERS=true. Remove once the rate-limit IP fix ships.

// Only proxy/IP headers — never cookies or authorization.
const IP_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "x-vercel-forwarded-for",
  "x-vercel-proxied-for",
  "x-vercel-ip-country",
  "cf-connecting-ip",
  "cf-ipcountry",
  "cf-ray",
  "true-client-ip",
  "forwarded",
  "via",
  "x-forwarded-host",
  "x-forwarded-proto",
  "rndr-id",
];

export function logIpHeaders(req: Request, _res: Response, next: NextFunction) {
  if (process.env.LOG_IP_HEADERS !== "true" || req.path === "/health") {
    return next();
  }

  const headers: Record<string, string | string[] | undefined> = {};
  for (const name of IP_HEADERS) {
    if (req.headers[name] !== undefined) headers[name] = req.headers[name];
  }

  console.log(
    `IP_HEADERS [${(req as any).requestId}] ${req.method} ${req.path}`,
    JSON.stringify({
      reqIp: req.ip,
      reqIps: req.ips,
      socket: req.socket.remoteAddress,
      headers,
    }),
  );
  next();
}
