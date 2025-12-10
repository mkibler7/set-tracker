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
        FULL: { inner: 0, outer: 18 },
        UPPER_LOWER: { inner: 22, outer: 50 },
        GROUPS: { inner: 54, outer: 90 },
        MUSCLES: { inner: 94, outer: 130 },
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

  const resetSelection = () => setHover(null);
  const clearHover = () => setHover(null);

  /**
   * Show tooltip for a given slice (hover on desktop, tap on mobile).
   */
  const handleSliceHighlight = (data: any, _index: number, e?: any) => {
    const payload = data?.payload ?? data;
    const label: string = payload?.name ?? "";
    const rawValue = payload?.value;
    const value = typeof rawValue === "number" ? rawValue : 0;

    if (!label || value <= 0) {
      setHover(null);
      return;
    }

    let x: number | undefined;
    let y: number | undefined;

    if (e) {
      const native = (e.nativeEvent ?? e) as any;
      const clientX = native?.clientX;
      const clientY = native?.clientY;

      if (typeof clientX === "number" && typeof clientY === "number") {
        const target = (native.target as SVGElement | null) ?? null;
        const svg =
          target?.ownerSVGElement ??
          (e.currentTarget as SVGElement | undefined) ??
          null;

        if (svg) {
          const rect = svg.getBoundingClientRect();
          x = clientX - rect.left;
          y = clientY - rect.top;
        }
      }
    }

    const nextHover: HoverInfo = {
      label,
      value,
      percentOfTotal: percent(value, total),
      x,
      y,
    };

    setHover(nextHover);
  };

  // Outer muscle labels + connector lines
  const renderMuscleLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name } = props;
    if (!shouldShowMuscleLabel(value, total)) return null;

    const RADIAN = Math.PI / 180;
    const angle = -midAngle * RADIAN;

    const sx = cx + outerRadius * Math.cos(angle);
    const sy = cy + outerRadius * Math.sin(angle);

    const mx = cx + (outerRadius + 8) * Math.cos(angle);
    const my = cy + (outerRadius + 8) * Math.sin(angle);

    const isRightSide = mx >= cx;
    // Slightly shorter elbow + smaller offset on mobile
    const horizontalOffset = isSmallScreen ? 16 : 28;

    const ex = mx + (isRightSide ? horizontalOffset : -horizontalOffset);
    const ey = my;
    const textX = ex + (isRightSide ? 4 : -4);
    const textAnchor = isRightSide ? "start" : "end";

    const p = percent(value, total);
    const rawName = String(name).toUpperCase();

    // Mobile: just show the muscle name.
    // Desktop: full label with volume + %
    const labelText = isSmallScreen
      ? rawName
      : `${rawName} — ${fmt(value)} (${p.toFixed(0)}%)`;

    const fontSize = isSmallScreen ? 9 : 11;

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
          fontSize={fontSize}
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

      <div className="relative mx-auto h-[360px] w-full sm:h-[520px] md:h-[580px]">
        <MuscleHoverOverlay
          hover={hover}
          metricLabel={metricLabel}
          formatNumber={fmt}
        />

        <ResponsiveContainer className="reptracker-chart">
          <PieChart onMouseLeave={clearHover}>
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
              onMouseMove={handleSliceHighlight}
              onClick={handleSliceHighlight}
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
              onMouseMove={handleSliceHighlight}
              onClick={handleSliceHighlight}
            >
              {upperLowerData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.upperLower}
                  stroke={COLORS.stroke}
                />
              ))}
            </Pie>

            {/* LAYER 3 — PUSH / PULL / LEGS (groups) */}
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
              onMouseMove={handleSliceHighlight}
              onClick={handleSliceHighlight}
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
              label={renderMuscleLabel}
              labelLine={false}
              onMouseMove={handleSliceHighlight}
              onClick={handleSliceHighlight}
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
