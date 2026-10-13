import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import express from "express";

import {
  logIpHeaders,
  maskIp,
  maskIpsInValue,
  resetIpHeaderLogCount,
} from "../../src/middleware/logIpHeaders.js";

const CLIENT_IP = "203.0.113.77";
const CLOUDFLARE_IP = "104.22.5.9";

function buildApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(logIpHeaders);
  app.get("/api/ping", (_req, res) => res.json({ ok: true }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
}

const sendProxied = (app: express.Express, path = "/api/ping") =>
  request(app)
    .get(path)
    .set("X-Forwarded-For", `${CLIENT_IP}, ${CLOUDFLARE_IP}`)
    .set("CF-Connecting-IP", CLIENT_IP)
    .set("Forwarded", `for=${CLIENT_IP}:4711;proto=https`)
    .set("Cookie", "at=secret-access-token")
    .set("Authorization", "Bearer secret");

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

  it("masks IPs inside list, Forwarded and ip:port values", () => {
    expect(maskIpsInValue(`${CLIENT_IP}, ${CLOUDFLARE_IP}`)).toBe("203.0.113.x, 104.22.5.x");
    expect(maskIpsInValue(`for=${CLIENT_IP}:4711;proto=https`)).toBe("for=203.0.113.x:4711;proto=https");
    expect(maskIpsInValue('for="[2001:db8:85a3::1]:4711"')).toBe('for="[2001:db8:85a3::x]:4711"');
  });
});

describe("logIpHeaders", () => {
  const originalEnv = { ...process.env };
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetIpHeaderLogCount();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    process.env = { ...originalEnv };
  });

  const loggedText = () => logSpy.mock.calls.map((args) => args.join(" ")).join("\n");

  it("logs nothing when LOG_IP_HEADERS is not set", async () => {
    delete process.env.LOG_IP_HEADERS;
    await sendProxied(buildApp());
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("never logs full IPs, cookies, or authorization", async () => {
    process.env.LOG_IP_HEADERS = "true";
    await sendProxied(buildApp());

    const text = loggedText();
    expect(text).toContain("IP_HEADERS");
    expect(text).not.toContain(CLIENT_IP);
    expect(text).not.toContain(CLOUDFLARE_IP);
    expect(text).not.toContain("secret");
    expect(text).toContain("203.0.113.x");
  });

  it("reports header agreement as booleans", async () => {
    process.env.LOG_IP_HEADERS = "true";
    await sendProxied(buildApp());

    const payload = JSON.parse(logSpy.mock.calls[0][1] as string);
    expect(payload.xffHops).toBe(2);
    expect(payload.matches.cfConnectingIpEqualsXffFirst).toBe(true);
    expect(payload.matches.reqIpEqualsCfConnectingIp).toBe(false);
    expect(payload.matches.vercelForwardedForEqualsCfConnectingIp).toBeNull();
  });

  it("skips /health", async () => {
    process.env.LOG_IP_HEADERS = "true";
    await sendProxied(buildApp(), "/health");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("goes silent after LOG_IP_HEADERS_MAX requests", async () => {
    process.env.LOG_IP_HEADERS = "true";
    process.env.LOG_IP_HEADERS_MAX = "2";
    const app = buildApp();

    for (let i = 0; i < 5; i++) await sendProxied(app);

    const requestLines = logSpy.mock.calls.filter((args) =>
      String(args[0]).match(/^IP_HEADERS \d+\/2 /),
    );
    expect(requestLines).toHaveLength(2);
    expect(loggedText()).toContain("cap of 2 reached");
  });
});
