"use client";

import { useState } from "react";
import { useEffect } from "react";
import { WorkoutsAPI } from "@/lib/api/workouts";
import type { Workout } from "@/types/workout";
import {
  getVolumeSeries,
  filterWorkoutsByRange,
  type TimeRange,
} from "@/lib/workouts/stats";

import AreaGraphTrainingVolume from "@/components/charts/AreaGraphTrainingVolume";
import PieChartTrainingVolume from "@/components/charts/PieChartTrainingVolume";
import { TrainingVolumeHeader } from "@/components/charts/TrainingVolumeHeader";
import { TimeRangeToggle } from "@/components/charts/TimeRangeToggle";
import { MuscleBreakdownSection } from "@/components/charts/MuscleBreakdownSection";
import PageBackButton from "@/components/shared/PageBackButton";

export default function ChartsPage() {
  const [range, setRange] = useState<TimeRange>("1M");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await WorkoutsAPI.list();
        if (!cancelled) setWorkouts(list);
      } catch (e) {
        if (!cancelled) setError("Failed to load workouts.");
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // single source of truth for the selected range
  const filteredWorkouts = filterWorkoutsByRange(workouts, range);
  const data = getVolumeSeries(filteredWorkouts);

  return (
    <main className="">
      <div className="page space-y-6">
        <PageBackButton />
        {/* Header + range selector */}
        <TrainingVolumeHeader />

        {error && (
          <div className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground">
            {error}
          </div>
        )}

        {/* Area graph (volume over time) */}
        <AreaGraphTrainingVolume data={data} />

        {/* Global time filter */}
        <div className="flex justify-center">
          <TimeRangeToggle range={range} onChange={setRange} />
        </div>

        {loading && (
          <p className="text-center text-xs text-muted-foreground">
            Loading workouts…
          </p>
        )}
      </div>

      {/* Muscle breakdown sunburst (same filtered workouts) */}
      <div className="w-full">
        <MuscleBreakdownSection workouts={filteredWorkouts} />
      </div>
    </main>
  );
}
