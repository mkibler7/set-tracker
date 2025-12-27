"use client";

import React, { useState, useMemo } from "react";
import type { Exercise } from "@/types/exercise";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";

type ExercisePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onCreateExercise?: () => void;
  excludeIds?: string[];
  split?: string[];
  exercises: Exercise[];
  loading?: boolean;
};

export default function ExercisePicker({
  isOpen,
  onClose,
  onSelect,
  onCreateExercise,
  excludeIds = [],
  split = [],
  exercises,
  loading,
}: ExercisePickerProps) {
  const [search, setSearch] = useState("");

  const filteredExercises = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return exercises.filter((exercise) => {
      if (excludeIds.includes(exercise.id)) return false;

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

      if (lowerSearch && !exercise.name.toLowerCase().includes(lowerSearch)) {
        return false;
      }

      return true;
    });
  }, [exercises, excludeIds, search, split]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70">
      <div className="mx-4 w-full flex flex-col overflow-hidden rounded-2xl bg-card shadow-xl max-w-xs sm:max-w-sm md:max-w-md">
        {/* Header */}
        <div className="px-3 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 className="text-[13px] font-semibold text-foreground sm:text-sm my-2 ml-2">
              Add exercise to session
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-muted-foreground hover:text-foreground sm:text-xs"
            >
              Close
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 sm:text-sm"
          />
        </div>

        {/* List area */}
        <div className="px-4 pb-3 text-[13px] sm:text-sm scroll">
          <div className="rounded-lg border border-border bg-background/40 px-1 sm:px-1.5">
            <div className="max-h-[45vh] overflow-y-auto sm:max-h-[55vh] pr-2 pt-1 pb-1 sm:pt-2 sm:pb-2">
              {loading ? (
                <p>Loading exercises..</p>
              ) : filteredExercises.length === 0 ? (
                <p className="px-2 py-3 text-[11px] text-muted-foreground sm:text-xs">
                  No exercises match your filters.
                </p>
              ) : (
                <ul className="divide-y divide-border/40">
                  {filteredExercises.map((exercise) => (
                    <li key={exercise.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(exercise.id)}
                        className="w-full rounded-md px-3 py-2.5 text-left text-[13px] text-foreground
                                   hover:bg-accent/15 hover:text-accent-foreground
                                   focus:outline-none focus:ring-1 focus:ring-accent/60 sm:text-sm"
                      >
                        <div className="truncate font-medium">
                          {exercise.name}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                          {formatExerciseMuscleLabel(exercise)}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 pb-3 pt-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            {onCreateExercise && (
              <button
                type="button"
                onClick={onCreateExercise}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground hover:border-accent hover:bg-accent/10 hover:text-accent-foreground sm:text-xs"
              >
                Create New Exercise
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="primary-button w-full text-[11px] sm:text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
