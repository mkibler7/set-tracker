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

export interface CurrentSessionExerciseSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number;
  tempo?: string;
  notes?: string;
}

export interface CurrentSessionExercise {
  exerciseId: string; // id from your Exercise model
  exerciseName: string;
  sets: CurrentSessionExerciseSet[];
}
