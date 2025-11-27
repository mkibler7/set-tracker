"use client";

import React, { useState } from "react";
import ExercisePicker from "@/components/dailylog/ExercisePicker";
import ExerciseCard from "@/components/dailylog/ExerciseCard";
import DeleteExerciseModal from "./DeleteExerciseModal";
import { useWorkoutSession } from "@/components/dailylog/useWorkoutSession";

type SessionViewProps = {
  selectedMuscleGroups: string[];
};

export default function SessionView({
  selectedMuscleGroups,
}: SessionViewProps) {
  const {
    exercises,
    hasExercises,
    excludeIds,
    addExercise,
    removeExercise,
    updateExerciseNotes,
    addSet,
    updateSet,
    deleteSet,
  } = useWorkoutSession();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const exerciseToDelete = pendingDeleteId
    ? exercises.find((exercise) => exercise.id === pendingDeleteId)
    : undefined;

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

  return (
    <>
      {/* Empty state */}
      {!hasExercises && (
        <div className="rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
          No exercises added yet. Click{" "}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="font-medium text-foreground underline-offset-2 underline decoration-dotted hover:decoration-solid"
          >
            Add Exercise
          </button>{" "}
          to start building today&apos;s session.
        </div>
      )}

      {/* Add exercise button once we have at least one */}
      {hasExercises && (
        <section className="flex h-full flex-col">
          <div className="mb-4 flex justify-end shrink-0">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center justify-center primary-button"
            >
              + Add Exercise
            </button>
          </div>

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
            <div className="flex mb-2 items-center justify-between text-xs text-muted-foreground">
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
        onClose={() => setIsPickerOpen(false)}
        onSelect={(id) => {
          addExercise(id);
          setIsPickerOpen(false);
        }}
        excludeIds={excludeIds}
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
