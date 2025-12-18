import { create } from "zustand";
import type { WorkoutExercise } from "@/types/workout";

interface WorkoutState {
  // null until the user starts logging
  currentWorkoutId: string | null;
  // all exercises in the current daily log
  exercises: WorkoutExercise[];

  // actions
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
      currentWorkoutId: crypto.randomUUID(),
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

  resetWorkout: () => ({
    currentWorkoutId: null,
    exercises: [],
  }),
}));
