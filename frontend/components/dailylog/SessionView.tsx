"use client";

import React, { useState } from "react";
import ExercisePicker from "@/components/dailylog/ExercisePicker";
import ExerciseCard from "@/components/dailylog/ExerciseCard";
import DeleteExerciseModal from "./DeleteExerciseModal";
import { useWorkoutSession } from "@/components/dailylog/useWorkoutSession";
import { MOCK_EXERCISES } from "@/data/mockExercises";
import type { WorkoutExercise } from "@/types/workout";

type SessionViewProps = {
  selectedMuscleGroups: string[];
  fromWorkoutId?: string | null; // we’ll keep this for now, even if unused
  isPickerOpen: boolean;
  onClosePicker: () => void;
  onOpenPicker: () => void;
};

export default function SessionView({
  selectedMuscleGroups,
  // fromWorkoutId, // not used for now – we can reintroduce it later
  isPickerOpen,
  onClosePicker,
  onOpenPicker,
}: SessionViewProps) {
  const {
    currentWorkout,
    addExercise,
    removeExercise,
    updateExerciseNotes,
    addSet,
    updateSet,
    deleteSet,
  } = useWorkoutSession();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Always have an array so we don't blow up on .length or .map
  const exercises = currentWorkout?.exercises ?? [];

  const exerciseToDelete = pendingDeleteId
    ? exercises.find((exercise) => exercise.id === pendingDeleteId)
    : undefined;

  // Helpers that replaced the old store fields
  const hasExercises = exercises.length > 0;
  const excludedIds = exercises.map((ex) => ex.id);

  // Mini summary numbers
  const exerciseCount = exercises.length;
  const setCount = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  // Total volume if your set has weight + reps
  const totalVolume = exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((acc, set) => {
        const weight = set.weight ?? 0;
        const reps = set.reps ?? 0;
        return acc + weight * reps;
      }, 0)
    );
  }, 0);

  // Turn an exercise id from the picker into a WorkoutExercise for the session
  const handleSelectExercise = (id: string) => {
    const base = MOCK_EXERCISES.find((ex) => ex.id === id);
    if (!base) return;

    const workoutExercise: WorkoutExercise = {
      id: base.id,
      name: base.name,
      primaryMuscleGroup: base.primaryMuscleGroup,
      secondaryMuscleGroups: base.secondaryMuscleGroups ?? [],
      notes: "",
      sets: [],
      // if your WorkoutExercise type has additional fields (e.g. volume),
      // initialize them here as well:
      volume: 0,
    };

    addExercise(workoutExercise);
    onClosePicker();
  };

  return (
    <>
      {/* Empty state */}
      {!hasExercises && (
        <div className="rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
          No exercises added yet. Click{" "}
          <button
            type="button"
            onClick={onOpenPicker}
            className="font-medium text-foreground underline-offset-2 underline decoration-dotted hover:decoration-solid"
          >
            Add Exercise
          </button>{" "}
          to start building today&apos;s session.
        </div>
      )}

      {/* Session view with exercises */}
      {hasExercises && (
        <section className="flex h-full flex-col">
          {/* Exercise cards */}
          <div className="flex-1 overflow-y-auto pr-1 pb-4 space-y-6">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onRemove={() => setPendingDeleteId(exercise.id)}
                onAddSet={(values) => addSet(exercise.id, values)}
                onUpdateSet={(setId, values) =>
                  updateSet(exercise.id, setId, values)
                }
                onDeleteSet={(setId) => deleteSet(exercise.id, setId)}
                onNotesChange={(notes) =>
                  updateExerciseNotes(exercise.id, notes)
                }
              />
            ))}
          </div>

          {/* Bottom – Save button, always visible at bottom of window */}
          <div className="mt-2 shrink-0">
            {/* mini summary line */}
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}{" "}
                • {setCount} {setCount === 1 ? "set" : "sets"}
              </span>

              {/* Show total volume only if > 0 */}
              {totalVolume > 0 && (
                <span>{totalVolume.toLocaleString()} total volume</span>
              )}
            </div>
            <button type="button" className="primary-button w-full">
              Save Workout
            </button>
          </div>
        </section>
      )}

      {/* Exercise picker modal */}
      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={onClosePicker}
        onSelect={handleSelectExercise}
        excludeIds={excludedIds}
        split={selectedMuscleGroups}
      />

      {/* Delete exercise modal */}
      <DeleteExerciseModal
        open={pendingDeleteId !== null}
        exerciseName={exerciseToDelete?.name}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            removeExercise(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />
    </>
  );
}
