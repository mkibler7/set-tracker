import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";

import { createApp } from "../../app.js";
import Exercise from "../../src/models/Exercise.js";
import Workout from "../../src/models/Workout.js";

const app = createApp();

describe("Exercises routes", () => {
  let agent: ReturnType<typeof request.agent>;
  let token: string;
  let userId: string;
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    agent = request.agent(app);

    const res = await agent.post("/auth/register").send({
      email: `test-${Date.now()}@example.com`,
      password: "Password123!",
    });

    if (res.status !== 201) {
      throw new Error(`Register failed: ${res.status} ${res.text}`);
    }

    token = res.body.accessToken;
    userId = res.body.user.id;

    await Exercise.deleteMany({ scope: "user", userId });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const auth = (req: request.Test) =>
    req.set("Authorization", `Bearer ${token}`);

  it("GET /api/exercises returns 200 and an array", async () => {
    const res = await auth(agent.get("/api/exercises"));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/exercises creates an exercise; duplicate returns 409", async () => {
    const payload = {
      name: "Barbell Curl",
      primaryMuscleGroup: "Biceps",
      secondaryMuscleGroups: ["Back"],
      description: "Standard curl",
    };

    const first = await auth(agent.post("/api/exercises").send(payload));
    if (first.status !== 201) {
      // temporary debug output
      // eslint-disable-next-line no-console
      console.log("First POST failed:", first.status, first.body);
    }

    expect(first.status).toBe(201);

    const second = await auth(agent.post("/api/exercises").send(payload));
    expect(second.status).toBe(409);
    expect(second.body).toHaveProperty("message");
  });

  it("GET /api/exercises/:id returns 400 for invalid id", async () => {
    const res = await auth(agent.get("/api/exercises/not-an-id"));
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/exercises/history/exercise/:id returns entries when workouts contain that exercise", async () => {
    const exercise = await Exercise.create({
      scope: "user",
      userId,
      name: "Barbell Curl",
      primaryMuscleGroup: "Biceps",
      secondaryMuscleGroups: [],
      description: "",
    });

    await Workout.create({
      userId,
      date: new Date("2025-03-10"),
      muscleGroups: ["Arms"],
      exercises: [
        {
          id: exercise._id.toString(),
          notes: "Felt good",
          sets: [{ weight: 50, reps: 10 }],
        },
      ],
    });

    const res = await auth(
      agent.get(`/api/exercises/history/exercise/${exercise._id.toString()}`)
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("workoutId");
    expect(res.body[0]).toHaveProperty("sets");
  });

  it("DEV ONLY: DELETE /api/exercises/__dev__/all returns 403 in production", async () => {
    process.env.NODE_ENV = "production";

    const res = await agent.delete("/api/exercises/__dev__/all");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Forbidden" });
  });

  it("DEV ONLY: DELETE /api/exercises/__dev__/all deletes exercises when not production", async () => {
    process.env.NODE_ENV = "test";

    await Exercise.create([
      {
        scope: "user",
        userId,
        name: "Barbell Curl",
        primaryMuscleGroup: "Biceps",
        secondaryMuscleGroups: [],
        description: "",
      },
      {
        scope: "user",
        userId,
        name: "Hammer Curl",
        primaryMuscleGroup: "Biceps",
        secondaryMuscleGroups: [],
        description: "",
      },
    ]);

    const res = await agent.delete("/api/exercises/__dev__/all");
    expect(res.status).toBe(200);
    expect(typeof res.body.deletedCount).toBe("number");

    const remaining = await Exercise.countDocuments({ scope: "user", userId });
    expect(remaining).toBe(0);
  });
});
