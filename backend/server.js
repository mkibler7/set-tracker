require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // frontend dev URL
    credentials: true,
  })
);
app.use(express.json());

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Simple test
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint is working!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API is listening on http://localhost:${PORT}`);
});
