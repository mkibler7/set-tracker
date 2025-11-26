"use client";

import React, { useState } from "react";
import ExercisePicker from "@/components/workouts/ExercisePicker";
import SetForm, { SetFormValues } from "@/components/workouts/SetForm";

type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  volume: number;
  rpe?: number;
  tempo?: string;
  notes?: string;
};

type WorkoutExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: WorkoutSet[];
};

type CurrentWorkout = {
  date: string;
  exercises: WorkoutExercise[];
};

const mockExercises: WorkoutExercise[] = [
  { id: "back-squat", name: "Back Squat", muscleGroup: "Quads", sets: [] },
  { id: "bench-press", name: "Bench Press", muscleGroup: "Chest", sets: [] },
  {
    id: "deadlift",
    name: "Deadlift",
    muscleGroup: "Hamstrings/Back",
    sets: [],
  },
  { id: "ohp", name: "Overhead Press", muscleGroup: "Shoulders", sets: [] },
];

const createId = () => Math.random().toString(36).slice(2);

export default function StartWorkoutPage() {
  const [currentWorkout, setCurrentWorkout] = useState<CurrentWorkout>({
    date: new Date().toISOString(),
    exercises: [],
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [addingForExerciseId, setAddingForExerciseId] = useState<string | null>(
    null
  );
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const handleAddExercise = (exerciseId: string) => {
    const exerciseTemplate = mockExercises.find((e) => e.id === exerciseId);
    if (!exerciseTemplate) return;

    setCurrentWorkout((prev) => {
      // avoid duplicates
      if (prev.exercises.some((e) => e.id === exerciseTemplate.id)) {
        return prev;
      }
      return {
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            ...exerciseTemplate,
            sets: [],
          },
        ],
      };
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.id !== exerciseId),
    }));
  };

  const handleAddSet = (exerciseId: string, values: SetFormValues) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: createId(),
                  reps: values.reps,
                  weight: values.weight,
                  volume: values.volume ?? values.reps * values.weight,
                  rpe: values.rpe,
                  tempo: values.tempo,
                  notes: values.notes,
                },
              ],
            }
          : ex
      ),
    }));
  };

  const handleUpdateSet = (
    exerciseId: string,
    setId: string,
    values: SetFormValues
  ) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId
                  ? {
                      ...set,
                      reps: values.reps,
                      weight: values.weight,
                      volume: values.volume ?? values.reps * values.weight,
                      rpe: values.rpe,
                      tempo: values.tempo,
                      notes: values.notes,
                    }
                  : set
              ),
            }
          : ex
      ),
    }));
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.filter((set) => set.id !== setId),
            }
          : ex
      ),
    }));
  };

  const hasExercises = currentWorkout.exercises.length > 0;

  const formattedDate = new Date(currentWorkout.date).toLocaleDateString(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Today&apos;s workout</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Start Workout
          </h1>
          <p className="text-sm text-slate-400">{formattedDate}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="mt-3 inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-800 sm:mt-0"
        >
          + Add Exercise
        </button>
      </div>

      {/* Empty state */}
      {!hasExercises && (
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
          No exercises added yet. Click{" "}
          <span className="font-medium text-slate-100">“Add Exercise”</span> to
          start building today&apos;s session.
        </div>
      )}

      {/* Exercises + sets */}
      <div className="space-y-4">
        {currentWorkout.exercises.map((exercise) => (
          <section
            key={exercise.id}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-slate-50">
                  {exercise.name}
                </h2>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {exercise.muscleGroup}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExercise(exercise.id)}
                className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              >
                Remove
              </button>
            </div>

            {/* Sets list */}
            <div className="space-y-2">
              {exercise.sets.length === 0 && (
                <p className="text-xs text-slate-500">
                  No sets logged yet. Add your first set below.
                </p>
              )}

              {exercise.sets.map((set) => (
                <div
                  key={set.id}
                  className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200"
                >
                  {editingSetId === set.id ? (
                    <SetForm
                      initialValues={{
                        reps: set.reps,
                        weight: set.weight,
                        volume: set.volume,
                        rpe: set.rpe,
                        tempo: set.tempo,
                        notes: set.notes,
                      }}
                      submitLabel="Save"
                      onSave={(values) => {
                        handleUpdateSet(exercise.id, set.id, values);
                        setEditingSetId(null);
                      }}
                      onCancel={() => setEditingSetId(null)}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-3">
                          <span>
                            <span className="text-slate-500">Reps:</span>{" "}
                            {set.reps}
                          </span>
                          <span>
                            <span className="text-slate-500">Weight:</span>{" "}
                            {set.weight} lb
                          </span>
                          {set.rpe !== undefined && (
                            <span>
                              <span className="text-slate-500">RPE:</span>{" "}
                              {set.rpe}
                            </span>
                          )}
                          {set.tempo && (
                            <span>
                              <span className="text-slate-500">Tempo:</span>{" "}
                              {set.tempo}
                            </span>
                          )}
                          <span>
                            <span className="text-slate-500">Volume:</span>{" "}
                            {set.volume}
                          </span>
                        </div>
                        {set.notes && (
                          <p className="text-[11px] text-slate-400">
                            Notes: {set.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSetId(set.id)}
                          className="rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSet(exercise.id, set.id)}
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

            {/* Add set form toggle */}
            {addingForExerciseId === exercise.id ? (
              <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/70 p-3">
                <SetForm
                  submitLabel="Add set"
                  onSave={(values) => {
                    handleAddSet(exercise.id, values);
                    setAddingForExerciseId(null);
                  }}
                  onCancel={() => setAddingForExerciseId(null)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingSetId(null);
                  setAddingForExerciseId(exercise.id);
                }}
                className="mt-3 inline-flex items-center rounded-md border border-dashed border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
              >
                + Add set
              </button>
            )}
          </section>
        ))}
      </div>
      {/* Exercise picker modal */}
      <ExercisePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(id) => handleAddExercise(id)}
      />
    </main>
  );
}
