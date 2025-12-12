// SessionView.tsx
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
  fromWorkoutId?: string | null;
  isPickerOpen: boolean;
  onClosePicker: () => void;
  onOpenPicker: () => void;
  onSaveWorkout?: () => void; // 🔹 NEW
};

export default function SessionView({
  selectedMuscleGroups,
  isPickerOpen,
  onClosePicker,
  onOpenPicker,
  onSaveWorkout,
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

  const exercises = currentWorkout?.exercises ?? [];

  const exerciseToDelete = pendingDeleteId
    ? exercises.find((exercise) => exercise.id === pendingDeleteId)
    : undefined;

  const hasExercises = exercises.length > 0;
  const excludedIds = exercises.map((ex) => ex.id);

  const exerciseCount = exercises.length;
  const setCount = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

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
            aria-label="Add exercise"
            className="font-medium text-foreground underline-offset-2 underline decoration-dotted hover:decoration-solid"
          >
            Add Exercise
          </button>{" "}
          to start building today&apos;s session.
        </div>
      )}

      {/* Exercises list */}
      {hasExercises && (
        <div className="space-y-4">
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
              onNotesChange={(notes) => updateExerciseNotes(exercise.id, notes)}
            />
          ))}
          {/* Bottom Add Exercise CTA */}
          <button
            type="button"
            onClick={onOpenPicker}
            aria-label="Add exercise"
            className="w-full rounded-lg border border-dashed border-border/70 bg-card/30 hover:bg-card/45 transition-colors"
          >
            <div className="flex flex-col items-center justify-center gap-2 py-4 sm:py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/20 text-lg text-muted-foreground">
                +
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Picker modal */}
      {isPickerOpen && (
        <ExercisePicker
          isOpen={isPickerOpen}
          onClose={onClosePicker}
          onSelect={handleSelectExercise}
          excludeIds={excludedIds}
          split={selectedMuscleGroups}
        />
      )}

      {/* Delete confirmation */}
      <DeleteExerciseModal
        isOpen={!!pendingDeleteId}
        exerciseName={exerciseToDelete?.name ?? ""}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            removeExercise(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />

      {/* Footer summary + Save */}
      <div className="mt-2 shrink-0">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"} •{" "}
            {setCount} {setCount === 1 ? "set" : "sets"}
          </span>

          {/* Show total volume only if > 0 */}
          {totalVolume > 0 && (
            <span>{totalVolume.toLocaleString()} total volume</span>
          )}
        </div>
        <button
          type="button"
          onClick={onSaveWorkout} // call handler from page
          className="primary-button w-full "
          disabled={!onSaveWorkout}
        >
          Save Workout
        </button>
      </div>
    </>
  );
}
