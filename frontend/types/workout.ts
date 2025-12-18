import type { Exercise, MuscleGroup } from "@/types/exercise";

export type TimeFilter = "all" | "7d" | "30d";

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  rpe?: number;
  tempo?: string;
  isWarmup?: boolean;
};

export type WorkoutExercise = {
  exerciseId: string;
  exerciseName: string;
  notes?: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  date: string;
  muscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Local, in-progress workout session.
 * Lives in your client store (e.g., Zustand) until the user finishes
 * and you persist it to the DB.
 */
export interface WorkoutSession {
  id: string;
  muscleGroups: MuscleGroup[];
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
  isCompleted?: boolean;
}
