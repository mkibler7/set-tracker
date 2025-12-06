"use client";

import { Card } from "@/components/ui/Card";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import { getVolumeSeries } from "@/lib/workouts/stats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ChartsPage() {
  const data = getVolumeSeries(MOCK_WORKOUTS);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Training volume
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualize how your total volume changes over time. Later this will be
          powered by your real workout history.
        </p>
      </header>

      <Card className="h-80 flex items-center justify-center text-sm text-muted-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateLabel" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="currentColor"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </main>
  );
}
