import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./src/config/db.js";
import workoutsRouter from "./src/routes/workouts.js";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

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

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});
