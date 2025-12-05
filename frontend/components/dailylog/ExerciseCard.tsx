"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { WorkoutExercise } from "@/types/workout";
import SetForm, { SetFormValues } from "@/components/dailylog/SetForm";
import ExercisePanel from "@/components/dailylog/ExercisePanel";
import InfoIcon from "@/components/icons/info-icon";

type ExerciseCardProps = {
  exercise: WorkoutExercise;
  onRemove: () => void;
  onAddSet: (values: SetFormValues) => void;
  onUpdateSet: (setId: string, values: SetFormValues) => void;
  onDeleteSet: (setId: string) => void;
  onNotesChange: (notes: string) => void;
};

export default function ExerciseCard({
  exercise,
  onRemove,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
  onNotesChange,
}: ExerciseCardProps) {
  const router = useRouter();
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [isAddingSet, setIsAddingSet] = useState(false);

  const handleOpenDetails = () => {
    router.push(`/exercises/${exercise.id}?fromDailyLog=true`);
  };

  let muscleLabel: string;
  if (!exercise.secondaryMuscleGroups) {
    muscleLabel = exercise.primaryMuscleGroup;
  } else {
    muscleLabel =
      exercise.primaryMuscleGroup +
      " / " +
      exercise.secondaryMuscleGroups.join(" / ");
  }

  return (
    <section className="rounded-lg border border-border bg-card/60 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-semibold text-foreground">
              {exercise.name}
            </h2>
            <button
              type="button"
              onClick={handleOpenDetails}
              className="text-emerald-400 hover:text-emerald-500"
            >
              <InfoIcon />
            </button>
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {muscleLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-card/70"
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
            className="rounded-md border border-border bg-card/60 p-3 text-xs text-foreground"
          >
            {editingSetId === set.id ? (
              <SetForm
                initialValues={{
                  reps: set.reps,
                  weight: set.weight,
                  volume: set.volume,
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
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-3">
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
                      {set.volume}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
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
          className="mt-3 inline-flex items-center rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-card/70"
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
