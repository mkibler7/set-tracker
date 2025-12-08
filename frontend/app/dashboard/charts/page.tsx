"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import SunburstTrainingVolume from "@/components/charts/PieChartTrainingVolume";
import AreaGraphTrainingVolume from "@/components/charts/AreaGraphTrainingVolume";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import {
  getVolumeSeries,
  filterWorkoutsByRange,
  type TimeRange,
} from "@/lib/workouts/stats";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RANGES: TimeRange[] = ["7D", "1M", "1Y", "ALL"];

export default function ChartsPage() {
  const [range, setRange] = useState<TimeRange>("1M");

  const filteredWorkouts = filterWorkoutsByRange(MOCK_WORKOUTS, range);
  const data = getVolumeSeries(filteredWorkouts);

  return (
    <main className="page">
      {/* header + range buttons */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Training volume
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visualize how your total volume changes over time. Later this will
            be powered by your real workout history.
          </p>
        </div>

        <div className="mt-2 flex gap-2 sm:mt-0">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium border transition",
                r === range
                  ? "bg-primary/20 border-primary/60 text-primary"
                  : "bg-card/60 border-border text-muted-foreground hover:bg-card",
              ].join(" ")}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      {/* Charts */}
      <AreaGraphTrainingVolume data={data} />
      <section className="mt-8">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Muscle Group Breakdown</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Visualize how your training volume distributes across muscle groups.
          </p>

          <SunburstTrainingVolume workouts={filteredWorkouts} />
        </Card>
      </section>
    </main>
  );
}
