"use client";

import { useState } from "react";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import {
  getVolumeSeries,
  filterWorkoutsByRange,
  type TimeRange,
} from "@/lib/workouts/stats";

import AreaGraphTrainingVolume from "@/components/dashboard/charts/AreaGraphTrainingVolume";
import PieChartTrainingVolume from "@/components/dashboard/charts/PieChartTrainingVolume";
import { TrainingVolumeHeader } from "@/components/dashboard/charts/TrainingVolumeHeader";
import { TimeRangeToggle } from "@/components/dashboard/charts/TimeRangeToggle";
import { MuscleBreakdownSection } from "@/components/dashboard/charts/MuscleBreakdownSection";

export default function ChartsPage() {
  const [range, setRange] = useState<TimeRange>("1M");

  // single source of truth for the selected range
  const filteredWorkouts = filterWorkoutsByRange(MOCK_WORKOUTS, range);
  const data = getVolumeSeries(filteredWorkouts);

  return (
    <main className="page space-y-6">
      {/* Header + range selector */}
      <TrainingVolumeHeader />

      {/* Area graph (volume over time) */}
      <AreaGraphTrainingVolume data={data} />

      {/* Global time filter */}
      <div className="flex justify-center">
        <TimeRangeToggle range={range} onChange={setRange} />
      </div>

      {/* Muscle breakdown sunburst (same filtered workouts) */}
      <MuscleBreakdownSection workouts={filteredWorkouts} />
    </main>
  );
}
