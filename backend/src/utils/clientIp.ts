import crypto from "node:crypto";
import net from "node:net";
import type { Request } from "express";

// Production request chain: browser -> Vercel (Next rewrite) -> Cloudflare -> Render.
// req.ip is a Cloudflare edge and CF-Connecting-IP is a Vercel server, so neither
// identifies the user. The Next middleware forwards the real client IP in
// X-Client-IP together with a shared secret; only trust it when the secret matches.
// Anyone calling the API directly (not through Vercel) is identified by
// CF-Connecting-IP, which Cloudflare sets itself and callers cannot spoof.

const firstHeader = (req: Request, name: string) => {
  const value = req.headers[name];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
};

const stripV4Mapped = (ip: string) => ip.replace(/^::ffff:/i, "");

const validIp = (ip: string | undefined) =>
  ip && net.isIP(stripV4Mapped(ip)) ? stripV4Mapped(ip) : undefined;

const secretsMatch = (provided: string, expected: string) => {
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
};

function isTrustedProxy(req: Request) {
  const expected = process.env.PROXY_SHARED_SECRET;
  const provided = firstHeader(req, "x-proxy-secret");
  return Boolean(expected && provided && secretsMatch(provided, expected));
}

export function getClientIp(req: Request): string {
  if (isTrustedProxy(req)) {
    const clientIp = validIp(firstHeader(req, "x-client-ip"));
    if (clientIp) return clientIp;
  }

  const cfConnectingIp = validIp(firstHeader(req, "cf-connecting-ip"));
  if (cfConnectingIp) return cfConnectingIp;

  return validIp(req.ip) ?? req.ip ?? "unknown";
}

// For logs: never write a full client IP.
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
  return "unknown";
}
