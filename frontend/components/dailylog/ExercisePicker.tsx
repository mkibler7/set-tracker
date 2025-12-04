"use client";

import React, { useState, useMemo } from "react";
import { MOCK_EXERCISES } from "@/data/mockExercises";
import type { Exercise } from "@/types/exercise";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";

type ExercisePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onCreateExercise?: () => void;
  excludeIds?: string[]; // ids already in today’s workout
  split?: string[]; // e.g. "Chest", "Back", etc. (optional for now)
};

const buttonClassName =
  "w-full mt-3 h-[2rem] rounded-md border border-border bg-card px-3 font-medium text-muted-foreground hover:bg-accent/20 hover:border-accent hover:text-accent-foreground";

export default function ExercisePicker({
  isOpen,
  onClose,
  onSelect,
  onCreateExercise,
  excludeIds = [],
  split = [],
}: ExercisePickerProps) {
  const [search, setSearch] = useState("");

  const filteredExercises = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return MOCK_EXERCISES.filter((exercise) => {
      // 1) hide ones already in the workout
      if (excludeIds.includes(exercise.id)) {
        return false;
      }

      // 2) filter by split / muscle group if provided
      if (split.length > 0) {
        const exerciseMuscleGroups = [
          exercise.primaryMuscleGroup,
          ...(exercise.secondaryMuscleGroups ?? []),
        ].map((group) => group.toLowerCase());

        const hasMuscleGroup = split.some((splitGroup) =>
          exerciseMuscleGroups.includes(splitGroup.toLowerCase())
        );
        if (!hasMuscleGroup) return false;
      }

      // 3) search by name
      if (lowerSearch && !exercise.name.toLowerCase().includes(lowerSearch)) {
        return false;
      }

      return true;
    });
  }, [excludeIds, search, split]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70">
      <div className="flex flex-col max-h-[80vh] w-full max-w-md rounded-xl border border-border bg-card p-4 shadow-xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Add exercise to session
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full mb-3"
        />

        {/* Exercise list */}
        {/* <div className="flex max-h-72 flex-col gap-2 overflow-y-auto scroll"> */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto scroll max-h-[32rem] pr-3">
          {filteredExercises.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No exercises match your filters.
            </p>
          ) : (
            filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => onSelect(exercise.id)}
                className="w-full m-2 rounded-md border border-border bg-card/60 px-3 py-2 text-left text-sm text-foreground hover:bg-accent/20 hover:border-accent hover:text-accent-foreground"
              >
                <div>{exercise.name}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-1">
                  {formatExerciseMuscleLabel(exercise)}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onCreateExercise}
          className={`${buttonClassName} px-3 text-xs `}
        >
          Create New Exercise
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`${buttonClassName} py-2 text-xs`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
