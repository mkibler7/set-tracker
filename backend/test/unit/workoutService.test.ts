import { describe, it, expect } from "vitest";
import Workout from "../../src/models/Workout.js";

import {
  createWorkout,
  updateWorkout,
  getWorkoutById,
} from "../../src/services/workoutsService.js";
import mongoose from "mongoose";

describe("workoutsService", () => {
  const userId = new mongoose.Types.ObjectId().toString();

  it("createWorkout normalizes muscleGroups (trim, title-case, dedupe, max length)", async () => {
    const saved = await createWorkout(userId, {
      date: new Date("2025-03-10"),
      muscleGroups: [
        "  back  ",
        "BACK",
        "chest",
        "Chest",
        "   ",
        "This Muscle Group Name Is Definitely Way Too Long To Be Allowed",
      ],
      exercises: [],
    });

    // read from DB to ensure persisted value is normalized
    const inDb = await Workout.findById(saved._id).lean();
    expect(inDb).toBeTruthy();
    expect(inDb?.muscleGroups).toEqual(["Back", "Chest"]);
    expect(String(inDb?.userId)).toEqual(userId);
  });

  it("updateWorkout normalizes muscleGroups when provided", async () => {
    const created = await Workout.create({
      userId,
      date: new Date("2025-03-10"),
      muscleGroups: ["Back"],
      exercises: [],
    });

    const updated = await updateWorkout(userId, created._id.toString(), {
      muscleGroups: [" legs ", "Legs", "back  "],
    });

    expect(updated.muscleGroups).toEqual(["Legs", "Back"]);
  });

  it("getWorkoutById throws 400 for invalid ObjectId", async () => {
    await expect(getWorkoutById(userId, "not-an-id")).rejects.toMatchObject({
      status: 400,
    });
  });
});
