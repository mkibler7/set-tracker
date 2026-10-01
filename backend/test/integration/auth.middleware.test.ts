import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../../app.js"; // adjust path if different

describe("requireAuth middleware", () => {
  const app = createApp();

  it("returns 401 when Authorization header is missing", async () => {
    const res = await request(app).get("/api/workouts");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Missing access token" });
  });

  it("returns 401 when Bearer token is invalid", async () => {
    const res = await request(app)
      .get("/api/workouts")
      .set("Authorization", "Bearer not-a-real-jwt");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid or expired access token" });
  });

  it("returns 401 when the token uses an algorithm other than HS256", async () => {
    const token = jwt.sign({ sub: "user-1" }, process.env.JWT_ACCESS_SECRET!, {
      algorithm: "HS512",
    });

    const res = await request(app)
      .get("/api/workouts")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe("CORS", () => {
  const app = createApp();

  it("rejects disallowed origins with 403 (not 500)", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "https://evil.example");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Not allowed by CORS" });
  });

  it("allows the local frontend origin", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:3000");
    expect(res.status).toBe(200);
  });
});
