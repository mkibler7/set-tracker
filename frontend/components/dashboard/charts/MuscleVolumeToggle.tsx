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

  const baseGroupClass =
    "flex w-full overflow-hidden rounded-lg border border-border";

  return (
    <div className="mb-4 flex w-full flex-col items-center gap-2">
      {/* Primary / Secondary (wider) */}
      <div className="w-full flex justify-center">
        <div className={clsx(baseGroupClass, "max-w-[15rem] mt-2")}>
          <button
            onClick={() => handleMode("primary")}
            className={clsx(
              "flex-1 px-4 py-2 text-sm",
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
              "flex-1 px-4 py-2 text-sm",
              mode === "secondary"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card/50"
            )}
          >
            Secondary
          </button>
        </div>
      </div>

      {/* Volume / Sets (narrower but still centered) */}
      <div className="w-full flex justify-center">
        <div className={clsx(baseGroupClass, "max-w-[9rem] mt-1")}>
          <button
            onClick={() => handleMetric("volume")}
            className={clsx(
              "flex-1 px-3 py-1.5 text-xs sm:text-sm",
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
              "flex-1 px-3 py-1.5 text-xs sm:text-sm",
              metric === "sets"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-card/50"
            )}
          >
            Sets
          </button>
        </div>
      </div>
    </div>
  );
}
