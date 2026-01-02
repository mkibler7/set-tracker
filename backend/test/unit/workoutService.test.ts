import { describe, it, expect } from "vitest";
import Workout from "../../src/models/Workout.js";

import {
  createWorkout,
  updateWorkout,
  getWorkoutById,
} from "../../src/services/workoutsService.js";

describe("workoutsService", () => {
  it("createWorkout normalizes muscleGroups (trim, title-case, dedupe, max length)", async () => {
    const saved = await createWorkout({
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
  });

  it("updateWorkout normalizes muscleGroups when provided", async () => {
    const created = await Workout.create({
      date: new Date("2025-03-10"),
      muscleGroups: ["Back"],
      exercises: [],
    });

    const updated = await updateWorkout(created._id.toString(), {
      muscleGroups: [" legs ", "Legs", "back  "],
    });

    expect(updated.muscleGroups).toEqual(["Legs", "Back"]);
  });

  it("getWorkoutById throws 400 for invalid ObjectId", async () => {
    await expect(getWorkoutById("not-an-id")).rejects.toMatchObject({
      status: 400,
    });
  });
});
