"use client";

import React, { useMemo, useRef, useState } from "react";
import ExercisePicker from "@/components/dailylog/ExercisePicker";
import ExerciseCard from "@/components/dailylog/ExerciseCard";
import DeleteExerciseModal from "./DeleteExerciseModal";
import FocusOverlay from "@/components/ui/FocusOverlay";

import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import type { WorkoutExercise } from "@/types/workout";
import type { Exercise } from "@/types/exercise";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";

type SessionViewProps = {
  mode: "session" | "edit";
  selectedMuscleGroups: string[];
  fromWorkoutId?: string | null;

  isPickerOpen: boolean;
  onClosePicker: () => void;
  onOpenPicker: () => void;

  onSaveWorkout?: () => void;
  exerciseCatalog: Exercise[];
  exercisesCatalogLoading?: boolean;
};

export default function SessionView({
  mode,
  selectedMuscleGroups,
  isPickerOpen,
  onClosePicker,
  onOpenPicker,
  onSaveWorkout,
  exerciseCatalog,
  exercisesCatalogLoading,
}: SessionViewProps) {
  const sessionDraft = useWorkoutStore((s) => s.sessionDraft);
  const editDraft = useWorkoutStore((s) => s.editDraft);

  const upsertSessionExercise = useWorkoutStore((s) => s.upsertSessionExercise);
  const removeSessionExercise = useWorkoutStore((s) => s.removeSessionExercise);
  const updateSessionExerciseNotes = useWorkoutStore(
    (s) => s.updateSessionExerciseNotes,
  );
  const addSessionSet = useWorkoutStore((s) => s.addSessionSet);
  const updateSessionSet = useWorkoutStore((s) => s.updateSessionSet);
  const deleteSessionSet = useWorkoutStore((s) => s.deleteSessionSet);

  const upsertEditExercise = useWorkoutStore((s) => s.upsertEditExercise);
  const removeEditExercise = useWorkoutStore((s) => s.removeEditExercise);
  const updateEditExerciseNotes = useWorkoutStore(
    (s) => s.updateEditExerciseNotes,
  );
  const addEditSet = useWorkoutStore((s) => s.addEditSet);
  const updateEditSet = useWorkoutStore((s) => s.updateEditSet);
  const deleteEditSet = useWorkoutStore((s) => s.deleteEditSet);

  const draft = mode === "edit" ? editDraft : sessionDraft;
  const sessionExercises = draft?.exercises ?? [];

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  );

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const exerciseToDelete = pendingDeleteId
    ? sessionExercises.find((ex) => ex.exerciseId === pendingDeleteId)
    : undefined;

  const excludedIds = useMemo(
    () => sessionExercises.map((ex) => ex.exerciseId),
    [sessionExercises],
  );

  const catalogById = useMemo(() => {
    return Object.fromEntries(exerciseCatalog.map((e) => [e.id, e]));
  }, [exerciseCatalog]);

  const catalogByName = useMemo(() => {
    return Object.fromEntries(
      exerciseCatalog
        .filter((e) => typeof e.name === "string" && e.name.trim().length > 0)
        .map((e) => [e.name.trim().toLowerCase(), e]),
    );
  }, [exerciseCatalog]);

  const exerciseCount = sessionExercises.length;
  const hasExercises = exerciseCount > 0;

  const setCount = useMemo(() => {
    return sessionExercises.reduce((total, ex) => total + ex.sets.length, 0);
  }, [sessionExercises]);

  const totalVolume = useMemo(() => {
    return sessionExercises.reduce<number>((total, ex) => {
      const exVol = ex.sets.reduce<number>((acc, set) => {
        const weight = set.weight ?? 0;
        const reps = set.reps ?? 0;
        return acc + weight * reps;
      }, 0);
      return total + exVol;
    }, 0);
  }, [sessionExercises]);

  // IMPORTANT: exerciseId here MUST be Mongo exercise id (exercise.id)
  const handleSelectExercise = (exerciseId: string) => {
    const base = exerciseCatalog.find((e) => e.id === exerciseId);
    if (!base) return;

    const workoutExercise: WorkoutExercise = {
      exerciseId: base.id,
      exerciseName: base.name,
      notes: "",
      sets: [],
    };

    if (mode === "edit") upsertEditExercise(workoutExercise);
    else upsertSessionExercise(workoutExercise);

    setExpandedExerciseId(base.id);

    requestAnimationFrame(() => {
      cardRefs.current[base.id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    onClosePicker();
  };

  function getCompactMuscleLabel(meta?: Exercise) {
    if (!meta) return "";
    const primary = meta.primaryMuscleGroup;
    const secondaries = meta.secondaryMuscleGroups ?? [];
    const firstSecondary = secondaries[0];
    const hasMore = secondaries.length > 1;

    const resolvedName =
      typeof meta?.name === "string" && meta.name.trim() ? meta.name : "";

    if (!firstSecondary) return primary;
    return `${primary} / ${firstSecondary}${hasMore ? " / …" : ""}`;
  }

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
            className="font-medium text-foreground underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            Add Exercise
          </button>{" "}
          to start building today&apos;s session.
        </div>
      )}

      {/* Exercises list */}
      {hasExercises && (
        <div className="space-y-4">
          {sessionExercises.map((exercise) => {
            const id = exercise.exerciseId;
            const metaById = catalogById[id];

            const nameKey =
              typeof exercise.exerciseName === "string"
                ? exercise.exerciseName.trim().toLowerCase()
                : "";

            const meta =
              metaById ?? (nameKey ? catalogByName[nameKey] : undefined);

            const resolvedName =
              typeof meta?.name === "string" && meta.name.trim()
                ? meta.name
                : "";

            const isExpanded = expandedExerciseId === id;

            return (
              <div
                key={id}
                ref={(el) => {
                  cardRefs.current[id] = el;
                }}
              >
                <ExerciseCard
                  exercise={exercise}
                  resolvedName={resolvedName}
                  isExpanded={isExpanded}
                  onToggleExpanded={() =>
                    setExpandedExerciseId((cur) => (cur === id ? null : id))
                  }
                  muscleLabel={
                    meta
                      ? isExpanded
                        ? formatExerciseMuscleLabel(meta)
                        : getCompactMuscleLabel(meta)
                      : ""
                  }
                  onRemove={() => {
                    setPendingDeleteId(id);
                    if (expandedExerciseId === id) setExpandedExerciseId(null);
                  }}
                  onAddSet={(values) =>
                    mode === "edit"
                      ? addEditSet(id, values)
                      : addSessionSet(id, values)
                  }
                  onUpdateSet={(setId, values) =>
                    mode === "edit"
                      ? updateEditSet(id, setId, values)
                      : updateSessionSet(id, setId, values)
                  }
                  onDeleteSet={(setId) =>
                    mode === "edit"
                      ? deleteEditSet(id, setId)
                      : deleteSessionSet(id, setId)
                  }
                  onNotesChange={(notes) =>
                    mode === "edit"
                      ? updateEditExerciseNotes(id, notes)
                      : updateSessionExerciseNotes(id, notes)
                  }
                />
              </div>
            );
          })}

          {/* Bottom Add Exercise CTA */}
          <button
            type="button"
            onClick={onOpenPicker}
            aria-label="Add exercise"
            className="group w-full rounded-lg border border-dashed border-border/70 bg-card/30 transition-colors hover:bg-card/45 active:bg-card/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <div className="flex items-center justify-center gap-2 py-5 sm:py-7">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/20 text-xl text-muted-foreground transition-colors group-hover:text-foreground">
                +
              </div>
              <div className="text-sm font-medium text-foreground">
                Add exercise
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Picker Overlay (FocusOverlay owns backdrop + blur + centering) */}
      <FocusOverlay
        open={isPickerOpen}
        onClose={onClosePicker}
        maxWidthClassName="max-w-lg"
      >
        <ExercisePicker
          isOpen={isPickerOpen}
          onClose={onClosePicker}
          onSelect={handleSelectExercise}
          excludeIds={excludedIds}
          split={selectedMuscleGroups}
          exercises={exerciseCatalog}
          loading={exercisesCatalogLoading}
        />
      </FocusOverlay>

      {/* Delete confirmation */}
      <DeleteExerciseModal
        isOpen={!!pendingDeleteId}
        exerciseName={exerciseToDelete?.exerciseName ?? ""}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            if (mode === "edit") removeEditExercise(pendingDeleteId);
            else removeSessionExercise(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />

      {/* Spacer so the last card isn't hidden behind the fixed bar (mobile only) */}
      <div className="h-16 md:hidden" aria-hidden />

      {/* Desktop breathing room above footer */}
      <div className="hidden md:block h-6" aria-hidden />

      {/* Footer summary + Save */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur md:static md:z-auto md:border-0 md:bg-transparent md:backdrop-blur-0">
        <div className="mx-auto max-w-3xl px-4 py-3 md:px-0 md:py-0">
          <div className="flex items-center justify-between gap-3">
            {/* Summary */}
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">
                {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}{" "}
                • {setCount} {setCount === 1 ? "set" : "sets"}
              </div>
              {totalVolume > 0 && (
                <div className="truncate text-xs text-muted-foreground">
                  {totalVolume.toLocaleString()} total volume
                </div>
              )}
            </div>

            {/* Save */}
            <button
              type="button"
              onClick={onSaveWorkout}
              className="primary-button shrink-0 px-5"
              disabled={!onSaveWorkout}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
