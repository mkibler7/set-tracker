"use client";

import React from "react";

type DeleteExerciseModalProps = {
  isOpen: boolean;
  exerciseName?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteExerciseModal({
  isOpen,
  exerciseName,
  onCancel,
  onConfirm,
}: DeleteExerciseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Remove exercise?
        </h2>

        <p className="mb-4 text-sm text-muted-foreground">
          This will remove{" "}
          <span className="font-medium text-foreground">
            {exerciseName ?? "this exercise"}
          </span>{" "}
          and all of its logged sets from today&apos;s workout.
        </p>

        <div className="flex items-center justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:bg-card/60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-3 py-1.5 font-medium text-slate-950 hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
