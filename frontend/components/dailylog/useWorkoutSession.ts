"use client";

import { useState } from "react";
import type { WorkoutExercise, WorkoutSet } from "@/types/workout";
import { MOCK_EXERCISES } from "@/data/mockExercises";
import type { SetFormValues } from "@/components/dailylog/SetForm";

const createId = () => Math.random().toString(36).slice(2);

export function useWorkoutSession() {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const hasExercises = exercises.length > 0;
  const excludeIds = exercises.map((e) => e.id);

  const addExercise = (exerciseId: string) => {
    const template = MOCK_EXERCISES.find((e) => e.id === exerciseId);
    if (!template) return;

    setExercises((prev) => {
      if (prev.some((e) => e.id === template.id)) return prev;

      const newExercise: WorkoutExercise = {
        ...template,
        notes: "",
        sets: [],
        volume: 0,
      };

      return [...prev, newExercise];
    });
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  };

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, notes } : ex))
    );
  };

  const addSet = (exerciseId: string, values: SetFormValues) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const newSet: WorkoutSet = {
          id: createId(),
          reps: values.reps,
          weight: values.weight,
          volume: values.volume ?? values.reps * values.weight,
          rpe: values.rpe,
          tempo: values.tempo,
        };

        const updatedSets = [...ex.sets, newSet];
        return {
          ...ex,
          sets: updatedSets,
          volume: updatedSets.reduce((sum, s) => sum + s.volume, 0),
        };
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    values: SetFormValues
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const updatedSets = ex.sets.map((set) =>
          set.id === setId
            ? {
                ...set,
                reps: values.reps,
                weight: values.weight,
                volume: values.volume ?? values.reps * values.weight,
                rpe: values.rpe,
                tempo: values.tempo,
              }
            : set
        );

        return {
          ...ex,
          sets: updatedSets,
          volume: updatedSets.reduce((sum, s) => sum + s.volume, 0),
        };
      })
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const updatedSets = ex.sets.filter((set) => set.id !== setId);
        return {
          ...ex,
          sets: updatedSets,
          volume: updatedSets.reduce((sum, s) => sum + s.volume, 0),
        };
      })
    );
  };

  return {
    exercises,
    hasExercises,
    excludeIds,
    addExercise,
    removeExercise,
    updateExerciseNotes,
    addSet,
    updateSet,
    deleteSet,
  };
}
