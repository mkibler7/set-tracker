import type { Exercise } from "@/types/exercise";

export type TimeFilter = "all" | "7d" | "30d";

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  volume: number;
  rpe?: number;
  tempo?: string;
};

export type WorkoutExercise = Exercise & {
  notes?: string;
  sets: WorkoutSet[];
  volume: number;
};

export type Workout = {
  id: string;
  date: string;
  split: string;
  exercises: WorkoutExercise[];
};

/**
 * Local, in-progress workout session.
 * Lives in your client store (e.g., Zustand) until the user finishes
 * and you persist it to the DB.
 */
export interface WorkoutSession {
  id: string;
  split: string;
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
  isCompleted?: boolean;
}
