"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { Card } from "../ui/Card";
import clsx from "clsx";

import type { Workout } from "@/types/workout";

// ------------------------------
// Types & muscle config
// ------------------------------

type MuscleKey =
  | "triceps"
  | "shoulders"
  | "chest"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "adductors"
  | "abductors"
  | "traps"
  | "back"
  | "biceps";

type Metric = "volume" | "sets";

const MUSCLE_ORDER: MuscleKey[] = [
  // 👉 Arms sector
  "triceps",
  "biceps",

  // 👉 Push sector
  "shoulders",
  "chest",

  // 👉 Pull sector
  "traps",
  "back",

  // 👉 Legs sector
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "adductors",
  "abductors",
];

type MuscleVolumeMap = Record<MuscleKey, number>;

type HoverInfo = {
  label: string;
  value: number;
  percentOfTotal: number;
};

type SliceLayer = 1 | 2 | 3 | 4;

type LayerDatum = {
  name: string;
  key: string;
  value: number;
};

// ------------------------------
// Volume / set aggregation
// ------------------------------

function initMuscleVolume(): MuscleVolumeMap {
  return {
    triceps: 0,
    shoulders: 0,
    chest: 0,
    quads: 0,
    hamstrings: 0,
    glutes: 0,
    calves: 0,
    adductors: 0,
    abductors: 0,
    traps: 0,
    back: 0,
    biceps: 0,
  };
}

function mapGroupToMuscle(group: string): MuscleKey | null {
  switch (group.toLowerCase()) {
    case "triceps":
      return "triceps";
    case "shoulders":
      return "shoulders";
    case "chest":
      return "chest";
    case "quads":
    case "quadriceps":
      return "quads";
    case "hamstrings":
      return "hamstrings";
    case "glutes":
    case "gluteus":
      return "glutes";
    case "calves":
    case "calf":
      return "calves";
    case "adductors":
      return "adductors";
    case "abductors":
      return "abductors";
    case "traps":
    case "trapezius":
      return "traps";
    case "back":
      return "back";
    case "biceps":
      return "biceps";
    default:
      return null;
  }
}

/**
 * metric === "volume" → sum(reps * weight)
 * metric === "sets"   → count sets (where reps or weight > 0)
 */
function computeMuscleStats(
  workouts: Workout[],
  mode: "primary" | "secondary",
  metric: Metric
): { total: number; muscles: MuscleVolumeMap } {
  const volumes = initMuscleVolume();

  for (const workout of workouts) {
    for (const ex of workout.exercises) {
      for (const set of ex.sets) {
        const reps = set.reps ?? 0;
        const weight = set.weight ?? 0;

        let contribution = 0;

        if (metric === "volume") {
          contribution = reps * weight;
          if (contribution <= 0) continue;
        } else {
          // "sets" – only count meaningful sets
          if (reps <= 0 && weight <= 0) continue;
          contribution = 1;
        }

        if (mode === "primary") {
          const m = mapGroupToMuscle(ex.primaryMuscleGroup);
          if (m) volumes[m] += contribution;
        } else {
          for (const g of ex.secondaryMuscleGroups ?? []) {
            const m = mapGroupToMuscle(g);
            if (m) volumes[m] += contribution;
          }
        }
      }
    }
  }

  const total = Object.values(volumes).reduce((sum, v) => sum + v, 0);
  return { total, muscles: volumes };
}

// ------------------------------
// Helper formatting
// ------------------------------

const fmt = (n: number) => n.toLocaleString();

const percent = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;

const shouldShowMuscleLabel = (value: number, total: number) =>
  total > 0 && value / total > 0.02; // hide tiny 1–2% slices

// ------------------------------
// Component
// ------------------------------

type Props = {
  workouts: Workout[];
};

export default function PieChartTrainingVolume({ workouts }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<"primary" | "secondary">("primary");
  const [metric, setMetric] = useState<Metric>("volume");
  const [activeLayer, setActiveLayer] = useState<SliceLayer | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);

  // 1) Memoize aggregation
  const { total, muscles } = useMemo(
    () => computeMuscleStats(workouts, mode, metric),
    [workouts, mode, metric]
  );

  // Early no-data state
  if (total === 0) {
    return (
      <div className="w-full text-sm text-muted-foreground">
        No {metric === "volume" ? "volume" : "set"} data available yet.
      </div>
    );
  }

  // --------------------------
  // 2) Memoize ring data
  // --------------------------
  const { fullBodyData, upperLowerData, groupData, muscleData } =
    useMemo(() => {
      // Full body
      const fullBody: LayerDatum[] = [
        { name: "Full Body", key: "fullBody", value: total },
      ];

      // Upper vs lower
      const upperValue =
        muscles.chest +
        muscles.shoulders +
        muscles.traps +
        muscles.back +
        muscles.biceps +
        muscles.triceps;

      const lowerValue =
        muscles.quads +
        muscles.hamstrings +
        muscles.glutes +
        muscles.calves +
        muscles.adductors +
        muscles.abductors;

      const upperLower: LayerDatum[] = [
        { name: "Upper", key: "upper", value: upperValue },
        { name: "Lower", key: "lower", value: lowerValue },
      ];

      // Arms / Push / Pull / Legs (disjoint; sums to total)
      const armsValue = muscles.biceps + muscles.triceps;
      const pushValue = muscles.chest + muscles.shoulders;
      const pullValue = muscles.back + muscles.traps;
      const legsValue = lowerValue;

      const groups: LayerDatum[] = [
        { name: "Arms", key: "arms", value: armsValue },
        { name: "Push", key: "push", value: pushValue },
        { name: "Pull", key: "pull", value: pullValue },
        { name: "Legs", key: "legs", value: legsValue },
      ];

      // Individual muscles in the sector order we want
      const musclesRing: LayerDatum[] = MUSCLE_ORDER.map((key) => ({
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: muscles[key],
      }));

      return {
        fullBodyData: fullBody,
        upperLowerData: upperLower,
        groupData: groups,
        muscleData: musclesRing,
      };
    }, [total, muscles]);

  // --------------------------
  // Ring sizing & colors
  // --------------------------

  const RINGS = {
    FULL: { inner: 0, outer: 35 },
    UPPER_LOWER: { inner: 40, outer: 80 },
    GROUPS: { inner: 85, outer: 135 },
    MUSCLES: { inner: 140, outer: 200 },
  };

  // Solid emerald colors per ring
  const COLORS = {
    full: "hsl(var(--primary))",
    upperLower: "hsl(var(--primary))",
    groups: "hsl(var(--primary))",
    muscles: "hsl(var(--primary))",
    stroke: "hsl(var(--background))",
  };

  const handleSliceClick = (layer: SliceLayer, key: string) => {
    setActiveLayer(layer);
    setActiveKey(key);

    if (layer === 4) {
      router.push(`/dashboard/muscles/${key.toLowerCase()}`);
    }
  };

  // safer hover handler – only update when value actually changes
  const handleHover = (label: string, value: number) => {
    setHover((prev) => {
      if (prev && prev.label === label && prev.value === value) return prev;
      return {
        label,
        value,
        percentOfTotal: percent(value, total),
      };
    });
  };

  const clearHover = () => setHover(null);

  const getOpacity = (layer: SliceLayer, key: string): number => {
    if (activeLayer === null) return 1;
    if (activeLayer === layer && activeKey === key) return 1;
    return 0.35;
  };

  // outer muscle labels with elbow connectors (brighter / whiter)
  const renderMuscleLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name } = props;
    if (!shouldShowMuscleLabel(value, total)) return null;

    const RADIAN = Math.PI / 180;
    const angle = -midAngle * RADIAN;

    // start at edge of slice
    const sx = cx + outerRadius * Math.cos(angle);
    const sy = cy + outerRadius * Math.sin(angle);

    // middle joint
    const mx = cx + (outerRadius + 10) * Math.cos(angle);
    const my = cy + (outerRadius + 10) * Math.sin(angle);

    const isRightSide = mx >= cx;
    const horizontalOffset = 28;

    // label end
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
          stroke="hsl(var(--foreground))" // brighter connector
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

  const Toggle = () => (
    <div className="flex w-full flex-col items-center gap-2 mb-4">
      {/* Primary / Secondary */}
      <div className="flex rounded-lg overflow-hidden border border-border">
        <button
          onClick={() => {
            setMode("primary");
            setActiveLayer(null);
            setActiveKey(null);
            setHover(null);
          }}
          className={clsx(
            "px-4 py-2 text-sm",
            mode === "primary"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Primary
        </button>
        <button
          onClick={() => {
            setMode("secondary");
            setActiveLayer(null);
            setActiveKey(null);
            setHover(null);
          }}
          className={clsx(
            "px-4 py-2 text-sm",
            mode === "secondary"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Secondary
        </button>
      </div>

      {/* Volume / Sets */}
      <div className="flex rounded-lg overflow-hidden border border-border">
        <button
          onClick={() => {
            setMetric("volume");
            setActiveLayer(null);
            setActiveKey(null);
            setHover(null);
          }}
          className={clsx(
            "px-3 py-1.5 text-xs sm:text-sm",
            metric === "volume"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Volume
        </button>
        <button
          onClick={() => {
            setMetric("sets");
            setActiveLayer(null);
            setActiveKey(null);
            setHover(null);
          }}
          className={clsx(
            "px-3 py-1.5 text-xs sm:text-sm",
            metric === "sets"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card/50"
          )}
        >
          Sets
        </button>
      </div>
    </div>
  );

  const metricLabel = metric === "volume" ? "total volume" : "total sets";

  return (
    <div className="w-full">
      <Toggle />

      <div className="relative w-full h-[520px] sm:h-[580px]">
        {/* center hover info box */}
        {hover && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-slate-950/95 px-3 py-2 text-xs text-foreground shadow-lg">
            <div className="font-semibold">{hover.label}</div>
            <div>{fmt(hover.value)}</div>
            <div className="text-[0.7rem] text-muted-foreground">
              {hover.percentOfTotal.toFixed(1)}% of {metricLabel}
            </div>
          </div>
        )}

        <ResponsiveContainer className="reptracker-chart">
          <PieChart
            onMouseLeave={() => {
              clearHover();
            }}
          >
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
              onClick={(_, idx) => handleSliceClick(1, fullBodyData[idx].key)}
              onMouseEnter={(_, idx) =>
                handleHover(fullBodyData[idx].name, fullBodyData[idx].value)
              }
            >
              {fullBodyData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.full}
                  stroke="none" // no line through middle
                  opacity={getOpacity(1, entry.key)}
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
              onClick={(_, idx) => handleSliceClick(2, upperLowerData[idx].key)}
              onMouseEnter={(_, idx) =>
                handleHover(upperLowerData[idx].name, upperLowerData[idx].value)
              }
            >
              {upperLowerData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.upperLower}
                  stroke={COLORS.stroke}
                  opacity={getOpacity(2, entry.key)}
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
              onClick={(_, idx) => handleSliceClick(3, groupData[idx].key)}
              onMouseEnter={(_, idx) =>
                handleHover(groupData[idx].name, groupData[idx].value)
              }
            >
              {groupData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.groups}
                  stroke={COLORS.stroke}
                  opacity={getOpacity(3, entry.key)}
                />
              ))}
            </Pie>

            {/* LAYER 4 — MUSCLES (outer labels only) */}
            <Pie
              data={muscleData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={RINGS.MUSCLES.inner}
              outerRadius={RINGS.MUSCLES.outer}
              startAngle={0}
              endAngle={-360}
              label={renderMuscleLabel}
              labelLine={false}
              isAnimationActive={false}
              onClick={(_, idx) => handleSliceClick(4, muscleData[idx].key)}
              onMouseEnter={(_, idx) =>
                handleHover(muscleData[idx].name, muscleData[idx].value)
              }
            >
              {muscleData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS.muscles}
                  stroke={COLORS.stroke}
                  opacity={getOpacity(4, entry.key)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
