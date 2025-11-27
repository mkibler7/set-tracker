import type { Exercise } from "@/types/exercise";
import type { WorkoutExercise } from "@/types/workout";
import { MOCK_EXERCISES } from "./mockExercises";

export type WorkoutSet = {
  reps: number;
  weight: number;
  volume: number;
  tempo?: string;
  rpe?: number;
};

export type Workout = {
  id: string;
  date: string;
  split: string;
  exercises: WorkoutExercise[];
};

function findExercise(id: Exercise["id"]): Exercise {
  const exercise = MOCK_EXERCISES.find((e) => e.id === id);
  if (!exercise) {
    throw new Error(`Unknown exercise id: ${id}`);
  }
  return exercise;
}

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "workout-1",
    date: "2025-11-26",
    split: "Chest",
    exercises: [
      {
        ...findExercise("bench-press"),
        notes: "Felt strong today!",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 185,
            volume: 12 * 185,
            tempo: "4-2-1-2",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 195,
            volume: 10 * 195,
            tempo: "4-2-1-2",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "4-2-1-2",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 215,
            volume: 6 * 215,
            tempo: "4-2-1-2",
          },
        ],
        volume: 12 * 185 + 10 * 195 + 8 * 205 + 6 * 215,
      },
      {
        ...findExercise("incline-bench-press"),
        notes: "Felt powerful today!",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 205,
            volume: 10 * 205,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 215,
            volume: 8 * 215,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 4,
            weight: 235,
            volume: 4 * 235,
            tempo: "2-0-2-0",
          },
        ],
        volume: 10 * 205 + 8 * 215 + 6 * 225 + 4 * 235,
      },
    ],
  },
];
