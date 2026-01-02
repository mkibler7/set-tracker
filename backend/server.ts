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

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Closing MongoDB connection...");
      await mongoose.connection.close();
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
