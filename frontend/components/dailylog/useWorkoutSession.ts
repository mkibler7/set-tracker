"use client";

import { useCallback, useMemo } from "react";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import type { Workout, WorkoutExercise, WorkoutSet } from "@/types/workout";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import { MOCK_EXERCISES } from "@/data/mockExercises"; // whatever your exercise library is

// Whatever your set form values look like coming from ExerciseCard
export type SetFormValues = {
  weight?: number;
  reps?: number;
  rpe?: number;
  tempo?: string;
  notes?: string;
};

export function useWorkoutSession() {
  const exercises = useWorkoutStore((s) => s.exercises);
  const setExercises = useWorkoutStore((s) => s.setExercises);
  const updateExerciseInStore = useWorkoutStore((s) => s.updateExercise);
  const resetWorkout = useWorkoutStore((s) => s.resetWorkout);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const currentWorkoutId = useWorkoutStore((s) => s.currentWorkoutId);

  // Make sure a workout exists once the user starts logging
  const ensureWorkoutStarted = useCallback(() => {
    if (!currentWorkoutId) {
      startWorkout();
    }
  }, [currentWorkoutId, startWorkout]);

  const hasExercises = exercises.length > 0;

  // For ExercisePicker: avoid adding duplicates
  const excludeIds = useMemo(() => exercises.map((ex) => ex.id), [exercises]);

  /** ✅ NEW: create a new WorkoutExercise in the global store */
  const addExercise = useCallback(
    (exerciseId: string) => {
      ensureWorkoutStarted();

      // Look up exercise metadata from your exercise library
      const base = MOCK_EXERCISES.find(
        (exercise) => exercise.id === exerciseId
      );

      if (!base) return;

      const newExercise: WorkoutExercise = {
        // id: crypto.randomUUID(), // local id for this workout
        // exerciseId, // link back to Exercise
        // name: base?.name ?? "New Exercise",
        // muscleGroup: base?.primaryMuscleGroup ?? "Unknown",
        ...base,
        sets: [],
        volume: 0,
      };

      updateExerciseInStore(newExercise);
    },
    [ensureWorkoutStarted, updateExerciseInStore]
  );

  /**  Push a new set into that exercise’s sets array */
  const addSet = useCallback(
    (exerciseId: string, values: SetFormValues) => {
      ensureWorkoutStarted();

      const existing = exercises.find(
        (ex: any) => ex.id === exerciseId || ex.exerciseId === exerciseId
      );
      if (!existing) return;

      const nextSetNumber = existing.sets.length + 1;

      const weight = values.weight ?? 0;
      const reps = values.reps ?? 0;

      const newSet = {
        id: crypto.randomUUID(),
        setNumber: nextSetNumber,
        weight,
        reps,
        volume: weight * reps,
        rpe: values.rpe,
        tempo: values.tempo ?? "",
        notes: values.notes ?? "",
      };

      const updated: WorkoutExercise = {
        ...existing,
        sets: [...existing.sets, newSet],
      };

      updateExerciseInStore(updated);
    },
    [ensureWorkoutStarted, exercises, updateExerciseInStore]
  );

  /** Update an existing set */
  const updateSet = useCallback(
    (exerciseId: string, setId: string, values: SetFormValues) => {
      const ex = exercises.find((exercise: any) => exercise.id === exerciseId);
      if (!ex) return;

      const updatedSets = ex.sets.map((set: any) =>
        set.id === setId ? { ...set, ...values } : set
      );

      updateExerciseInStore({ ...ex, sets: updatedSets });
    },
    [exercises, updateExerciseInStore]
  );

  /** Delete a set */
  const deleteSet = useCallback(
    (exerciseId: string, setId: string) => {
      const ex = exercises.find(
        (e: any) => e.id === exerciseId || e.exerciseId === exerciseId
      );
      if (!ex) return;

      const updatedSets = ex.sets.filter((set: any) => set.id !== setId);

      updateExerciseInStore({ ...ex, sets: updatedSets });
    },
    [exercises, updateExerciseInStore]
  );

  /** Update notes on an exercise */
  const updateExerciseNotes = useCallback(
    (exerciseId: string, notes: string) => {
      const ex = exercises.find(
        (e: any) => e.id === exerciseId || e.exerciseId === exerciseId
      );
      if (!ex) return;

      updateExerciseInStore({ ...ex, notes });
    },
    [exercises, updateExerciseInStore]
  );

  /** Remove an entire exercise from the workout */
  const removeExercise = useCallback(
    (exerciseId: string) => {
      const remaining = exercises.filter(
        (e: any) => e.id !== exerciseId && e.exerciseId !== exerciseId
      );
      setExercises(remaining);
    },
    [exercises, setExercises]
  );

  /** Load an existing mock workout (your “repeat workout” flow) */
  const loadFromWorkout = useCallback(
    (workout: Workout) => {
      // Assuming workout.exercises already has the correct WorkoutExercise shape:
      setExercises(workout.exercises as WorkoutExercise[]);
    },
    [setExercises]
  );

  /** Clear the current in-memory workout session */
  const resetSession = useCallback(() => {
    resetWorkout();
  }, [resetWorkout]);

  return {
    exercises,
    hasExercises,
    excludeIds,
    setExercises,
    resetSession,
    addExercise,
    loadFromWorkout,
    removeExercise,
    updateExerciseNotes,
    addSet,
    updateSet,
    deleteSet,
  };
}
