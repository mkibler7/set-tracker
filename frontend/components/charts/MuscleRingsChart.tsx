"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import {
  fmt,
  percent,
  shouldShowMuscleLabel,
  type Metric,
} from "@/lib/charts/muscleVolume";
import {
  MuscleHoverOverlay,
  type HoverInfo,
} from "@/components/charts/MuscleHoverOverlay";

type RingDatum = { key: string; name: string; value: number };

type Props = {
  total: number;
  metric: Metric;
  fullBodyData: RingDatum[];
  upperLowerData: RingDatum[];
  groupData: RingDatum[];
  muscleData: RingDatum[];
};

export default function MuscleRingsChart({
  total,
  metric,
  fullBodyData,
  upperLowerData,
  groupData,
  muscleData,
}: Props) {
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isXsScreen = useMediaQuery("(max-width: 390px)");

  // Radii per ring
  const RINGS = isXsScreen
    ? {
        FULL: { inner: 0, outer: 18 },
        UPPER_LOWER: { inner: 22, outer: 46 },
        GROUPS: { inner: 50, outer: 76 },
        MUSCLES: { inner: 80, outer: 102 },
      }
    : isSmallScreen
      ? {
          FULL: { inner: 0, outer: 20 },
          UPPER_LOWER: { inner: 24, outer: 52 },
          GROUPS: { inner: 56, outer: 86 },
          MUSCLES: { inner: 90, outer: 116 },
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

  const clearHover = () => setHover(null);

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

    setHover({
      label,
      value,
      percentOfTotal: percent(value, total),
      x,
      y,
    });
  };

  const renderMuscleLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name, viewBox } = props;

    if (!shouldShowMuscleLabel(value, total)) return null;

    const RADIAN = Math.PI / 180;
    const angle = -midAngle * RADIAN;

    const baseName = String(name).toUpperCase();
    const p = percent(value, total);

    const sx = cx + outerRadius * Math.cos(angle);
    const sy = cy + outerRadius * Math.sin(angle);

    const elbowRadius = outerRadius + (isXsScreen ? 2 : isSmallScreen ? 4 : 10);
    const mx = cx + elbowRadius * Math.cos(angle);
    const my = cy + elbowRadius * Math.sin(angle);

    const isRightSide = mx >= cx;
    const horizontalOffset = isSmallScreen ? 12 : 28;

    const ex = mx + (isRightSide ? horizontalOffset : -horizontalOffset);
    const ey = my;

    const chartWidth: number =
      typeof viewBox?.width === "number" ? viewBox.width : cx * 2;

    let textX = ex + (isRightSide ? 2 : -2);
    const padding = isSmallScreen ? 8 : 32;
    if (textX < padding) textX = padding;
    if (textX > chartWidth - padding) textX = chartWidth - padding;

    const labelText = isSmallScreen
      ? baseName
      : `${baseName} — ${fmt(value)} (${p.toFixed(0)}%)`;
    const textAnchor = isRightSide ? "start" : "end";

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
          fontSize={isXsScreen ? 7 : isSmallScreen ? 8 : 15}
          fill="hsl(var(--foreground))"
        >
          {labelText}
        </text>
      </g>
    );
  };

  const metricLabel = metric === "volume" ? "total volume" : "total sets";

  return (
    <div className="relative w-full h-[340px] sm:h-[520px] md:h-[580px] px-2 sm:px-0 overflow-visible">
      <MuscleHoverOverlay
        hover={hover}
        metricLabel={metricLabel}
        formatNumber={fmt}
      />

      <ResponsiveContainer className="settracker-chart">
        <PieChart
          onMouseLeave={clearHover}
          margin={
            isXsScreen
              ? { top: 8, right: 18, bottom: 8, left: 18 }
              : isSmallScreen
                ? { top: 8, right: 32, bottom: 8, left: 32 }
                : { top: 0, right: 80, bottom: 0, left: 80 }
          }
        >
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
            {fullBodyData.map((entry: any) => (
              <Cell key={entry.key} fill={COLORS.full} stroke="none" />
            ))}
          </Pie>

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
            {upperLowerData.map((entry: any) => (
              <Cell
                key={entry.key}
                fill={COLORS.upperLower}
                stroke={COLORS.stroke}
              />
            ))}
          </Pie>

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
            {groupData.map((entry: any) => (
              <Cell
                key={entry.key}
                fill={COLORS.groups}
                stroke={COLORS.stroke}
              />
            ))}
          </Pie>

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
            {muscleData.map((entry: any) => (
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
  );
}
