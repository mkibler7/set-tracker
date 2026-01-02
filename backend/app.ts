import express, { type Request, type Response } from "express";
import cors from "cors";

import workoutsRouter from "./src/routes/workouts.js";
import exercisesRouter from "./src/routes/exercises.js";

export function createApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(express.json());

  // Routes
  app.use("/api/workouts", workoutsRouter);
  app.use("/api/exercises", exercisesRouter);

  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return app;
}
