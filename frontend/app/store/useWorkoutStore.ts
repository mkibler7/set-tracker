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
  updateExercise: (exercise: WorkoutExercise) => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentWorkoutId: null,
  exercises: [],

  startWorkout: () =>
    set(() => ({
      currentWorkoutId: crypto.randomUUID(), // temp; backend will override later
      exercises: [],
    })),

  setExercises: (exercises) => set(() => ({ exercises })),

  updateExercise: (exercise) =>
    set((state) => {
      const exists = state.exercises.some((e) => e.id === (exercise as any).id);

      return {
        exercises: exists
          ? state.exercises.map((e) =>
              e.id === (exercise as any).id ? exercise : e
            )
          : [...state.exercises, exercise],
      };
    }),

  resetWorkout: () => ({
    currentWorkoutId: null,
    exercises: [],
  }),
}));
