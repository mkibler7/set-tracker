"use client";

import React from "react";
import EditIcon from "../icons/edit-icon";

type Props = {
  date: Date;
  canEdit: boolean; // only true when editing history
  onCommitDate: (ymd: string) => void; // YYYY-MM-DD (you already convert to UTC noon in DailyLogClientPage)
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

// YYYY-MM-DD in UTC to avoid day shift
function toYYYYMMDDUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  return `${y}-${m}-${d}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function daysInMonth(year: number, month01to12: number) {
  return new Date(year, month01to12, 0).getDate();
}

function isValidYmd(ymd: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  const [y, m, d] = ymd.split("-").map(Number);
  if (m < 1 || m > 12) return false;
  const maxD = daysInMonth(y, m);
  if (d < 1 || d > maxD) return false;
  return true;
}

export default function WorkoutDateEditor({
  date,
  canEdit,
  onCommitDate,
}: Props) {
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(toYYYYMMDDUTC(date));

  // Keep value synced when parent date changes (load different workout)
  React.useEffect(() => {
    setValue(toYYYYMMDDUTC(date));
  }, [date]);

  const baseInput =
    "h-9 w-[64px] rounded-md border border-border bg-card/40 px-2 text-sm text-foreground " +
    "outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25";

  const baseYearInput =
    "h-9 w-[86px] rounded-md border border-border bg-card/40 px-2 text-sm text-foreground " +
    "outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25";

  const btn =
    "inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";

  function commit(nextYmd: string) {
    if (!isValidYmd(nextYmd)) return;
    onCommitDate(nextYmd);
    setOpen(false);
  }

  function normalizeAndCommit() {
    // normalize month/day quickly (no calendar UI)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;

    let [y, m, d] = value.split("-").map(Number);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d))
      return;

    // reasonable clamps
    y = clamp(y, 2000, 2100);
    m = clamp(m, 1, 12);
    const maxD = daysInMonth(y, m);
    d = clamp(d, 1, maxD);

    const normalized = `${y}-${pad2(m)}-${pad2(d)}`;
    setValue(normalized);
    commit(normalized);
  }

  function cancel() {
    setValue(toYYYYMMDDUTC(date));
    setOpen(false);
  }

  if (!canEdit) {
    return (
      <span className="text-sm text-muted-foreground">{formattedDate}</span>
    );
  }

  // Display mode: plain text + small edit icon (NO box/pill)
  if (!open) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>{formattedDate}</span>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded border border-border bg-card/30 px-2 py-1 text-xs hover:bg-card/50"
          title="Edit date"
        >
          <EditIcon />
        </button>
      </div>
    );
  }

  // Edit mode: inline dark editor (NO calendar UI, NO outer pill)
  const safeValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : toYYYYMMDDUTC(date);

  const [yStr, mStr, dStr] = safeValue.split("-");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="flex items-center">
        <input
          aria-label="Month"
          inputMode="numeric"
          placeholder="MM"
          value={mStr}
          onChange={(e) => {
            const mm = e.target.value.replace(/[^\d]/g, "").slice(0, 2);
            setValue(`${yStr}-${mm.padStart(2, "0")}-${dStr}`);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") normalizeAndCommit();
            if (e.key === "Escape") cancel();
          }}
          className="h-8 w-[44px] rounded-md border border-border/70 bg-card/25 px-2 text-sm text-foreground
                     outline-none transition-colors hover:bg-card/35
                     focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
        />

        <span className="select-none px-1 text-sm text-muted-foreground/60">
          /
        </span>

        <input
          aria-label="Day"
          inputMode="numeric"
          placeholder="DD"
          value={dStr}
          onChange={(e) => {
            const dd = e.target.value.replace(/[^\d]/g, "").slice(0, 2);
            setValue(`${yStr}-${mStr}-${dd.padStart(2, "0")}`);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") normalizeAndCommit();
            if (e.key === "Escape") cancel();
          }}
          className="h-8 w-[44px] rounded-md border border-border/70 bg-card/25 px-2 text-sm text-foreground text-center
                     outline-none transition-colors hover:bg-card/35
                     focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
        />

        <span className="select-none px-1 text-sm text-muted-foreground/60">
          /
        </span>

        <input
          aria-label="Year"
          inputMode="numeric"
          placeholder="YYYY"
          value={yStr}
          onChange={(e) => {
            const yyyy = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
            // don't padStart year while typing; let it be partial
            setValue(`${yyyy}-${mStr}-${dStr}`);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") normalizeAndCommit();
            if (e.key === "Escape") cancel();
          }}
          className="h-8 w-[66px] rounded-md border border-border/70 bg-card/25 px-2 text-sm text-foreground
                     outline-none transition-colors hover:bg-card/35
                     focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <button
        type="button"
        onClick={normalizeAndCommit}
        className="h-8 rounded-md border border-emerald-500/80 bg-emerald-500/10 px-3 text-sm font-medium
                   text-emerald-300 transition-colors hover:bg-emerald-500/15"
      >
        Save
      </button>

      <button
        type="button"
        onClick={cancel}
        className="h-8 rounded-md border border-border/70 bg-card/10 px-3 text-sm font-medium
                   text-muted-foreground transition-colors hover:bg-card/30"
      >
        Cancel
      </button>
    </div>
  );
}
