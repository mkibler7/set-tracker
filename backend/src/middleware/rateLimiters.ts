import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

import { getClientIp } from "../utils/clientIp.js";

const num = (key: string, fallback: number) => {
  const raw = process.env[key];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
};

// Key on the real client IP, not the proxy in front of Render.
// ipKeyGenerator groups IPv6 addresses by subnet so one user cannot rotate addresses.
const keyGenerator = (req: Request) => ipKeyGenerator(getClientIp(req));

// General API limiter (reasonable baseline)
export const apiLimiter = rateLimit({
  windowMs: num("API_RATE_WINDOW_MS", 15 * 60 * 1000),
  limit: num("API_RATE_LIMIT", 300),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "API rate limit hit." },
});

// Auth limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: num("AUTH_RATE_WINDOW_MS", 15 * 60 * 1000),
  limit: num("AUTH_RATE_LIMIT", 30),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "Auth rate limit hit." },
});

// Login limiter (strictest)
export const loginLimiter = rateLimit({
  windowMs: num("LOGIN_RATE_WINDOW_MS", 15 * 60 * 1000),
  limit: num("LOGIN_RATE_LIMIT", 10),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  message: { message: "Too many login attempts. Please try again later." },
});
