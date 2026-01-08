"use client";

import PieChartTrainingVolume from "@/components/charts/PieChartTrainingVolume";
import type { Workout } from "@/types/workout";

type Props = {
  workouts: Workout[];
  loading?: boolean;
};

export function MuscleBreakdownSection({ workouts, loading }: Props) {
  const hasWorkouts = workouts.length > 0;

  return (
    <section className="text-center">
      <h2 className="text-xl font-semibold mb-2">Muscle Group Breakdown</h2>
      <p className="text-sm text-muted-foreground mb-3">
        Visualize how your training work distributes across muscle groups.
      </p>

      {loading ? (
        <div className="rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading workouts…</p>
        </div>
      ) : !hasWorkouts ? (
        <div className="rounded-lg border border-border p-6 text-center">
          <h3 className="text-base font-semibold">No workouts yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Log your first workout to see muscle breakdown here.
          </p>
        </div>
      ) : (
        <PieChartTrainingVolume workouts={workouts} />
      )}
    </section>
  );
}
