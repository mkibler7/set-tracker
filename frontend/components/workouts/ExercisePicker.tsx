"use client";

import React from "react";

type ExerciseOption = {
  id: string;
  name: string;
  muscleGroup: string;
};

type ExercisePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  exercises?: ExerciseOption[];
  onSelect: (exerciseId: string) => void;
};

const defaultExercises: ExerciseOption[] = [
  { id: "back-squat", name: "Back Squat", muscleGroup: "Quads" },
  { id: "bench-press", name: "Bench Press", muscleGroup: "Chest" },
  { id: "deadlift", name: "Deadlift", muscleGroup: "Hamstrings/Back" },
  { id: "ohp", name: "Overhead Press", muscleGroup: "Shoulders" },
];

export default function ExercisePicker({
  isOpen,
  onClose,
  exercises = defaultExercises,
  onSelect,
}: ExercisePickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-50">Add exercise</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-900"
          >
            Close
          </button>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                onSelect(ex.id);
                // keep picker open so user can add multiple in a row
              }}
              className="flex w-full flex-col items-start rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-left text-xs hover:bg-slate-800"
            >
              <span className="font-medium text-slate-50">{ex.name}</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                {ex.muscleGroup}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </div>
  );
}
