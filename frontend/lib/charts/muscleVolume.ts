// lib/charts/muscleVolume.ts
import type { Workout } from "@/types/workout";

// ------------------------------
// Types & muscle config
// ------------------------------

export type MuscleKey =
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

export type Metric = "volume" | "sets";

export const MUSCLE_ORDER: MuscleKey[] = [
  // Push sector
  "shoulders",
  "chest",
  "triceps",

  // Pull sector
  "traps",
  "back",
  "biceps",

  // Legs sector
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "adductors",
  "abductors",
];

export type MuscleVolumeMap = Record<MuscleKey, number>;

export type LayerDatum = {
  name: string;
  key: string;
  value: number;
};

// ------------------------------
// Aggregation
// ------------------------------

export function initMuscleVolume(): MuscleVolumeMap {
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

export function mapGroupToMuscle(group: string): MuscleKey | null {
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
 * metric === "volume" -> sum(reps * weight)
 * metric === "sets"   -> count sets (where reps or weight > 0)
 */
export function computeMuscleStats(
  workouts: Workout[],
  mode: "primary" | "secondary",
  metric: Metric
): { total: number; muscles: MuscleVolumeMap } {
  const volumes = initMuscleVolume();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        const reps = set.reps ?? 0;
        const weight = set.weight ?? 0;

        let contribution = 0;

        if (metric === "volume") {
          contribution = reps * weight;
          if (contribution <= 0) continue;
        } else {
          // metric === "sets"
          if (reps <= 0 && weight <= 0) continue;
          contribution = 1;
        }

        if (mode === "primary") {
          const muscleKey = mapGroupToMuscle(exercise.primaryMuscleGroup);
          if (muscleKey) volumes[muscleKey] += contribution;
        } else {
          for (const group of exercise.secondaryMuscleGroups ?? []) {
            const muscleKey = mapGroupToMuscle(group);
            if (muscleKey) volumes[muscleKey] += contribution;
          }
        }
      }
    }
  }

  const total = Object.values(volumes).reduce((sum, v) => sum + v, 0);
  return { total, muscles: volumes };
}

// ------------------------------
// Ring building
// ------------------------------

export function buildMuscleRings(total: number, muscles: MuscleVolumeMap) {
  // Full body
  const fullBodyData: LayerDatum[] = [
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

  const upperLowerData: LayerDatum[] = [
    { name: "Upper", key: "upper", value: upperValue },
    { name: "Lower", key: "lower", value: lowerValue },
  ];

  // Push / Pull / Legs
  const pushValue = muscles.chest + muscles.shoulders + muscles.triceps;
  const pullValue = muscles.back + muscles.traps + muscles.biceps;
  const legsValue = lowerValue;

  const groupData: LayerDatum[] = [
    // { name: "Arms", key: "arms", value: armsValue },
    { name: "Push", key: "push", value: pushValue },
    { name: "Pull", key: "pull", value: pullValue },
    { name: "Legs", key: "legs", value: legsValue },
  ];

  // Outer muscles in our sector order
  const muscleData: LayerDatum[] = MUSCLE_ORDER.map((key) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: muscles[key],
  }));

  return { fullBodyData, upperLowerData, groupData, muscleData };
}

// ------------------------------
// Formatting helpers
// ------------------------------

export const fmt = (n: number) => n.toLocaleString();

export const percent = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;

export const shouldShowMuscleLabel = (value: number, total: number) =>
  total > 0 && value / total > 0.02;
