import type { Workout } from "@/types/workout";

export type MuscleKey =
  | "chest"
  | "shoulders"
  | "back"
  | "traps"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "calves"
  | "glutes";

export type RegionKey = "chestShoulders" | "backTraps" | "arms" | "legsGroup";

export type SplitKey = "push" | "pull" | "legs";

export type SunburstData = {
  fullBody: number;
  splits: Record<SplitKey, number>;
  regions: Record<RegionKey, number>;
  muscles: Record<MuscleKey, number>;
};

function initMuscleMap(): Record<MuscleKey, number> {
  return {
    chest: 0,
    shoulders: 0,
    back: 0,
    traps: 0,
    biceps: 0,
    triceps: 0,
    quads: 0,
    hamstrings: 0,
    calves: 0,
    glutes: 0,
  };
}

function mapPrimaryToMuscle(group: string): MuscleKey | null {
  switch (group.toLowerCase()) {
    case "chest":
      return "chest";
    case "shoulders":
      return "shoulders";
    case "back":
      return "back";
    case "traps":
      return "traps";
    case "biceps":
      return "biceps";
    case "triceps":
      return "triceps";
    case "quads":
      return "quads";
    case "hamstrings":
      return "hamstrings";
    case "calves":
      return "calves";
    case "glutes":
      return "glutes";
    default:
      return null;
  }
}

function determineSplit(muscle: MuscleKey): SplitKey {
  if (muscle === "triceps" || muscle === "shoulders" || muscle === "chest")
    return "push";
  if (muscle === "back" || muscle === "traps" || muscle === "biceps")
    return "pull";
  return "legs";
}

function determineRegion(muscle: MuscleKey): RegionKey {
  switch (muscle) {
    case "chest":
    case "shoulders":
      return "chestShoulders";
    case "back":
    case "traps":
      return "backTraps";
    case "biceps":
    case "triceps":
      return "arms";
    default:
      return "legsGroup";
  }
}

// -------------------------------------------------------
// MAIN TRANSFORMER
// -------------------------------------------------------

export function buildSunburstData(
  workouts: Workout[],
  mode: "primary" | "secondary" = "primary"
): SunburstData {
  const muscleVolume = initMuscleMap();

  for (const workout of workouts) {
    for (const ex of workout.exercises) {
      for (const set of ex.sets) {
        const volume = (set.reps ?? 0) * (set.weight ?? 0);

        if (volume <= 0) continue;

        if (mode === "primary") {
          const primary = mapPrimaryToMuscle(ex.primaryMuscleGroup);
          if (primary) muscleVolume[primary] += volume;
        } else {
          for (const g of ex.secondaryMuscleGroups ?? []) {
            const m = mapPrimaryToMuscle(g);
            if (m) muscleVolume[m] += volume;
          }
        }
      }
    }
  }

  // SPLITS
  const splits: Record<SplitKey, number> = { push: 0, pull: 0, legs: 0 };

  for (const muscle in muscleVolume) {
    const key = muscle as MuscleKey;
    const split = determineSplit(key);
    splits[split] += muscleVolume[key];
  }

  // REGIONS
  const regions: Record<RegionKey, number> = {
    chestShoulders: 0,
    backTraps: 0,
    arms: 0,
    legsGroup: 0,
  };

  for (const muscle in muscleVolume) {
    const key = muscle as MuscleKey;
    const region = determineRegion(key);
    regions[region] += muscleVolume[key];
  }

  const fullBody = splits.push + splits.pull + splits.legs;

  return {
    fullBody,
    splits,
    regions,
    muscles: muscleVolume,
  };
}
