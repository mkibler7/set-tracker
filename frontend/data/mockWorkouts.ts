import type { Exercise } from "@/types/exercise";
import type { WorkoutExercise } from "@/types/workout";
import { MOCK_EXERCISES } from "./mockExercises";

export type WorkoutSet = {
  reps: number;
  weight: number;
  volume: number;
  tempo?: string;
  rpe?: number;
};

export type Workout = {
  id: string;
  date: string;
  split: string;
  exercises: WorkoutExercise[];
};

function findExercise(id: Exercise["id"]): Exercise {
  const exercise = MOCK_EXERCISES.find((e) => e.id === id);
  if (!exercise) {
    throw new Error(`Unknown exercise id: ${id}`);
  }
  return exercise;
}

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "workout-1",
    date: "2025-11-26",
    split: "Chest",
    exercises: [
      {
        ...findExercise("bench-press"),
        notes: "Felt strong today!",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 185,
            volume: 12 * 185,
            tempo: "4-2-1-2",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 195,
            volume: 10 * 195,
            tempo: "4-2-1-2",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "4-2-1-2",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 215,
            volume: 6 * 215,
            tempo: "4-2-1-2",
          },
        ],
        volume: 12 * 185 + 10 * 195 + 8 * 205 + 6 * 215,
      },
      {
        ...findExercise("incline-bench-press"),
        notes: "Felt powerful today!",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 205,
            volume: 10 * 205,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 215,
            volume: 8 * 215,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 4,
            weight: 235,
            volume: 4 * 235,
            tempo: "2-0-2-0",
          },
        ],
        volume: 10 * 205 + 8 * 215 + 6 * 225 + 4 * 235,
      },
      {
        ...findExercise("incline-dumbbell-bench-press"),
        notes: "Felt strong today!",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 185,
            volume: 12 * 185,
            tempo: "4-2-1-2",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 195,
            volume: 10 * 195,
            tempo: "4-2-1-2",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "4-2-1-2",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 215,
            volume: 6 * 215,
            tempo: "4-2-1-2",
          },
        ],
        volume: 12 * 185 + 10 * 195 + 8 * 205 + 6 * 215,
      },
      {
        ...findExercise("machine-chest-press"),
        notes: "Felt powerful today!",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 205,
            volume: 10 * 205,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 215,
            volume: 8 * 215,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 4,
            weight: 235,
            volume: 4 * 235,
            tempo: "2-0-2-0",
          },
        ],
        volume: 10 * 205 + 8 * 215 + 6 * 225 + 4 * 235,
      },
      {
        ...findExercise("dumbbell-bench-press"),
        notes: "Felt strong today!",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 185,
            volume: 12 * 185,
            tempo: "4-2-1-2",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 195,
            volume: 10 * 195,
            tempo: "4-2-1-2",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "4-2-1-2",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 215,
            volume: 6 * 215,
            tempo: "4-2-1-2",
          },
        ],
        volume: 12 * 185 + 10 * 195 + 8 * 205 + 6 * 215,
      },
      {
        ...findExercise("decline-machine-press"),
        notes: "Felt powerful today!",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 205,
            volume: 10 * 205,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 215,
            volume: 8 * 215,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 4,
            weight: 235,
            volume: 4 * 235,
            tempo: "2-0-2-0",
          },
        ],
        volume: 10 * 205 + 8 * 215 + 6 * 225 + 4 * 235,
      },
    ],
  },
  {
    id: "workout-2",
    date: "2025-11-24",
    split: "Back",
    exercises: [
      {
        ...findExercise("barbell-row"),
        notes: "Pulled solid, focused on squeeze.",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 165,
            volume: 1980,
            tempo: "3-1-1-1",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 175,
            volume: 1750,
            tempo: "3-1-1-1",
          },
          { id: "set-3", reps: 8, weight: 185, volume: 1480, tempo: "3-1-1-1" },
          { id: "set-4", reps: 6, weight: 195, volume: 1170, tempo: "3-1-1-1" },
        ],
        volume: 6380,
      },
      {
        ...findExercise("lat-pulldown"),
        notes: "Good lat engagement.",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 140,
            volume: 1680,
            tempo: "2-1-2-1",
          },
          {
            id: "set-2",
            reps: 12,
            weight: 150,
            volume: 1800,
            tempo: "2-1-2-1",
          },
          {
            id: "set-3",
            reps: 10,
            weight: 160,
            volume: 1600,
            tempo: "2-1-2-1",
          },
          { id: "set-4", reps: 8, weight: 170, volume: 1360, tempo: "2-1-2-1" },
        ],
        volume: 6440,
      },
    ],
  },
  {
    id: "workout-3",
    date: "2025-11-22",
    split: "Legs",
    exercises: [
      {
        ...findExercise("back-squat"),
        notes: "Heavy but controlled.",
        sets: [
          { id: "set-1", reps: 8, weight: 275, volume: 2200, tempo: "3-1-1-1" },
          { id: "set-2", reps: 8, weight: 285, volume: 2280, tempo: "3-1-1-1" },
          { id: "set-3", reps: 6, weight: 295, volume: 1770, tempo: "3-1-1-1" },
          { id: "set-4", reps: 4, weight: 305, volume: 1220, tempo: "3-1-1-1" },
        ],
        volume: 7470,
      },
      {
        ...findExercise("romanian-deadlift"),
        notes: "Hamstrings lit up.",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 225,
            volume: 2250,
            tempo: "3-1-2-1",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 235,
            volume: 2350,
            tempo: "3-1-2-1",
          },
          { id: "set-3", reps: 8, weight: 245, volume: 1960, tempo: "3-1-2-1" },
          { id: "set-4", reps: 8, weight: 255, volume: 2040, tempo: "3-1-2-1" },
        ],
        volume: 8600,
      },
    ],
  },
  {
    id: "workout-4",
    date: "2025-11-20",
    split: "Shoulders",
    exercises: [
      {
        ...findExercise("overhead-press"),
        notes: "Shoulders felt stable.",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 115,
            volume: 1150,
            tempo: "2-0-2-0",
          },
          { id: "set-2", reps: 8, weight: 120, volume: 960, tempo: "2-0-2-0" },
          { id: "set-3", reps: 6, weight: 125, volume: 750, tempo: "2-0-2-0" },
          { id: "set-4", reps: 6, weight: 130, volume: 780, tempo: "2-0-2-0" },
        ],
        volume: 3640,
      },
      {
        ...findExercise("lateral-raise"),
        notes: "Chasing the burn.",
        sets: [
          { id: "set-1", reps: 15, weight: 25, volume: 375, tempo: "2-0-2-0" },
          { id: "set-2", reps: 15, weight: 25, volume: 375, tempo: "2-0-2-0" },
          { id: "set-3", reps: 12, weight: 25, volume: 300, tempo: "2-0-2-0" },
          { id: "set-4", reps: 12, weight: 25, volume: 300, tempo: "2-0-2-0" },
        ],
        volume: 1350,
      },
    ],
  },
  {
    id: "workout-5",
    date: "2025-11-18",
    split: "Pull",
    exercises: [
      {
        ...findExercise("pull-up"),
        notes: "Bodyweight focus.",
        sets: [
          { id: "set-1", reps: 10, weight: 0, volume: 0, tempo: "2-1-2-1" },
          { id: "set-2", reps: 8, weight: 0, volume: 0, tempo: "2-1-2-1" },
          { id: "set-3", reps: 8, weight: 0, volume: 0, tempo: "2-1-2-1" },
          { id: "set-4", reps: 6, weight: 0, volume: 0, tempo: "2-1-2-1" },
        ],
        volume: 0,
      },
      {
        ...findExercise("single-arm-row"),
        notes: "Solid contraction.",
        sets: [
          { id: "set-1", reps: 12, weight: 70, volume: 840, tempo: "2-1-1-1" },
          { id: "set-2", reps: 12, weight: 75, volume: 900, tempo: "2-1-1-1" },
          { id: "set-3", reps: 10, weight: 80, volume: 800, tempo: "2-1-1-1" },
          { id: "set-4", reps: 10, weight: 85, volume: 850, tempo: "2-1-1-1" },
        ],
        volume: 3390,
      },
    ],
  },
  {
    id: "workout-6",
    date: "2025-11-16",
    split: "Push",
    exercises: [
      {
        ...findExercise("dumbbell-bench-press"),
        notes: "Great chest pump.",
        sets: [
          { id: "set-1", reps: 12, weight: 80, volume: 960, tempo: "2-0-2-0" },
          { id: "set-2", reps: 10, weight: 85, volume: 850, tempo: "2-0-2-0" },
          { id: "set-3", reps: 8, weight: 90, volume: 720, tempo: "2-0-2-0" },
          { id: "set-4", reps: 8, weight: 95, volume: 760, tempo: "2-0-2-0" },
        ],
        volume: 3290,
      },
      {
        ...findExercise("cable-fly"),
        notes: "Finished with stretch.",
        sets: [
          { id: "set-1", reps: 15, weight: 35, volume: 525, tempo: "2-1-2-1" },
          { id: "set-2", reps: 15, weight: 40, volume: 600, tempo: "2-1-2-1" },
          { id: "set-3", reps: 12, weight: 45, volume: 540, tempo: "2-1-2-1" },
          { id: "set-4", reps: 12, weight: 50, volume: 600, tempo: "2-1-2-1" },
        ],
        volume: 2265,
      },
    ],
  },
  {
    id: "workout-7",
    date: "2025-11-14",
    split: "Arms",
    exercises: [
      {
        ...findExercise("barbell-curl"),
        notes: "Good biceps peak.",
        sets: [
          { id: "set-1", reps: 12, weight: 70, volume: 840, tempo: "2-0-2-0" },
          { id: "set-2", reps: 10, weight: 75, volume: 750, tempo: "2-0-2-0" },
          { id: "set-3", reps: 10, weight: 80, volume: 800, tempo: "2-0-2-0" },
          { id: "set-4", reps: 8, weight: 85, volume: 680, tempo: "2-0-2-0" },
        ],
        volume: 3070,
      },
      {
        ...findExercise("triceps-pushdown"),
        notes: "Locked in triceps.",
        sets: [
          { id: "set-1", reps: 15, weight: 90, volume: 1350, tempo: "2-0-2-1" },
          { id: "set-2", reps: 12, weight: 95, volume: 1140, tempo: "2-0-2-1" },
          {
            id: "set-3",
            reps: 12,
            weight: 100,
            volume: 1200,
            tempo: "2-0-2-1",
          },
          {
            id: "set-4",
            reps: 10,
            weight: 105,
            volume: 1050,
            tempo: "2-0-2-1",
          },
        ],
        volume: 4740,
      },
    ],
  },
  {
    id: "workout-8",
    date: "2025-11-12",
    split: "Legs",
    exercises: [
      {
        ...findExercise("front-squat"),
        notes: "Core worked hard.",
        sets: [
          { id: "set-1", reps: 6, weight: 225, volume: 1350, tempo: "3-1-1-1" },
          { id: "set-2", reps: 6, weight: 235, volume: 1410, tempo: "3-1-1-1" },
          { id: "set-3", reps: 5, weight: 245, volume: 1225, tempo: "3-1-1-1" },
          { id: "set-4", reps: 4, weight: 255, volume: 1020, tempo: "3-1-1-1" },
        ],
        volume: 5005,
      },
      {
        ...findExercise("leg-press"),
        notes: "Quads smoked.",
        sets: [
          {
            id: "set-1",
            reps: 15,
            weight: 360,
            volume: 5400,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 15,
            weight: 405,
            volume: 6075,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 12,
            weight: 450,
            volume: 5400,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 10,
            weight: 495,
            volume: 4950,
            tempo: "2-0-2-0",
          },
        ],
        volume: 21825,
      },
    ],
  },
  {
    id: "workout-9",
    date: "2025-11-10",
    split: "Upper",
    exercises: [
      {
        ...findExercise("incline-dumbbell-bench"),
        notes: "Smooth presses.",
        sets: [
          { id: "set-1", reps: 12, weight: 75, volume: 900, tempo: "2-0-2-0" },
          { id: "set-2", reps: 10, weight: 80, volume: 800, tempo: "2-0-2-0" },
          { id: "set-3", reps: 8, weight: 85, volume: 680, tempo: "2-0-2-0" },
          { id: "set-4", reps: 8, weight: 90, volume: 720, tempo: "2-0-2-0" },
        ],
        volume: 3100,
      },
      {
        ...findExercise("t-bar-row"),
        notes: "Strong pulls.",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 135,
            volume: 1350,
            tempo: "2-1-1-1",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 145,
            volume: 1450,
            tempo: "2-1-1-1",
          },
          { id: "set-3", reps: 8, weight: 155, volume: 1240, tempo: "2-1-1-1" },
          { id: "set-4", reps: 8, weight: 165, volume: 1320, tempo: "2-1-1-1" },
        ],
        volume: 5360,
      },
    ],
  },
  {
    id: "workout-10",
    date: "2025-11-08",
    split: "Lower",
    exercises: [
      {
        ...findExercise("deadlift"),
        notes: "Pulled submax, felt good.",
        sets: [
          { id: "set-1", reps: 5, weight: 315, volume: 1575, tempo: "2-1-1-1" },
          { id: "set-2", reps: 5, weight: 335, volume: 1675, tempo: "2-1-1-1" },
          { id: "set-3", reps: 4, weight: 355, volume: 1420, tempo: "2-1-1-1" },
          { id: "set-4", reps: 3, weight: 375, volume: 1125, tempo: "2-1-1-1" },
        ],
        volume: 5795,
      },
      {
        ...findExercise("walking-lunge"),
        notes: "Glutes and quads on fire.",
        sets: [
          { id: "set-1", reps: 12, weight: 50, volume: 600, tempo: "2-0-2-0" },
          { id: "set-2", reps: 12, weight: 50, volume: 600, tempo: "2-0-2-0" },
          { id: "set-3", reps: 10, weight: 50, volume: 500, tempo: "2-0-2-0" },
          { id: "set-4", reps: 10, weight: 50, volume: 500, tempo: "2-0-2-0" },
        ],
        volume: 2200,
      },
    ],
  },
  {
    id: "workout-11",
    date: "2025-11-06",
    split: "Full Body",
    exercises: [
      {
        ...findExercise("bench-press"),
        notes: "Quick full body touch-up.",
        sets: [
          { id: "set-1", reps: 8, weight: 185, volume: 1480, tempo: "2-0-2-0" },
          { id: "set-2", reps: 8, weight: 195, volume: 1560, tempo: "2-0-2-0" },
          { id: "set-3", reps: 6, weight: 205, volume: 1230, tempo: "2-0-2-0" },
          { id: "set-4", reps: 6, weight: 215, volume: 1290, tempo: "2-0-2-0" },
        ],
        volume: 5560,
      },
      {
        ...findExercise("back-squat"),
        notes: "Kept it moderate.",
        sets: [
          { id: "set-1", reps: 6, weight: 245, volume: 1470, tempo: "3-1-1-1" },
          { id: "set-2", reps: 6, weight: 255, volume: 1530, tempo: "3-1-1-1" },
          { id: "set-3", reps: 5, weight: 265, volume: 1325, tempo: "3-1-1-1" },
          { id: "set-4", reps: 5, weight: 275, volume: 1375, tempo: "3-1-1-1" },
        ],
        volume: 5700,
      },
    ],
  },
  {
    id: "workout-chest-2",
    date: "2025-11-19",
    split: "Chest",
    exercises: [
      {
        ...findExercise("bench-press"),
        notes: "Top sets moved a bit slower, but form stayed tight.",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 195,
            volume: 10 * 195,
            tempo: "3-1-1-1",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "3-1-1-1",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "3-1-1-1",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 215,
            volume: 6 * 215,
            tempo: "3-1-1-1",
          },
        ],
        volume: 10 * 195 + 8 * 205 + 8 * 205 + 6 * 215,
      },
      {
        ...findExercise("incline-bench-press"),
        notes: "Slight shoulder fatigue, backed off on last set.",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 195,
            volume: 10 * 195,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 195,
            volume: 6 * 195,
            tempo: "2-0-2-0",
          },
        ],
        volume: 10 * 195 + 8 * 205 + 8 * 205 + 6 * 195,
      },
    ],
  },
  {
    id: "workout-chest-3",
    date: "2025-11-12",
    split: "Chest",
    exercises: [
      {
        ...findExercise("dumbbell-bench-press"),
        notes: "Great pump, kept rest times short.",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 80,
            volume: 12 * 80,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 85,
            volume: 10 * 85,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 90,
            volume: 8 * 90,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 8,
            weight: 90,
            volume: 8 * 90,
            tempo: "2-0-2-0",
          },
        ],
        volume: 12 * 80 + 10 * 85 + 8 * 90 + 8 * 90,
      },
      {
        ...findExercise("incline-dumbbell-bench-press"),
        notes: "Upper chest felt solid, no shoulder issues.",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 70,
            volume: 12 * 70,
            tempo: "3-0-2-0",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 75,
            volume: 10 * 75,
            tempo: "3-0-2-0",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 80,
            volume: 8 * 80,
            tempo: "3-0-2-0",
          },
          {
            id: "set-4",
            reps: 8,
            weight: 80,
            volume: 8 * 80,
            tempo: "3-0-2-0",
          },
        ],
        volume: 12 * 70 + 10 * 75 + 8 * 80 + 8 * 80,
      },
    ],
  },
  {
    id: "workout-chest-4",
    date: "2025-11-05",
    split: "Chest",
    exercises: [
      {
        ...findExercise("bench-press"),
        notes: "Deload week, focused on speed and technique.",
        sets: [
          {
            id: "set-1",
            reps: 10,
            weight: 165,
            volume: 10 * 165,
            tempo: "2-0-1-0",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 165,
            volume: 10 * 165,
            tempo: "2-0-1-0",
          },
          {
            id: "set-3",
            reps: 8,
            weight: 175,
            volume: 8 * 175,
            tempo: "2-0-1-0",
          },
          {
            id: "set-4",
            reps: 8,
            weight: 175,
            volume: 8 * 175,
            tempo: "2-0-1-0",
          },
        ],
        volume: 10 * 165 + 10 * 165 + 8 * 175 + 8 * 175,
      },
      {
        ...findExercise("cable-fly"),
        notes: "Big stretch at the bottom, kept it light.",
        sets: [
          {
            id: "set-1",
            reps: 15,
            weight: 30,
            volume: 15 * 30,
            tempo: "2-1-2-1",
          },
          {
            id: "set-2",
            reps: 15,
            weight: 35,
            volume: 15 * 35,
            tempo: "2-1-2-1",
          },
          {
            id: "set-3",
            reps: 12,
            weight: 40,
            volume: 12 * 40,
            tempo: "2-1-2-1",
          },
          {
            id: "set-4",
            reps: 12,
            weight: 40,
            volume: 12 * 40,
            tempo: "2-1-2-1",
          },
        ],
        volume: 15 * 30 + 15 * 35 + 12 * 40 + 12 * 40,
      },
    ],
  },
  {
    id: "workout-chest-5",
    date: "2025-10-29",
    split: "Chest",
    exercises: [
      {
        ...findExercise("incline-bench-press"),
        notes: "Worked up to a heavier top set, slight grind on last rep.",
        sets: [
          {
            id: "set-1",
            reps: 8,
            weight: 205,
            volume: 8 * 205,
            tempo: "3-1-1-1",
          },
          {
            id: "set-2",
            reps: 8,
            weight: 215,
            volume: 8 * 215,
            tempo: "3-1-1-1",
          },
          {
            id: "set-3",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "3-1-1-1",
          },
          {
            id: "set-4",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "3-1-1-1",
          },
        ],
        volume: 8 * 205 + 8 * 215 + 6 * 225 + 6 * 225,
      },
      {
        ...findExercise("machine-chest-press"),
        notes: "Controlled negatives, chased the burn.",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 160,
            volume: 12 * 160,
            tempo: "3-0-2-0",
          },
          {
            id: "set-2",
            reps: 12,
            weight: 170,
            volume: 12 * 170,
            tempo: "3-0-2-0",
          },
          {
            id: "set-3",
            reps: 10,
            weight: 180,
            volume: 10 * 180,
            tempo: "3-0-2-0",
          },
          {
            id: "set-4",
            reps: 10,
            weight: 180,
            volume: 10 * 180,
            tempo: "3-0-2-0",
          },
        ],
        volume: 12 * 160 + 12 * 170 + 10 * 180 + 10 * 180,
      },
    ],
  },
  {
    id: "workout-chest-6",
    date: "2025-10-22",
    split: "Chest",
    exercises: [
      {
        ...findExercise("bench-press"),
        notes: "Paused every rep to work on control.",
        sets: [
          {
            id: "set-1",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "3-2-1-1",
          },
          {
            id: "set-2",
            reps: 6,
            weight: 225,
            volume: 6 * 225,
            tempo: "3-2-1-1",
          },
          {
            id: "set-3",
            reps: 5,
            weight: 235,
            volume: 5 * 235,
            tempo: "3-2-1-1",
          },
          {
            id: "set-4",
            reps: 4,
            weight: 245,
            volume: 4 * 245,
            tempo: "3-2-1-1",
          },
        ],
        volume: 6 * 225 + 6 * 225 + 5 * 235 + 4 * 245,
      },
      {
        ...findExercise("incline-dumbbell-bench-press"),
        notes: "Solid upper chest work after the heavy barbell sets.",
        sets: [
          {
            id: "set-1",
            reps: 12,
            weight: 70,
            volume: 12 * 70,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 10,
            weight: 75,
            volume: 10 * 75,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 10,
            weight: 75,
            volume: 10 * 75,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 8,
            weight: 80,
            volume: 8 * 80,
            tempo: "2-0-2-0",
          },
        ],
        volume: 12 * 70 + 10 * 75 + 10 * 75 + 8 * 80,
      },
    ],
  },
  {
    id: "workout-chest-7",
    date: "2025-10-15",
    split: "Chest",
    exercises: [
      {
        ...findExercise("dumbbell-bench-press"),
        notes: "Higher-rep day, big pump, stayed away from failure.",
        sets: [
          {
            id: "set-1",
            reps: 15,
            weight: 70,
            volume: 15 * 70,
            tempo: "2-0-2-0",
          },
          {
            id: "set-2",
            reps: 15,
            weight: 70,
            volume: 15 * 70,
            tempo: "2-0-2-0",
          },
          {
            id: "set-3",
            reps: 12,
            weight: 75,
            volume: 12 * 75,
            tempo: "2-0-2-0",
          },
          {
            id: "set-4",
            reps: 12,
            weight: 75,
            volume: 12 * 75,
            tempo: "2-0-2-0",
          },
        ],
        volume: 15 * 70 + 15 * 70 + 12 * 75 + 12 * 75,
      },
      {
        ...findExercise("cable-fly"),
        notes: "Finished with flies, focused on squeezing at peak.",
        sets: [
          {
            id: "set-1",
            reps: 20,
            weight: 25,
            volume: 20 * 25,
            tempo: "2-1-2-1",
          },
          {
            id: "set-2",
            reps: 20,
            weight: 25,
            volume: 20 * 25,
            tempo: "2-1-2-1",
          },
          {
            id: "set-3",
            reps: 15,
            weight: 30,
            volume: 15 * 30,
            tempo: "2-1-2-1",
          },
          {
            id: "set-4",
            reps: 15,
            weight: 30,
            volume: 15 * 30,
            tempo: "2-1-2-1",
          },
        ],
        volume: 20 * 25 + 20 * 25 + 15 * 30 + 15 * 30,
      },
    ],
  },
];
