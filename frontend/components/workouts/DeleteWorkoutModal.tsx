"use client";

import React from "react";

type DeleteWorkoutModalProps = {
  isOpen: boolean;
  workoutName?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteWorkoutModal({
  isOpen,
  workoutName,
  onConfirm,
  onCancel,
}: DeleteWorkoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Delete workout
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        {/* Body */}
        <p className="mb-4 text-xs text-muted-foreground">
          Are you sure you want to permanently delete this workout
          {workoutName ? (
            <>
              {" "}
              <span className="font-medium text-foreground">
                “{workoutName}”
              </span>
            </>
          ) : null}
          ? This action cannot be undone.
        </p>

        {/* Footer buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-card/40"
          >
            Keep workout
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
          >
            Delete workout
          </button>
        </div>
      </div>
    </div>
  );
}
