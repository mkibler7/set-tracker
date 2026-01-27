import rateLimit from "express-rate-limit";

// General API limiter (reasonable baseline)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300, // 300 requests / 15 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "API rate limit hit." },
});

// Auth limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30, // 30 auth requests / 15 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "Auth rate limit hit." },
});

// Login limiter (strictest)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10, // 10 login attempts / 15 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});
