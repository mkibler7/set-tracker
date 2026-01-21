import mongoose from "mongoose";
import Workout from "../models/Workout.js";
import crypto from "crypto";

export type WorkoutSetInput = {
  id?: string;
  weight: number;
  reps: number;
  tempo?: string;
  rpe?: number;
};

export type WorkoutExerciseInput = {
  id: string;
  notes?: string;
  sets: WorkoutSetInput[];
};

export type CreateWorkoutInput = {
  date: Date;
  muscleGroups: string[];
  exercises?: WorkoutExerciseInput[];
};

export type UpdateWorkoutInput = Partial<CreateWorkoutInput>;

function canonicalizeMuscleGroup(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeMuscleGroups(muscleGroups: string[]): string[] {
  const normalized = muscleGroups
    .map((str) => canonicalizeMuscleGroup(String(str)))
    .filter((str): str is string => Boolean(str))
    .filter((str) => str.length <= 30);

  return Array.from(new Set(normalized));
}

function assertValidObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error("Invalid id");
    (err as any).status = 400;
    throw err;
  }
}

function ensureIds(exercises: any[] = []) {
  for (const ex of exercises) {
    // Your DB exercise schema uses "id" (string). Your API uses exerciseId in places.
    // Keep this in sync with what you actually store.
    if (!ex.id) ex.id = crypto.randomUUID();

    for (const s of ex.sets ?? []) {
      if (!s.id) s.id = crypto.randomUUID();
    }
  }
}

// TEMP
function backfillSetIds(doc: any) {
  let changed = false;
  for (const ex of doc.exercises ?? []) {
    for (const s of ex.sets ?? []) {
      if (!s.id) {
        s.id = crypto.randomUUID();
        changed = true;
      }
    }
  }
  return changed;
}

export async function deleteAllWorkoutsDevOnly(userId: string) {
  return Workout.deleteMany({ userId });
}

export async function getWorkouts(userId: string) {
  return Workout.find({ userId }).sort({ date: -1 });
}

export async function getWorkoutById(userId: string, id: string) {
  assertValidObjectId(id);

  const doc = await Workout.findOne({ _id: id, userId });
  if (!doc) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }

  if (backfillSetIds(doc)) {
    await doc.save();
  }
  return doc;
}

export async function createWorkout(userId: string, input: CreateWorkoutInput) {
  const workout = new Workout({
    userId,
    date: input.date,
    muscleGroups: normalizeMuscleGroups(input.muscleGroups),
    exercises: input.exercises ?? [],
  });

  return workout.save();
}

export async function updateWorkout(
  userId: string,
  id: string,
  input: UpdateWorkoutInput,
) {
  assertValidObjectId(id);
  const doc = await Workout.findOne({ _id: id, userId });
  if (!doc) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }

  if (input.date !== undefined) doc.date = input.date;
  if (input.muscleGroups !== undefined) {
    doc.muscleGroups = normalizeMuscleGroups(input.muscleGroups) as any;
  }

  if (input.exercises !== undefined) {
    // Ensure ids before assigning
    ensureIds(input.exercises as any[]);
    doc.exercises = input.exercises as any;
  }

  await doc.save();
  return doc;
}

export async function deleteWorkout(userId: string, id: string) {
  assertValidObjectId(id);

  const del = await Workout.findOneAndDelete({ _id: id, userId });
  if (!del) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }
  return { success: true };
}
