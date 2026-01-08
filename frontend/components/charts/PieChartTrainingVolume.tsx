"use client";

import React, { useMemo, useState } from "react";
import type { Workout } from "@/types/workout";
import { initMuscleVolume } from "@/lib/charts/muscleVolume";
import {
  buildMuscleRings,
  computeMuscleStats,
  type Metric,
} from "@/lib/charts/muscleVolume";
import { MuscleVolumeToggle } from "@/components/charts/MuscleVolumeToggle";
import MuscleRingsChart from "@/components/charts/MuscleRingsChart";
import { useExercisesById } from "@/app/hooks/useExercisesById";

type Props = {
  workouts: Workout[];
};

export default function PieChartTrainingVolume({ workouts }: Props) {
  const [mode, setMode] = useState<"primary" | "secondary">("primary");
  const [metric, setMetric] = useState<Metric>("volume");

  const { exercisesById, loading, error, retry } = useExercisesById();
  const exercisesReady = Object.keys(exercisesById).length > 0;

  const { total, muscles } = useMemo(() => {
    if (!exercisesReady) return { total: 0, muscles: initMuscleVolume() };
    return computeMuscleStats(workouts, exercisesById, mode, metric);
  }, [workouts, exercisesById, exercisesReady, mode, metric]);

  const { fullBodyData, upperLowerData, groupData, muscleData } = useMemo(
    () => buildMuscleRings(total, muscles),
    [total, muscles]
  );

  // Loading exercises
  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg border border-border p-4">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="mt-3 h-[340px] sm:h-[520px] md:h-[580px] rounded bg-muted" />
          <p className="mt-3 text-sm text-muted-foreground">
            Loading exercise definitions…
          </p>
        </div>
      </div>
    );
  }

  // Exercises error
  if (error) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>

        <div className="rounded-lg border border-border p-6 text-center">
          <h3 className="text-base font-semibold">
            Couldn&apos;t load chart data
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Retry loading exercises. If this persists, your session may have
            expired.
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={retry}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exercises loaded but empty
  if (!exercisesReady) {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <h3 className="text-base font-semibold">No exercises found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Exercise definitions are required to compute muscle breakdown.
        </p>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={retry}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // True "no chartable data"
  if (total === 0) {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <h3 className="text-base font-semibold">No chartable data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No {metric === "volume" ? "volume" : "set"} data available for the
          selected metric/mode.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MuscleVolumeToggle
        mode={mode}
        metric={metric}
        onModeChange={setMode}
        onMetricChange={setMetric}
        onResetSelection={() => {}}
      />

      <MuscleRingsChart
        total={total}
        metric={metric}
        fullBodyData={fullBodyData}
        upperLowerData={upperLowerData}
        groupData={groupData}
        muscleData={muscleData}
      />
    </div>
  );
}
