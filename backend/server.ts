import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = createApp();

// Start server
async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Backend API listening on http://localhost:${PORT}`);
    });

    // Graceful shutdown: SIGINT (Ctrl+C locally), SIGTERM (Render deploys/restarts).
    // Stop accepting requests first, let in-flight ones finish, then close MongoDB.
    let shuttingDown = false;
    const shutdown = (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;
      console.log(`${signal} received, shutting down...`);

      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });

      // Don't hang forever on keep-alive connections
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
