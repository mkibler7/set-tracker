"use client";

import React, { useState, useMemo } from "react";
import ExercisePicker from "@/components/dailylog/ExercisePicker";
import ExerciseCard from "@/components/dailylog/ExerciseCard";
import DeleteExerciseModal from "./DeleteExerciseModal";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import type { WorkoutExercise } from "@/types/workout";
import type { Exercise } from "@/types/exercise";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";
import { ADDRCONFIG } from "dns";

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
    (s) => s.updateSessionExerciseNotes
  );
  const addSessionSet = useWorkoutStore((s) => s.addSessionSet);
  const updateSessionSet = useWorkoutStore((s) => s.updateSessionSet);
  const deleteSessionSet = useWorkoutStore((s) => s.deleteSessionSet);

  const upsertEditExercise = useWorkoutStore((s) => s.upsertEditExercise);
  const removeEditExercise = useWorkoutStore((s) => s.removeEditExercise);
  const updateEditExerciseNotes = useWorkoutStore(
    (s) => s.updateEditExerciseNotes
  );
  const addEditSet = useWorkoutStore((s) => s.addEditSet);
  const updateEditSet = useWorkoutStore((s) => s.updateEditSet);
  const deleteEditSet = useWorkoutStore((s) => s.deleteEditSet);

  const draft = mode === "edit" ? editDraft : sessionDraft;
  const sessionExercises = draft?.exercises ?? [];

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const exerciseToDelete = pendingDeleteId
    ? sessionExercises.find(
        (exercise) => exercise.exerciseId === pendingDeleteId
      )
    : undefined;

  // const hasExercises = sessionExercises.length > 0;
  const excludedIds = useMemo(
    () => sessionExercises.map((exercise) => exercise.exerciseId),
    [sessionExercises]
  );

  const catalogById = useMemo(() => {
    return Object.fromEntries(exerciseCatalog.map((e) => [e.id, e]));
  }, [exerciseCatalog]);

  const exerciseCount = sessionExercises.length;
  const hasExercises = exerciseCount > 0;

  const setCount = useMemo(
    () =>
      sessionExercises.reduce(
        (total, exercise) => total + exercise.sets.length,
        0
      ),
    [sessionExercises]
  );

  const catalogByName = useMemo(() => {
    return Object.fromEntries(
      exerciseCatalog
        .filter((e) => typeof e.name === "string" && e.name.trim().length > 0)
        .map((e) => [e.name.trim().toLowerCase(), e])
    );
  }, [exerciseCatalog]);

  const totalVolume = useMemo(() => {
    return sessionExercises.reduce<number>((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce<number>((acc, set) => {
        const weight = set.weight ?? 0;
        const reps = set.reps ?? 0;
        return acc + weight * reps;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }, [sessionExercises]);

  // IMPORTANT: id here MUST be the Mongo exercise id (exercise.id)
  const handleSelectExercise = (exerciseId: string) => {
    const base = exerciseCatalog.find((exercise) => exercise.id === exerciseId);
    if (!base) return;

    const workoutExercise: WorkoutExercise = {
      exerciseId: base.id, // MongoDB id
      exerciseName: base.name,
      notes: "",
      sets: [],
    };

    if (mode === "edit") upsertEditExercise(workoutExercise);
    else upsertSessionExercise(workoutExercise);

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
          {sessionExercises.map((exercise) => {
            const id = exercise.exerciseId;
            const metaById = catalogById[id];

            const nameKey =
              typeof exercise.exerciseName === "string"
                ? exercise.exerciseName.trim().toLowerCase()
                : "";

            const meta =
              metaById ?? (nameKey ? catalogByName[nameKey] : undefined);

            return (
              <ExerciseCard
                key={id}
                exercise={exercise}
                muscleLabel={meta ? formatExerciseMuscleLabel(meta) : ""}
                onRemove={() => setPendingDeleteId(id)}
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
            );
          })}
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
          exercises={exerciseCatalog}
          loading={exercisesCatalogLoading}
        />
      )}

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
