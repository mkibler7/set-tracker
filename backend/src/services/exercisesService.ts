import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import Workout from "../models/Workout.js";

export type CreateExerciseInput = {
  name: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups?: string[];
  description?: string;
};

export async function deleteAllExercisesDevOnly() {
  return Exercise.deleteMany({});
}

export async function getExercises(userId: string) {
  // return Exercise.find().sort({ name: 1 });
  return Exercise.find({
    $or: [{ scope: "global" }, { scope: "user", userId }],
  }).sort({ name: 1 });
}

export async function getExerciseHistory(userId: string, exerciseId: string) {
  await getExerciseById(userId, exerciseId);

  const workouts = await Workout.find({
    userId,
    "exercises.id": exerciseId,
  }).sort({ date: -1 });

  const entries = workouts.map((workoutDoc: any) => {
    const workout = workoutDoc.toObject?.() ?? workoutDoc;
    const target = (workout.exercises ?? []).find(
      (exercise: any) => exercise.id === exerciseId
    );

    return {
      workoutId: String(workout._id),
      workoutDate:
        workout.date instanceof Date
          ? workout.date.toISOString()
          : workout.date,
      workoutName: (workout.muscleGroups ?? []).join(" / "),
      notes: target?.notes ?? "",
      sets: (target?.sets ?? []).map((s: any, i: number) => ({
        setNumber: i + 1,
        weight: s.weight,
        reps: s.reps,
        tempo: s.tempo,
        rpe: s.rpe,
      })),
    };
  });

  return entries;
}

export async function getExerciseById(userId: string, id: string) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid id");
    (error as any).status = 400;
    throw error;
  }

  const doc = await Exercise.findOne({
    _id: id,
    $or: [{ scope: "global" }, { scope: "user", userId }],
  });

  if (!doc) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }
  return doc;
}

export async function createExercise(
  userId: string,
  input: CreateExerciseInput
) {
  // Limit user exercise count
  const limit = Number(process.env.USER_EXERCISE_LIMIT ?? "300");
  const count = await Exercise.countDocuments({ scope: "user", userId });
  if (count >= limit) {
    const error = new Error(`Exercise limit reached (${limit}).`);
    (error as any).status = 403;
    throw error;
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const primaryMuscleGroup =
    typeof input.primaryMuscleGroup === "string"
      ? input.primaryMuscleGroup.trim()
      : "";
  const secondaryMuscleGroups = Array.isArray(input.secondaryMuscleGroups)
    ? input.secondaryMuscleGroups.map((s) => s.trim())
    : [];
  const description =
    typeof input.description === "string"
      ? input.description.trim()
      : undefined;

  if (!name || !primaryMuscleGroup) {
    const error = new Error("name and primaryMuscleGroup are required");
    (error as any).status = 400;
    throw error;
  }

  const newExercise = new Exercise({
    scope: "user",
    userId,
    name,
    primaryMuscleGroup,
    secondaryMuscleGroups,
    description,
  });

  try {
    return await newExercise.save();
  } catch (error: any) {
    // duplicate key (unique index) error handling
    if (error?.code === 11000) {
      const dupError = new Error(
        "Exercise already exists (duplicate name or id)."
      );
      (dupError as any).status = 409;
      throw dupError;
    }
    const err = new Error(
      error instanceof Error ? error.message : String(error)
    );
    (err as any).status = 400;
    throw err;
  }
}
