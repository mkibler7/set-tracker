import Link from "next/link";
import React from "react";
import { Button } from "../ui/Button";
import { on } from "events";
import EditIcon from "./edit-icon";

type HeaderProps = {
  title: string;
  date: Date;
  isSession: boolean;
  onEditSplit?: () => void;
};

export default function Header({
  title,
  date,
  isSession,
  onEditSplit,
}: HeaderProps) {
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Button
          className="mb-4 rounded-md border border-border
             px-3 py-1 text-xs text-muted-foreground hover:bg-card/40"
        >
          ← Back
        </Button>
        <p className="text-sm bt-4 text-muted-foreground mb-2">
          Today&apos;s workout:
        </p>

        {/* Title + Edit button on one line */}
        <div className="mb-2 flex items-center gap-3">
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
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
    </div>
  );
}
