"use client";

import { useEffect, useState } from "react";
import { WorkoutsAPI } from "@/lib/api/workouts";
import type { Workout } from "@/types/workout";
import {
  getVolumeSeries,
  filterWorkoutsByRange,
  type TimeRange,
} from "@/lib/workouts/stats";

import AreaGraphTrainingVolume from "@/components/charts/AreaGraphTrainingVolume";
import { TrainingVolumeHeader } from "@/components/charts/TrainingVolumeHeader";
import { TimeRangeToggle } from "@/components/charts/TimeRangeToggle";
import { MuscleBreakdownSection } from "@/components/charts/MuscleBreakdownSection";

export default function ChartsPage() {
  const [range, setRange] = useState<TimeRange>("1M");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const retry = () => setRetryKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const list = await WorkoutsAPI.list();
        if (!cancelled) setWorkouts(list);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load workouts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  // selected range is the source of truth
  const filteredWorkouts = filterWorkoutsByRange(workouts, range);
  const hasWorkouts = filteredWorkouts.length > 0;

  // only build chart series when there are workouts
  const data = hasWorkouts ? getVolumeSeries(filteredWorkouts) : [];

  return (
    <main>
      <div className="page space-y-6">
        <TrainingVolumeHeader />

        {/* Training volume chart card:
            - loading: skeleton
            - error: error card + retry
            - empty: "No workouts yet" (replaces the big empty dashed box)
            - success: chart */}
        <div className="rounded-2xl border border-border bg-card/20 p-4">
          {loading ? (
            <div className="h-full w-full rounded-xl bg-muted/40" />
          ) : error ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center px-4">
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
              <button
                type="button"
                onClick={retry}
                className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : !hasWorkouts ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-base font-semibold">No workouts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Log your first workout to see charts here.
              </p>
            </div>
          ) : (
            <AreaGraphTrainingVolume data={data} />
          )}
        </div>

        {/* Time filter */}
        <div className="flex justify-center">
          <TimeRangeToggle range={range} onChange={setRange} />
        </div>

        {/* Muscle breakdown section stays on the page, but content should match the same "no workouts" logic */}
        <div className="w-full">
          <MuscleBreakdownSection
            workouts={filteredWorkouts}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}
