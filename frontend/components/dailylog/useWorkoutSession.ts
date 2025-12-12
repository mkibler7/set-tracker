"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkoutExercise, WorkoutSession } from "@/types/workout";
import type { SetFormValues } from "@/components/dailylog/SetForm";

/**
 * Shape of the workout session store.
 * - currentWorkout: the active in-progress workout
 * - actions: functions to start/modify/end that workout
 */
type WorkoutSessionState = {
  currentWorkout: WorkoutSession | null;
  stashedWorkout?: WorkoutSession | null; // optional saved state
  // actions
  startWorkout: (
    name: string,
    date: string,
    exercises?: WorkoutExercise[]
  ) => void;
  addExercise: (exercise: WorkoutExercise) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string, values: SetFormValues) => void;
  updateSet: (exerciseId: string, setId: string, values: SetFormValues) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  updateExerciseNotes: (exerciseId: string, notes: string) => void;
  updateSplit: (splitName: string) => void;
  updateSessionMeta: (updates: Partial<WorkoutSession>) => void;
  endWorkout: () => void;
  stashCurrentWorkout: () => void;
  restoreStashedWorkout: () => void;
};

/**
 * Global Zustand store for the current workout session.
 * Wrapped in `persist` so it survives page reloads (localStorage key: "workout-session").
 */
export const useWorkoutSession = create<WorkoutSessionState>()(
  persist(
    (set, get) => ({
      // No active workout by default
      currentWorkout: null,

      /**
       * Start a new workout session.
       * - name -> becomes the `split` label (e.g. "Chest / Triceps")
       * - date -> ISO string or similar
       * - exercises -> optional seed list (e.g. when loading from a saved workout)
       */
      startWorkout: (name, date, exercises = []) =>
        set({
          currentWorkout: {
            id: "session-" + Date.now(),
            split: name,
            date,
            exercises,
          },
        }),

      /**
       * Add a new exercise to the current workout.
       * If there is no active workout, this is a no-op.
       */
      addExercise: (exercise) =>
        set((state) =>
          state.currentWorkout
            ? {
                currentWorkout: {
                  ...state.currentWorkout,
                  exercises: [...state.currentWorkout.exercises, exercise],
                },
              }
            : state
        ),

      /**
       * Remove an exercise (and all of its sets) from the workout.
       */
      removeExercise: (exerciseId) =>
        set((state) =>
          state.currentWorkout
            ? {
                currentWorkout: {
                  ...state.currentWorkout,
                  exercises: state.currentWorkout.exercises.filter(
                    (exercise) => exercise.id !== exerciseId
                  ),
                },
              }
            : state
        ),

      /**
       * Add a new set to a specific exercise.
       * - Finds the exercise by id
       * - Appends a new set object with a generated id and computed volume
       */
      addSet: (exerciseId, values) =>
        set((state) => {
          const session = state.currentWorkout;
          if (!session) return state;

          const weight = values.weight ?? 0;
          const reps = values.reps ?? 0;

          return {
            currentWorkout: {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: [
                        ...exercise.sets,
                        {
                          id: "set-" + Date.now(),
                          reps,
                          weight,
                          tempo: values.tempo,
                          rpe: values.rpe,
                          volume: weight * reps,
                        },
                      ],
                    }
                  : exercise
              ),
            },
          };
        }),

      /**
       * Update an existing set on an exercise.
       * - Merges the new values into the set
       * - Recalculates volume from reps * weight
       */
      updateSet: (exerciseId, setId, values) =>
        set((state) => {
          const session = state.currentWorkout;
          if (!session) return state;

          return {
            currentWorkout: {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.map((set) =>
                        set.id === setId
                          ? {
                              ...set,
                              ...values,
                              volume:
                                (values.reps ?? set.reps) *
                                (values.weight ?? set.weight),
                            }
                          : set
                      ),
                    }
                  : exercise
              ),
            },
          };
        }),

      /**
       * Delete a set from an exercise.
       */
      deleteSet: (exerciseId, setId) =>
        set((state) => {
          const session = state.currentWorkout;
          if (!session) return state;

          return {
            currentWorkout: {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.filter((set) => set.id !== setId),
                    }
                  : exercise
              ),
            },
          };
        }),

      /**
       * Update the free-text notes field on a specific exercise.
       */
      updateExerciseNotes: (exerciseId, notes) =>
        set((state) => {
          const session = state.currentWorkout;
          if (!session) return state;

          return {
            currentWorkout: {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, notes } : exercise
              ),
            },
          };
        }),

      /**
       * Update the current workout's split label without
       * resetting the session or its exercises.
       */
      updateSplit: (split) =>
        set((state) => {
          if (!state.currentWorkout) return state;
          return {
            currentWorkout: {
              ...state.currentWorkout,
              split,
            },
          };
        }),

      updateSessionMeta: (updates) =>
        set((state) =>
          state.currentWorkout
            ? {
                currentWorkout: {
                  ...state.currentWorkout,
                  ...updates,
                },
              }
            : state
        ),

      stashedWorkout: null,

      stashCurrentWorkout: () =>
        set((state) => {
          if (!state.currentWorkout) return state;
          if (state.stashedWorkout) return state; // already stashed
          return { stashedWorkout: state.currentWorkout };
        }),

      restoreStashedWorkout: () =>
        set((state) => {
          if (!state.stashedWorkout) return state;
          return { currentWorkout: state.stashedWorkout, stashedWorkout: null };
        }),

      /**
       * Completely clear the active workout.
       * (You might later replace this with logic that also POSTs to an API first.)
       */
      endWorkout: () => set({ currentWorkout: null }),
    }),
    {
      name: "workout-session",
    }
  )
);
