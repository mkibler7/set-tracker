"use client";

import React from "react";

import { Card } from "@/components/ui/Card";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type TrainingVolumeTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: { value?: number }[];
};

export default function AreaGraphTrainingVolume({
  data,
}: {
  data: Array<{ dateLabel: string; volume: number }>;
}) {
  // ---- custom dark tooltip ----
  const TrainingVolumeTooltip = ({
    active,
    payload,
    label,
  }: TrainingVolumeTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value ?? 0;

    return (
      <div className="rounded-md border border-border bg-slate-950/90 px-3 py-2 text-xs text-foreground shadow-lg">
        <div className="font-semibold mb-1">{label}</div>
        <div>volume : {value.toLocaleString()}</div>
      </div>
    );
  };

  return (
    <Card className="settracker-chart ">
      <div className="w-full h-[190px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 16, left: 12, bottom: 4 }}
          >
            {/* gradient for shaded area */}
            <defs>
              <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 9,
                fill: "hsl(var(--muted-foreground))",
              }}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 9, // smaller font for mobile + desktop
                fill: "hsl(var(--muted-foreground))",
              }}
              tickMargin={4}
              width={30} // slightly narrower
            />
            <Tooltip
              content={<TrainingVolumeTooltip />}
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#volumeFill)" // ⬅ shaded under the line
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
