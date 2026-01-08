import { create } from "zustand";
import type { WorkoutExercise } from "@/types/workout";

interface WorkoutState {
  currentWorkoutId: string | null;
  exercises: WorkoutExercise[];

  startWorkout: () => void;
  setExercises: (exercises: WorkoutExercise[]) => void;
  upsertExercise: (exercise: WorkoutExercise) => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentWorkoutId: null,
  exercises: [],

  startWorkout: () =>
    set(() => ({
      currentWorkoutId:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      exercises: [],
    })),

  setExercises: (exercises) => set(() => ({ exercises })),

  upsertExercise: (exercise) =>
    set((state) => {
      const exists = state.exercises.some(
        (e) => e.exerciseId === exercise.exerciseId
      );

      return {
        exercises: exists
          ? state.exercises.map((e) =>
              e.exerciseId === exercise.exerciseId ? exercise : e
            )
          : [...state.exercises, exercise],
      };
    }),

  resetWorkout: () =>
    set(() => ({
      currentWorkoutId: null,
      exercises: [],
    })),
}));
