"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import type { WorkoutExercise } from "@/types/workout";
import SetForm, { SetFormValues } from "@/components/dailylog/SetForm";
import ExercisePanel from "@/components/dailylog/ExercisePanel";
import InfoIcon from "@/components/icons/info-icon";
import { ExerciseAPI } from "@/lib/api/exercises";

type ExerciseCardProps = {
  exercise: WorkoutExercise;
  muscleLabel?: string;
  onRemove: () => void;
  onAddSet: (values: SetFormValues) => void;
  onUpdateSet: (setId: string, values: SetFormValues) => void;
  onDeleteSet: (setId: string) => void;
  onNotesChange: (notes: string) => void;
};

export default function ExerciseCard({
  exercise,
  muscleLabel,
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

  // Grab exerciseName
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const exDoc = await ExerciseAPI.get(exercise.exerciseId);
        if (!cancelled) setExerciseName(exDoc.name);
      } catch {
        if (!cancelled) setExerciseName("Unknown exercise");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exercise.exerciseId, exercise.exerciseName]);

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

  return (
    <section
      className={[
        "rounded-lg p-4 shadow-sm border",
        hasSets
          ? "border-border bg-card/70"
          : "border-dashed border-border/70 bg-card/40",
      ].join(" ")}
    >
      {/* Header */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              {exerciseName}
            </h2>
            <button
              type="button"
              onClick={handleOpenDetails}
              className="text-emerald-400 hover:text-emerald-500"
            >
              <InfoIcon />
            </button>
          </div>
          {muscleLabel ? (
            <p className="text-[11px] sm:text-xs uppercase tracking-wide text-muted-foreground">
              {muscleLabel}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="self-start rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-card/70"
        >
          Remove
        </button>
      </div>

      {/* Sets list */}
      <div className="space-y-2">
        {exercise.sets.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No sets logged yet. Add your first set below.
          </p>
        )}

        {exercise.sets.map((set) => (
          <div
            key={set.id}
            className="rounded-md border border-border bg-card/60 p-2.5 sm:p-3 text-xs text-foreground"
          >
            {editingSetId === set.id ? (
              <SetForm
                initialValues={{
                  reps: set.reps,
                  weight: set.weight,
                  volume: set.reps * set.weight,
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
              <>
                {/* stats + actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {/* stats – wrap nicely on small screens */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <span className="text-muted-foreground">Reps:</span>{" "}
                      {set.reps}
                    </span>
                    <span>
                      <span className="text-muted-foreground">Weight:</span>{" "}
                      {set.weight} lb
                    </span>

                    {set.rpe !== undefined && (
                      <span>
                        <span className="text-muted-foreground">RPE:</span>{" "}
                        {set.rpe}
                      </span>
                    )}

                    {set.tempo && (
                      <span>
                        <span className="text-muted-foreground">Tempo:</span>{" "}
                        {set.tempo}
                      </span>
                    )}

                    <span>
                      <span className="text-muted-foreground">Volume:</span>{" "}
                      {set.reps * set.weight}
                    </span>
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditingSetId(set.id)}
                      className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-card/70"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSet(set.id)}
                      className="rounded-md border border-red-900/70 bg-red-950/50 px-2 py-1 text-[11px] text-red-200 hover:bg-red-900/70"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add set toggle */}
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
          className="
      mt-3 inline-flex items-center justify-center
      w-full rounded-md border border-dashed border-border
      px-3 py-1.5 text-xs text-muted-foreground
      hover:bg-card/70
      sm:w-auto sm:justify-start
    "
        >
          + Add set
        </button>
      )}

      {/* Notes for this exercise */}
      <div className="mt-3">
        <ExercisePanel exercise={exercise} onNotesChange={onNotesChange} />
      </div>
    </section>
  );
}
