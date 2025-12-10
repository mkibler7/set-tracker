"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import type { Workout } from "@/types/workout";
import {
  buildMuscleRings,
  computeMuscleStats,
  fmt,
  percent,
  shouldShowMuscleLabel,
  type Metric,
} from "@/lib/charts/muscleVolume";
import { MuscleVolumeToggle } from "@/components/dashboard/charts/MuscleVolumeToggle";
import {
  MuscleHoverOverlay,
  type HoverInfo,
} from "@/components/dashboard/charts/MuscleHoverOverlay";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

type Props = {
  workouts: Workout[];
};

export default function PieChartTrainingVolume({ workouts }: Props) {
  const [mode, setMode] = useState<"primary" | "secondary">("primary");
  const [metric, setMetric] = useState<Metric>("volume");
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  // Aggregate data (volume or sets)
  const { total, muscles } = useMemo(
    () => computeMuscleStats(workouts, mode, metric),
    [workouts, mode, metric]
  );

  if (total === 0) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        No {metric === "volume" ? "volume" : "set"} data available yet.
      </div>
    );
  }

  // Build ring layers from muscle totals
  const { fullBodyData, upperLowerData, groupData, muscleData } = useMemo(
    () => buildMuscleRings(total, muscles),
    [total, muscles]
  );

  // Radii per ring
  const RINGS = isSmallScreen
    ? {
        FULL: { inner: 0, outer: 22 },
        UPPER_LOWER: { inner: 26, outer: 56 },
        GROUPS: { inner: 60, outer: 100 },
        MUSCLES: { inner: 104, outer: 140 },
      }
    : {
        FULL: { inner: 0, outer: 35 },
        UPPER_LOWER: { inner: 40, outer: 80 },
        GROUPS: { inner: 85, outer: 135 },
        MUSCLES: { inner: 140, outer: 200 },
      };

  const COLORS = {
    full: "hsl(var(--chart-ring-full))",
    upperLower: "hsl(var(--chart-ring-upper-lower))",
    groups: "hsl(var(--chart-ring-groups))",
    muscles: "hsl(var(--chart-ring-muscles))",
    stroke: "hsl(var(--background))",
  };

  const resetSelection = () => {
    setHover(null);
  };

  const clearHover = () => setHover(null);

  // Called when the mouse is over an actual sector
  const handlePieMouseMove = (data: any, _index: number, event: any) => {
    if (!event) return;

    const svg = event.currentTarget?.ownerSVGElement as SVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const payload = (data && data.payload) || data;
    const label: string = payload?.name ?? "";
    const rawValue = payload?.value ?? data?.value;
    const value = typeof rawValue === "number" ? rawValue : 0;

    if (!label || value <= 0) return;

    setHover({
      label,
      value,
      percentOfTotal: percent(value, total),
      x,
      y,
    });
  };

  // Parent-level mouse move: if we’re NOT over a sector anymore, hide tooltip
  const handleWrapperMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Sectors are rendered as <path class="recharts-sector" ...>
    const sector = target.closest(".recharts-sector");
    if (!sector && hover) {
      // We moved off any slice (onto labels or empty space) – clear tooltip
      setHover(null);
    }
  };

  // Outer muscle labels + connector lines
  const renderMuscleLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name } = props;
    if (!shouldShowMuscleLabel(value, total)) return null;

    const RADIAN = Math.PI / 180;
    const angle = -midAngle * RADIAN;

    const sx = cx + outerRadius * Math.cos(angle);
    const sy = cy + outerRadius * Math.sin(angle);

    const mx = cx + (outerRadius + 10) * Math.cos(angle);
    const my = cy + (outerRadius + 10) * Math.sin(angle);

    const isRightSide = mx >= cx;
    const horizontalOffset = isSmallScreen ? 18 : 28;

    const ex = mx + (isRightSide ? horizontalOffset : -horizontalOffset);
    const ey = my;
    const textX = ex + (isRightSide ? 4 : -4);
    const textAnchor = isRightSide ? "start" : "end";

    const p = percent(value, total);
    const labelText = `${String(name).toUpperCase()} — ${fmt(
      value
    )} (${p.toFixed(0)}%)`;

    return (
      <g>
        <path
          d={`M${sx},${sy} L${mx},${my} L${ex},${ey}`}
          stroke="hsl(var(--foreground))"
          strokeWidth={1.1}
          fill="none"
        />
        <circle cx={sx} cy={sy} r={1.7} fill="hsl(var(--foreground))" />
        <text
          x={textX}
          y={ey}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={11}
          fill="hsl(var(--foreground))"
        >
          {labelText}
        </text>
      </g>
    );
  };

  const metricLabel = metric === "volume" ? "total volume" : "total sets";

  return (
    <div className="w-full">
      <MuscleVolumeToggle
        mode={mode}
        metric={metric}
        onModeChange={setMode}
        onMetricChange={setMetric}
        onResetSelection={resetSelection}
      />

      <div className="relative w-full max-w-[360px] sm:max-w-none mx-auto h-[360px] sm:h-[520px] md:h-[580px]">
        <MuscleHoverOverlay
          hover={hover}
          metricLabel={metricLabel}
          formatNumber={fmt}
        />

        <ResponsiveContainer className="reptracker-chart">
          <PieChart>
            {/* LAYER 1 — FULL BODY */}
            <Pie
              data={fullBodyData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={RINGS.FULL.inner}
              outerRadius={RINGS.FULL.outer}
              startAngle={0}
              endAngle={-360}
              isAnimationActive={false}
              onMouseMove={handlePieMouseMove}
            >
              {fullBodyData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.full}
                  stroke="none" // no line through middle
                />
              ))}
            </Pie>

            {/* LAYER 2 — UPPER / LOWER */}
            <Pie
              data={upperLowerData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={RINGS.UPPER_LOWER.inner}
              outerRadius={RINGS.UPPER_LOWER.outer}
              startAngle={0}
              endAngle={-360}
              isAnimationActive={false}
              onMouseMove={handlePieMouseMove}
            >
              {upperLowerData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.upperLower}
                  stroke={COLORS.stroke}
                />
              ))}
            </Pie>

            {/* LAYER 3 — ARMS / PUSH / PULL / LEGS */}
            <Pie
              data={groupData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={RINGS.GROUPS.inner}
              outerRadius={RINGS.GROUPS.outer}
              startAngle={0}
              endAngle={-360}
              isAnimationActive={false}
              onMouseMove={handlePieMouseMove}
            >
              {groupData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.groups}
                  stroke={COLORS.stroke}
                />
              ))}
            </Pie>

            {/* LAYER 4 — INDIVIDUAL MUSCLES + LABELS */}
            <Pie
              data={muscleData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={RINGS.MUSCLES.inner}
              outerRadius={RINGS.MUSCLES.outer}
              startAngle={0}
              endAngle={-360}
              isAnimationActive={false}
              label={isSmallScreen ? undefined : renderMuscleLabel}
              labelLine={false}
              onMouseMove={handlePieMouseMove}
            >
              {muscleData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.muscles}
                  stroke={COLORS.stroke}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
