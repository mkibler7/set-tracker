import express, { NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import workoutsRouter from "./src/routes/workouts.js";
import exercisesRouter from "./src/routes/exercises.js";
import authRouter from "./src/routes/auth.js";

export function createApp() {
  const app = express();

  // Trust reverse proxy (Render) so secure cookies / IPs behave correctly
  app.set("trust proxy", 1);

  // Assign unique request ID to each request
  app.use((req, res, next) => {
    (req as any).requestId = crypto.randomUUID();
    res.setHeader("X-Request-Id", (req as any).requestId);
    next();
  });

  // Request logging
  if (process.env.NODE_ENV !== "test") {
    morgan.token("rid", (req) => (req as any).requestId);

    const format =
      process.env.NODE_ENV === "production"
        ? ":rid :remote-addr :method :url :status :res[content-length] - :response-time ms"
        : ":rid :method :url :status - :response-time ms";

    app.use(
      morgan(format, {
        skip: (req) =>
          process.env.NODE_ENV === "production" && req.path === "/health",
      }),
    );
  }

  // Hide framework fingerprinting
  app.disable("x-powered-by");

  // Security headers
  app.use(helmet());

  const allowed = new Set(
    [
      process.env.FRONTEND_ORIGIN, // https://app.set-tracker.com
      "http://localhost:3000",
    ].filter(Boolean) as string[],
  );

  // Middleware
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // allows curl/postman/server-to-server
        if (allowed.has(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );

  app.use(cookieParser());

  // Parse JSON first, then sanitize parsed input
  app.use(express.json({ limit: "1mb" }));

  // Block HTTP Parameter Pollution (HPP)
  app.use(hpp());

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/workouts", workoutsRouter);
  app.use("/api/exercises", exercisesRouter);

  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // Centralized error handler (prevents leaking stack traces)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status ?? 500;
    const message =
      status >= 500
        ? "Internal server error"
        : (err?.message ?? "Request failed");
    console.error("UNHANDLED ERROR:", err);
    res.status(status).json({ message });
  });

  return app;
}
