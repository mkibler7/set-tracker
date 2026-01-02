import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import Workout from "../src/models/Workout.js";

describe("Workouts routes", () => {
  const app = createApp();

  it("GET /api/workouts returns workouts sorted from newest to oldest & returns valid id", async () => {
    await Workout.create([
      { date: new Date("2025-01-01"), muscleGroups: ["Back"], exercises: [] },
      { date: new Date("2025-02-01"), muscleGroups: ["Chest"], exercises: [] },
      {
        date: new Date("2025-02-15"),
        muscleGroups: ["Quads", "Hamstrings"],
        exercises: [],
      },
    ]);

    const response = await request(app).get("/api/workouts");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(3);

    const dates = response.body.map((w: any) => w.date);
    expect(dates).toEqual([
      new Date("2025-02-15").toISOString(),
      new Date("2025-02-01").toISOString(),
      new Date("2025-01-01").toISOString(),
    ]);
  });

  it("GET /api/workouts/:id returns 200 for a valid workout id", async () => {
    const workout = await Workout.create({
      date: new Date("2025-03-10"),
      muscleGroups: ["Back"],
      exercises: [],
    });

    const res = await request(app).get(
      `/api/workouts/${workout._id.toString()}`
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", workout._id.toString());
    expect(res.body.muscleGroups).toEqual(["Back"]);
    expect(res.body.date).toBe(new Date("2025-03-10").toISOString());
  });

  it("GET /api/workouts/:id returns 400 for invalid workout ID", async () => {
    const res = await request(app).get("/api/workouts/not-an-id");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid id" });
  });

  it("POST /api/workouts creates a workout and normalizes muscle groups", async () => {
    const workout = {
      date: "2025-03-10",
      muscleGroups: ["  back  ", "", "BACK", "chest", "Chest", "   "],
      exercises: [],
    };

    const response = await request(app).post("/api/workouts").send(workout);

    expect(response.status).toBe(201);
    expect(
      typeof response.body.id === "string" ||
        typeof response.body._id === "string"
    ).toBe(true);

    expect(response.body.muscleGroups).toEqual(["Back", "Chest"]);
    expect(response.body.muscleGroups).toHaveLength(2);
  });

  it("POST /api/workouts returns 400 for invalid date", async () => {
    const workout = {
      date: "not-a-date",
      muscleGroups: ["Back"],
      exercises: [],
    };

    const response = await request(app).post("/api/workouts").send(workout);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("PUT /api/workouts/:id updates muscleGroups and normalizes values", async () => {
    const workout = await Workout.create({
      date: new Date("2025-03-10"),
      muscleGroups: ["Back"],
      exercises: [],
    });

    const response = await request(app)
      .put(`/api/workouts/${workout._id.toString()}`)
      .send({ muscleGroups: [" legs ", "Legs", "Back"] });

    expect(response.status).toBe(200);
    expect(response.body.muscleGroups).toEqual(["Legs", "Back"]);
  });

  it("PUT /api/workouts/:id returns 400 for invalid id", async () => {
    const res = await request(app)
      .put("/api/workouts/not-an-id")
      .send({ muscleGroups: ["Legs"] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("DELETE /api/workouts/:id returns success true when deleted", async () => {
    const workout = await Workout.create({
      date: new Date("2025-03-10"),
      muscleGroups: ["Back"],
      exercises: [],
    });

    const response = await request(app).delete(
      `/api/workouts/${workout._id.toString()}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  it("DEV ONLY: DELETE /api/workouts/__dev__/all deletes workouts when NODE_ENV != production", async () => {
    await Workout.create([
      { date: new Date("2025-01-01"), muscleGroups: ["Back"], exercises: [] },
      { date: new Date("2025-02-01"), muscleGroups: ["Chest"], exercises: [] },
    ]);

    const response = await request(app).delete("/api/workouts/__dev__/all");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("deletedCount");
    expect(typeof response.body.deletedCount).toBe("number");

    const remaining = await Workout.countDocuments();
    expect(remaining).toBe(0);
  });
});
