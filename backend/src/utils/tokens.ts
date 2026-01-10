import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Response } from "express";

function parseTtlToMs(ttl: string): number {
  const match = ttl.trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 15 * 60 * 1000;

  const rawNum = match[1];
  const rawUnit = match[2];
  if (!rawNum || !rawUnit) return 15 * 60 * 1000;

  const n = Number(rawNum);
  const unit = rawUnit.toLowerCase();

  switch (unit) {
    case "s":
      return n * 1000;
    case "m":
      return n * 60 * 1000;
    case "h":
      return n * 60 * 60 * 1000;
    case "d":
      return n * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}
function mustGetEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function signAccessToken(userId: string) {
  const ttl = (process.env.ACCESS_TOKEN_TTL ??
    "15m") as jwt.SignOptions["expiresIn"];
  const secret = mustGetEnv("JWT_ACCESS_SECRET");

  return jwt.sign({ sub: userId }, secret, {
    expiresIn: ttl,
  });
}

export function signRefreshToken(userId: string) {
  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  const secret = mustGetEnv("JWT_REFRESH_SECRET");
  const expiresIn = `${days}d` as jwt.SignOptions["expiresIn"];

  return jwt.sign({ sub: userId, jti: crypto.randomUUID() }, secret, {
    expiresIn,
  });
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Refresh cookie: only sent to /auth/refresh
export function setRefreshCookie(res: Response, refreshToken: string) {
  const isProd =
    process.env.NODE_ENV === "production" &&
    process.env.COOKIE_SECURE !== "false";
  const isLocalhost = process.env.NODE_ENV !== "production";
  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  const maxAge = days * 24 * 60 * 60 * 1000;

  res.cookie("rt", refreshToken, {
    httpOnly: true,
    secure: !isLocalhost && isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearRefreshCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("rt", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
  });
}

// Access cookie: sent to ALL requests (so requireAuth can read it)
export function setAccessCookie(res: Response, accessToken: string) {
  const isProd = process.env.NODE_ENV === "production";
  const ttl = process.env.ACCESS_TOKEN_TTL ?? "15m";
  const accessMaxAgeMs = parseTtlToMs(ttl);

  res.cookie("at", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAgeMs,
  });
}

export function clearAccessCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("at", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
  });
}
