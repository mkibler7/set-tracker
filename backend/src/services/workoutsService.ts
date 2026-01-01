import mongoose from "mongoose";
import Workout from "../models/Workout.js";

export type WorkoutSetInput = {
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

export async function deleteAllWorkoutsDevOnly() {
  return Workout.deleteMany({});
}

export async function getWorkouts() {
  return Workout.find().sort({ date: -1 });
}

export async function getWorkoutById(id: string) {
  assertValidObjectId(id);

  const doc = await Workout.findById(id);
  if (!doc) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }
  return doc;
}

export async function createWorkout(input: CreateWorkoutInput) {
  const workout = new Workout({
    date: input.date,
    muscleGroups: normalizeMuscleGroups(input.muscleGroups),
    exercises: input.exercises ?? [],
  });

  return workout.save();
}

export async function updateWorkout(id: string, input: UpdateWorkoutInput) {
  assertValidObjectId(id);

  const updateData: any = {};

  if (input.date !== undefined) updateData.date = input.date;
  if (input.muscleGroups !== undefined) {
    updateData.muscleGroups = normalizeMuscleGroups(input.muscleGroups);
  }
  if (input.exercises !== undefined) updateData.exercises = input.exercises;

  const updated = await Workout.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updated) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }
  return updated;
}

export async function deleteWorkout(id: string) {
  assertValidObjectId(id);

  const del = await Workout.findByIdAndDelete(id);
  if (!del) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }
  return { success: true };
}
