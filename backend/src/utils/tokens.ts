import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Response } from "express";

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
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("rt", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}

export function clearRefreshCookie(res: Response) {
  // clearCookie must match at least the cookie path you set
  res.clearCookie("rt", { path: "/" });
}

// Access cookie: sent to ALL requests (so requireAuth can read it)
export function setAccessCookie(res: Response, accessToken: string) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("at", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAccessCookie(res: Response) {
  res.clearCookie("at", { path: "/" });
}
