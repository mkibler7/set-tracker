"use client";

import React from "react";
import EditIcon from "../icons/edit-icon";
import WorkoutDateEditor from "./WorkoutDateEditor";

type HeaderProps = {
  title: string;
  date: Date;
  isSession: boolean;
  onEditSplit?: () => void;

  canEditDate?: boolean;
  onCommitDate?: (ymd: string) => void;
};

export default function Header({
  title,
  date,
  isSession,
  onEditSplit,
  canEditDate,
  onCommitDate,
}: HeaderProps) {
  const canEditSplit = isSession && !!onEditSplit;

  return (
    <div>
      <div className="mb-4 mt-1 flex flex-col items-center gap-3">
        {/* Title row */}
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-[1fr_auto_auto_1fr] items-center gap-x-2">
            {/* left spacer keeps the title centered */}
            <div />

            <h1
              className="my-2 max-w-[70vw] truncate text-center text-2xl font-semibold tracking-tight text-foreground"
              title={title}
            >
              {title}
            </h1>

            {canEditSplit && (
              <button
                type="button"
                onClick={onEditSplit}
                aria-label="Edit split"
                title="Edit split"
                className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-border/60 bg-card/30
                   text-muted-foreground hover:bg-card/60 hover:text-emerald-400 focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-emerald-500/40 transition-colors"
              >
                <EditIcon />
              </button>
            )}

            {/* right spacer balances the grid (optional but keeps symmetry) */}
            <div />
          </div>
        </div>
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
