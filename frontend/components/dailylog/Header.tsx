"use client";

import React from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import EditIcon from "./edit-icon";
import PageBackButton from "@/components/shared/PageBackButton";

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
  const router = useRouter();

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isToday = date.toDateString() === new Date().toDateString();
  const shortLabelDate = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
  const headerPrefix = isToday
    ? "Today's Workout"
    : `${shortLabelDate}'s Workout`;

  return (
    // <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <PageBackButton />
      <p className="text-sm mb-2 tracking-tight text-muted-foreground">
        {headerPrefix}
      </p>

      {/* Title + Edit button on one line */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>

          {isSession && onEditSplit && (
            <button
              type="button"
              onClick={onEditSplit}
              className="rounded border border-emerald-500 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
            >
              <EditIcon />
            </button>
          )}
        </div>

        {/* 🔹 Right-aligned "+ Add Exercise" on session views */}
        {isSession && onAddExercise && (
          <button
            type="button"
            onClick={onAddExercise}
            className="primary-button"
          >
            + Add Exercise
          </button>
        )}
      </div>

      <p className="mb-6 text-sm text-muted-foreground">{formattedDate}</p>
    </div>
    // </div>
  );
}
