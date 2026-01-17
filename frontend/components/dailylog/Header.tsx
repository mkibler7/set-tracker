"use client";

import React from "react";
import EditIcon from "../icons/edit-icon";

type HeaderProps = {
  title: string;
  date: Date;
  isSession: boolean;
  onEditSplit?: () => void;
  onAddExercise?: () => void;
};

export default function Header({
  title,
  date,
  isSession,
  onEditSplit,
  onAddExercise,
}: HeaderProps) {
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* Centered title + edit + add exercise */}
      <div className="mb-4 mt-1 flex flex-col items-center gap-3">
        {/* Title + edit */}
        <div className="flex items-center gap-2">
          <h1
            className="max-w-[80vw] truncate text-center text-2xl font-semibold tracking-tight text-foreground my-2"
            title={title}
          >
            {title}
          </h1>

          {isSession && onEditSplit && (
            <button
              type="button"
              onClick={onEditSplit}
              className="inline-flex w-auto items-center justify-center rounded border border-emerald-500 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
            >
              <EditIcon />
            </button>
          )}
        </div>

        {/* Add Exercise – centered, with a sensible max width */}
        {isSession && onAddExercise && (
          <button
            type="button"
            onClick={onAddExercise}
            className="primary-button w-full max-w-xs sm:max-w-sm"
          >
            + Add Exercise
          </button>
        )}
      </div>

      {/* Centered date line */}
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {formattedDate} • Workout
      </p>
    </div>
  );
}
