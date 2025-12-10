"use client";

import clsx from "clsx";
import type { Metric } from "@/lib/charts/muscleVolume";

type Props = {
  mode: "primary" | "secondary";
  metric: Metric;
  onModeChange: (mode: "primary" | "secondary") => void;
  onMetricChange: (metric: Metric) => void;
  onResetSelection: () => void;
};

export function MuscleVolumeToggle({
  mode,
  metric,
  onModeChange,
  onMetricChange,
  onResetSelection,
}: Props) {
  const handleMode = (next: "primary" | "secondary") => {
    onModeChange(next);
    onResetSelection();
  };

  const handleMetric = (next: Metric) => {
    onMetricChange(next);
    onResetSelection();
  };

  return (
    <div className="mb-4 flex w-full flex-col items-center gap-2">
      {/* Primary / Secondary */}
      <div className="flex overflow-hidden rounded-lg border border-border mt-2">
        <button
          onClick={() => handleMode("primary")}
          className={clsx(
            "px-4 py-2 text-sm",
            mode === "primary"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Primary
        </button>
        <button
          onClick={() => handleMode("secondary")}
          className={clsx(
            "px-4 py-2 text-sm",
            mode === "secondary"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Secondary
        </button>
      </div>

      {/* Volume / Sets */}
      <div className="flex overflow-hidden rounded-lg border border-border mt-1">
        <button
          onClick={() => handleMetric("volume")}
          className={clsx(
            "px-3 py-1.5 text-xs sm:text-sm",
            metric === "volume"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Volume
        </button>
        <button
          onClick={() => handleMetric("sets")}
          className={clsx(
            "px-3 py-1.5 text-xs sm:text-sm",
            metric === "sets"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Sets
        </button>
      </div>
    </div>
  );
}
