import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import workoutsRouter from "./src/routes/workouts.js";
import exercisesRouter from "./src/routes/exercises.js";
import authRouter from "./src/routes/auth.js";

export function createApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());

  // Routes
  app.use("/auth", authRouter);
  app.use("/api/workouts", workoutsRouter);
  app.use("/api/exercises", exercisesRouter);

  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return app;
}
