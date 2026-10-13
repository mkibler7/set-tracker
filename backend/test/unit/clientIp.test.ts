import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import type { Request } from "express";

import { getClientIp, maskIp } from "../../src/utils/clientIp.js";

const SECRET = "test-proxy-secret";
const CLIENT_IP = "203.0.113.77";
const VERCEL_IP = "198.51.100.20";
const CLOUDFLARE_IP = "104.22.5.9";

const fakeReq = (headers: Record<string, string>, ip = CLOUDFLARE_IP) =>
  ({ headers, ip }) as unknown as Request;

describe("getClientIp", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.PROXY_SHARED_SECRET = SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("trusts X-Client-IP when the proxy secret matches", () => {
    const req = fakeReq({
      "x-proxy-secret": SECRET,
      "x-client-ip": CLIENT_IP,
      "cf-connecting-ip": VERCEL_IP,
    });
    expect(getClientIp(req)).toBe(CLIENT_IP);
  });

  it("ignores X-Client-IP when the secret is wrong", () => {
    const req = fakeReq({
      "x-proxy-secret": "guess",
      "x-client-ip": CLIENT_IP,
      "cf-connecting-ip": VERCEL_IP,
    });
    expect(getClientIp(req)).toBe(VERCEL_IP);
  });

  it("ignores X-Client-IP when the secret is missing", () => {
    const req = fakeReq({ "x-client-ip": CLIENT_IP, "cf-connecting-ip": VERCEL_IP });
    expect(getClientIp(req)).toBe(VERCEL_IP);
  });

  it("ignores X-Client-IP when the server has no secret configured", () => {
    delete process.env.PROXY_SHARED_SECRET;
    const req = fakeReq({
      "x-proxy-secret": "",
      "x-client-ip": CLIENT_IP,
      "cf-connecting-ip": VERCEL_IP,
    });
    expect(getClientIp(req)).toBe(VERCEL_IP);
  });

  it("ignores an X-Client-IP that is not an IP address", () => {
    const req = fakeReq({
      "x-proxy-secret": SECRET,
      "x-client-ip": "not-an-ip",
      "cf-connecting-ip": VERCEL_IP,
    });
    expect(getClientIp(req)).toBe(VERCEL_IP);
  });

  it("falls back to req.ip when no proxy headers are present", () => {
    expect(getClientIp(fakeReq({}))).toBe(CLOUDFLARE_IP);
  });

  it("normalizes IPv4-mapped IPv6", () => {
    expect(getClientIp(fakeReq({}, "::ffff:127.0.0.1"))).toBe("127.0.0.1");
  });
});

describe("maskIp", () => {
  it("masks the last IPv4 octet", () => {
    expect(maskIp("203.0.113.77")).toBe("203.0.113.x");
  });

  it("masks IPv4-mapped IPv6 as IPv4", () => {
    expect(maskIp("::ffff:127.0.0.1")).toBe("127.0.0.x");
  });

  it("keeps only the IPv6 prefix", () => {
    expect(maskIp("2001:db8:85a3:8d3:1319:8a2e:370:7348")).toBe("2001:db8:85a3::x");
  });

  it("never echoes a value that is not an IP", () => {
    expect(maskIp("something-else")).toBe("unknown");
  });
});

describe("rate limiter keying", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.PROXY_SHARED_SECRET = SECRET;
    process.env.LOGIN_RATE_LIMIT = "1";
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  async function buildApp() {
    const { loginLimiter } = await import("../../src/middleware/rateLimiters.js");
    const app = express();
    app.set("trust proxy", 1);
    app.post("/login", loginLimiter, (_req, res) => res.json({ ok: true }));
    return app;
  }

  const viaVercel = (app: express.Express, clientIp: string, secret = SECRET) =>
    request(app)
      .post("/login")
      .set("X-Forwarded-For", CLOUDFLARE_IP)
      .set("CF-Connecting-IP", VERCEL_IP)
      .set("X-Proxy-Secret", secret)
      .set("X-Client-IP", clientIp);

  it("gives users behind the same proxy separate limits", async () => {
    const app = await buildApp();
    expect((await viaVercel(app, "203.0.113.1")).status).toBe(200);
    expect((await viaVercel(app, "203.0.113.2")).status).toBe(200);
    expect((await viaVercel(app, "203.0.113.1")).status).toBe(429);
  });

  it("cannot be bypassed by rotating a spoofed X-Client-IP", async () => {
    const app = await buildApp();
    expect((await viaVercel(app, "203.0.113.1", "wrong")).status).toBe(200);
    expect((await viaVercel(app, "203.0.113.2", "wrong")).status).toBe(429);
  });
});
