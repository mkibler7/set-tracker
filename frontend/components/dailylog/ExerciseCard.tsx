"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import type { WorkoutExercise } from "@/types/workout";
import SetForm, { SetFormValues } from "@/components/dailylog/SetForm";
import ExercisePanel from "@/components/dailylog/ExercisePanel";
import InfoIcon from "@/components/icons/info-icon";
import SetActionsMenu from "@/components/dailylog/SetActionsMenu";

type ExerciseCardProps = {
  exercise: WorkoutExercise;
  resolvedName?: string;
  muscleLabel?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onRemove: () => void;
  onAddSet: (values: SetFormValues) => void;
  onUpdateSet: (setId: string, values: SetFormValues) => void;
  onDeleteSet: (setId: string) => void;
  onNotesChange: (notes: string) => void;
};

export default function ExerciseCard({
  exercise,
  resolvedName,
  muscleLabel,
  isExpanded,
  onToggleExpanded,
  onRemove,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
  onNotesChange,
}: ExerciseCardProps) {
  const router = useRouter();
  const hasSets = exercise.sets.length > 0;
  const [exerciseName, setExerciseName] = useState<string>("");
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [isAddingSet, setIsAddingSet] = useState(false);

  const displayName =
    exercise.exerciseName?.trim() || resolvedName?.trim() || "Unknown exercise";

  const totalVolume = useMemo(() => {
    return exercise.sets.reduce(
      (acc, s) => acc + (s.reps ?? 0) * (s.weight ?? 0),
      0,
    );
  }, [exercise.sets]);

  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Handle Open Details safely
  const isMongoObjectId = (v: string) => /^[a-fA-F0-9]{24}$/.test(v);

  const handleOpenDetails = () => {
    const id = exercise.exerciseId;

    console.log("Navigating to exercise details:", {
      exerciseId: id,
      exerciseName: exercise.exerciseName,
      isMongoObjectId: isMongoObjectId(id),
    });

    if (!isMongoObjectId(id)) {
      // Prevent hard crash + confirms the true value in console
      return;
    }

    router.push(`/exercises/${id}?fromDailyLog=true`);
  };

  function copySet(set: any) {
    onAddSet({
      reps: set.reps ?? 0,
      weight: set.weight ?? 0,
      volume: (set.reps ?? 0) * (set.weight ?? 0),
      rpe: set.rpe,
      tempo: set.tempo,
    });
  }

  return (
    <section
      className={[
        "rounded-lg p-4 shadow-sm border",
        hasSets
          ? "border-border bg-card/70"
          : "border-dashed border-border/70 bg-card/40",
      ].join(" ")}
    >
      {/* Header (tap to expand) */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggleExpanded();
        }}
        className="mb-3 w-full rounded-md text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold text-foreground">
                {displayName}
              </h2>

              {/* Info button - do NOT toggle expand */}
              <button
                type="button"
                onClick={(e) => {
                  stop(e);
                  handleOpenDetails();
                }}
                className="text-emerald-400 hover:text-emerald-500"
                aria-label="Exercise details"
              >
                <InfoIcon />
              </button>
            </div>

            {muscleLabel ? (
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                {muscleLabel}
              </p>
            ) : null}

            {/* Collapsed summary */}
            {!isExpanded && (
              <div className="mt-2 text-xs text-muted-foreground">
                {exercise.sets.length}{" "}
                {exercise.sets.length === 1 ? "set" : "sets"}
                {totalVolume > 0
                  ? ` • ${totalVolume.toLocaleString()} vol`
                  : ""}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Remove button - do NOT toggle expand */}
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                onRemove();
              }}
              className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-card/70"
            >
              Remove
            </button>

            {/* Chevron */}
            <span
              className={[
                "mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-card/40 text-muted-foreground transition-transform",
                isExpanded ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden
            >
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* Sets list */}
      {isExpanded && (
        <div className="space-y-2">
          {exercise.sets.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No sets logged yet. Add your first set below.
            </p>
          )}

          {exercise.sets.map((set) => (
            <div
              key={set.id}
              className="rounded-md border border-border bg-card/60 p-2.5 text-xs text-foreground"
            >
              {editingSetId === set.id ? (
                <SetForm
                  initialValues={{
                    reps: set.reps,
                    weight: set.weight,
                    volume: (set.reps ?? 0) * (set.weight ?? 0),
                    rpe: set.rpe,
                    tempo: set.tempo,
                  }}
                  submitLabel="Save"
                  onSave={(values) => {
                    onUpdateSet(set.id, values);
                    setEditingSetId(null);
                  }}
                  onCancel={() => setEditingSetId(null)}
                />
              ) : (
                <div className="flex items-center justify-between gap-3">
                  {/* compact row */}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {set.reps} × {set.weight} lb
                    </div>

                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      {set.rpe !== undefined ? (
                        <span>RPE {set.rpe}</span>
                      ) : null}
                      {set.tempo ? <span>Tempo {set.tempo}</span> : null}
                      <span>Vol {(set.reps ?? 0) * (set.weight ?? 0)}</span>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="flex shrink-0 gap-2">
                    <SetActionsMenu
                      onEdit={() => setEditingSetId(set.id)}
                      onCopy={() => copySet(set)}
                      onDelete={() => onDeleteSet(set.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add set toggle */}
      {isExpanded && (
        <>
          {isAddingSet ? (
            <div className="mt-3 rounded-md border border-border bg-card/70 p-3">
              <SetForm
                submitLabel="Add set"
                onSave={(values) => {
                  onAddSet(values);
                  setIsAddingSet(false);
                }}
                onCancel={() => setIsAddingSet(false)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingSetId(null);
                setIsAddingSet(true);
              }}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-card/70 sm:w-auto sm:justify-start"
            >
              + Add set
            </button>
          )}
        </>
      )}

      {/* Notes for this exercise */}
      {isExpanded && (
        <div className="mt-3">
          <ExercisePanel exercise={exercise} onNotesChange={onNotesChange} />
        </div>
      )}
    </section>
  );
}
