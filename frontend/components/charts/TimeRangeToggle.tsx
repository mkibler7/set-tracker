"use client";

import { TimeRange } from "@/lib/workouts/stats";

const RANGES: TimeRange[] = ["7D", "1M", "1Y", "ALL"];

type Props = {
  range: TimeRange;
  onChange: (range: TimeRange) => void;
};

export function TimeRangeToggle({ range, onChange }: Props) {
  return (
    <div className="flex justify-end">
      <div className="inline-flex gap-2 rounded-full bg-card/60 p-1 border border-border">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition",
              r === range
                ? "bg-primary/20 border-primary/60 text-primary"
                : "bg-card/60  text-muted-foreground hover:bg-card",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
