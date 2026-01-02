import { describe, it, expect } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import { createApp } from "../app.js";
import Exercise from "../src/models/Exercise.js";
import Workout from "../src/models/Workout.js";

describe("Exercises routes", () => {
  const app = createApp();

  it("GET /api/exercises returns 200 and an array", async () => {
    const res = await request(app).get("/api/exercises");
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

    const first = await request(app).post("/api/exercises").send(payload);
    if (first.status !== 201) {
      // temporary debug output
      // eslint-disable-next-line no-console
      console.log("First POST failed:", first.status, first.body);
    }

    expect(first.status).toBe(201);

    const second = await request(app).post("/api/exercises").send(payload);
    expect(second.status).toBe(409);
    expect(second.body).toHaveProperty("message");
  });

  it("GET /api/exercises/:id returns 400 for invalid id", async () => {
    const res = await request(app).get("/api/exercises/not-an-id");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/exercises/history/exercise/:id returns entries when workouts contain that exercise", async () => {
    const ex = await Exercise.create({
      name: "Barbell Curl",
      primaryMuscleGroup: "Biceps",
      secondaryMuscleGroups: [],
      description: "",
    });

    await Workout.create({
      date: new Date("2025-03-10"),
      muscleGroups: ["Arms"],
      exercises: [
        {
          id: ex._id.toString(), // depends on how you store exercise id; adjust if different
          notes: "Felt good",
          sets: [{ weight: 50, reps: 10 }],
        },
      ],
    });

    const res = await request(app).get(
      `/api/exercises/history/exercise/${ex._id.toString()}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("workoutId");
    expect(res.body[0]).toHaveProperty("sets");
  });
});
