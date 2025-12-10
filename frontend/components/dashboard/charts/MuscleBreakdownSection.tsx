"use client";

import { Card } from "@/components/ui/Card";
import PieChartTrainingVolume from "@/components/dashboard/charts/PieChartTrainingVolume";
import type { Workout } from "@/types/workout";

type Props = {
  workouts: Workout[];
};

export function MuscleBreakdownSection({ workouts }: Props) {
  return (
    <section className="mt-3">
      <h2 className="text-xl font-semibold mb-2">Muscle Group Breakdown</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Visualize how your training work distributes across muscle groups.
      </p>
      <PieChartTrainingVolume workouts={workouts} />
    </section>
  );
}
