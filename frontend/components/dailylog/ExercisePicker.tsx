"use client";

import React, { useMemo, useState } from "react";
import type { Exercise } from "@/types/exercise";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";

type ExercisePickerProps = {
  /** If you're wrapping with FocusOverlay, you can keep isOpen for convenience */
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
    const lowerSearch = search.trim().toLowerCase();

    return exercises.filter((exercise) => {
      if (excludeIds.includes(exercise.id)) return false;

      if (split.length > 0) {
        const exerciseMuscleGroups = [
          exercise.primaryMuscleGroup,
          ...(exercise.secondaryMuscleGroups ?? []),
        ].map((g) => g.toLowerCase());

        const matchesSplit = split.some((sg) =>
          exerciseMuscleGroups.includes(sg.toLowerCase()),
        );
        if (!matchesSplit) return false;
      }

      if (lowerSearch && !exercise.name.toLowerCase().includes(lowerSearch)) {
        return false;
      }

      return true;
    });
  }, [exercises, excludeIds, search, split]);

  if (!isOpen) return null;

  return (
    <section className="w-full overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border/60 bg-background/10 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">
            Add exercise
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Search and tap an exercise to add it to your session.
          </p>
        </div>

        {/* Close icon button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-card/30
                     text-muted-foreground hover:bg-card/60 hover:text-foreground
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pt-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-md border border-border/70 bg-background/40 pl-4 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-5 pb-5 pt-4">
        <div className="rounded-lg border border-border/70 bg-background/25">
          <div className="max-h-[55vh] overflow-y-auto p-1">
            {loading ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">
                Loading exercises…
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">
                No exercises match your filters.
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {filteredExercises.map((exercise) => (
                  <li key={exercise.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(exercise.id)}
                      className="group flex w-full items-start justify-between gap-3 rounded-md px-3 py-2.5 text-left
                                 hover:bg-card/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {exercise.name}
                        </div>
                        <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {formatExerciseMuscleLabel(exercise)}
                        </div>
                      </div>

                      <div className="shrink-0 text-muted-foreground group-hover:text-emerald-300">
                        ›
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
      <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-background/10 px-5 py-4">
        {onCreateExercise && (
          <button
            type="button"
            onClick={onCreateExercise}
            className="rounded-md border border-border/70 bg-card/30 px-3 py-2 text-xs text-muted-foreground
                       hover:bg-card/60 hover:text-foreground"
          >
            Create New
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
        >
          Done
        </button>
      </div>
    </section>
  );
}
