import { describe, it, expect } from "vitest";
import request from "supertest";
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
});
