"use client";

import React from "react";
import EditIcon from "../icons/edit-icon";
import WorkoutDateEditor from "./WorkoutDateEditor";

type HeaderProps = {
  title: string;
  date: Date;
  isSession: boolean;
  onEditSplit?: () => void;
  onAddExercise?: () => void;

  // date editing (only for history edits)
  canEditDate?: boolean;
  onCommitDate?: (ymd: string) => void; // YYYY-MM-DD
};

export default function Header({
  title,
  date,
  isSession,
  onEditSplit,
  onAddExercise,
  canEditDate,
  onCommitDate,
}: HeaderProps) {
  return (
    <div>
      <div className="mb-4 mt-1 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <h1
            className="my-2 max-w-[80vw] truncate text-center text-2xl font-semibold tracking-tight text-foreground"
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

      <div className="mb-6 flex items-center justify-center">
        <WorkoutDateEditor
          date={date}
          canEdit={!!canEditDate}
          onCommitDate={(ymd) => onCommitDate?.(ymd)}
        />
      </div>
    </div>
  );
}
