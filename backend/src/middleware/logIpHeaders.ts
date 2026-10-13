import net from "node:net";
import type { NextFunction, Request, Response } from "express";

// TEMPORARY diagnostic: shows which client-IP headers survive the
// browser -> Vercel rewrite -> Cloudflare -> Render chain, so the
// rate limiters can be keyed on the real client IP. Remove once the
// rate-limit IP fix ships.
//
// Safeguards:
// - Off unless LOG_IP_HEADERS=true.
// - Never logs full IPs: every address is masked (203.0.113.x / 2001:db8:85a3::x).
//   Equality between headers is computed on the raw values and logged as booleans.
// - Logs at most LOG_IP_HEADERS_MAX requests (default 25) per process, then goes quiet.
// - Only proxy/IP headers are read — never cookies, authorization, or bodies.

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

const DEFAULT_MAX_LOGGED = 25;
let loggedCount = 0;

// Test hook: reset the per-process cap.
export function resetIpHeaderLogCount() {
  loggedCount = 0;
}

const stripV4Mapped = (ip: string) => ip.replace(/^::ffff:/i, "");

export function maskIp(rawIp: string): string {
  const ip = stripV4Mapped(rawIp);
  const version = net.isIP(ip);
  if (version === 4) {
    return ip.split(".").slice(0, 3).join(".") + ".x";
  }
  if (version === 6) {
    // Keep only the first three hextets (roughly the provider/site prefix).
    const head = (ip.split("::")[0] ?? "").split(":").filter(Boolean).slice(0, 3);
    return head.join(":") + "::x";
  }
  return rawIp;
}

// Mask every IP-looking token inside a header value (handles lists,
// "for=" syntax in Forwarded, brackets, and ip:port).
export function maskIpsInValue(value: string): string {
  return value.replace(/[^\s,;="\[\]]+/g, (token) => {
    if (net.isIP(stripV4Mapped(token))) return maskIp(token);
    const [, host, port] = token.match(/^(.+):(\d+)$/) ?? [];
    if (host && port && net.isIP(host) === 4) return maskIp(host) + ":" + port;
    return token;
  });
}

const firstHeader = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const normalize = (ip: string | undefined) =>
  ip ? stripV4Mapped(ip.trim()) : undefined;

const sameIp = (a: string | undefined, b: string | undefined) =>
  a !== undefined && b !== undefined ? a === b : null;

export function logIpHeaders(req: Request, _res: Response, next: NextFunction) {
  const maxLogged = Number(process.env.LOG_IP_HEADERS_MAX) || DEFAULT_MAX_LOGGED;
  if (
    process.env.LOG_IP_HEADERS !== "true" ||
    req.path === "/health" ||
    loggedCount >= maxLogged
  ) {
    return next();
  }
  loggedCount += 1;

  const headers: Record<string, string> = {};
  for (const name of IP_HEADERS) {
    const value = req.headers[name];
    if (value === undefined) continue;
    headers[name] = maskIpsInValue(Array.isArray(value) ? value.join(", ") : value);
  }

  const forwardedChain = (firstHeader(req.headers["x-forwarded-for"]) ?? "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  const xffFirst = normalize(forwardedChain[0]);
  const cfConnectingIp = normalize(firstHeader(req.headers["cf-connecting-ip"]));
  const vercelForwardedFor = normalize(
    firstHeader(req.headers["x-vercel-forwarded-for"])?.split(",")[0],
  );
  const realIp = normalize(firstHeader(req.headers["x-real-ip"]));
  const reqIp = normalize(req.ip);

  console.log(
    `IP_HEADERS ${loggedCount}/${maxLogged} [${(req as any).requestId}] ${req.method} ${req.path}`,
    JSON.stringify({
      reqIp: reqIp ? maskIp(reqIp) : null,
      socket: req.socket.remoteAddress ? maskIp(req.socket.remoteAddress) : null,
      xffHops: forwardedChain.length,
      matches: {
        cfConnectingIpEqualsXffFirst: sameIp(cfConnectingIp, xffFirst),
        vercelForwardedForEqualsCfConnectingIp: sameIp(vercelForwardedFor, cfConnectingIp),
        realIpEqualsCfConnectingIp: sameIp(realIp, cfConnectingIp),
        reqIpEqualsCfConnectingIp: sameIp(reqIp, cfConnectingIp),
        reqIpEqualsXffFirst: sameIp(reqIp, xffFirst),
      },
      headers,
    }),
  );

  if (loggedCount === maxLogged) {
    console.log(`IP_HEADERS cap of ${maxLogged} reached; diagnostic is now silent until restart.`);
  }
  next();
}
