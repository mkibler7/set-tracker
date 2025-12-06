import type { Workout, WorkoutExercise } from "@/types/workout";

/**
 * Returns the number of exercises in a workout.
 */
export function getExerciseCount(workout: Workout): number {
  return workout.exercises.length;
}

/**
 * Returns the total number of sets across all exercises in a workout.
 */
export function getSetCount(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
}

/**
 * Returns the total training volume for a workout.
 *
 */
export function getTotalVolume(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.volume;
  }, 0);
}

/**
 * Returns the total volume for a specific exercise within a workout.
 */
export function exerciseVolume(exercise: WorkoutExercise): number {
  if (typeof (exercise as any).volume === "number") {
    return (exercise as any).volume;
  }
  if (!exercise.sets) return 0;

  return exercise.sets.reduce((total: number, set: any) => {
    if (typeof set.volume === "number") return total + set.volume;
    const weight = set.weight ?? 0;
    const reps = set.reps ?? 0;
    return total + weight * reps;
  }, 0);
}

/**
 * Returns a new array of workouts sorted by date (newest → oldest).
 */
export function sortWorkoutsByDateDesc(workouts: Workout[]): Workout[] {
  return [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Returns a new array of workouts sorted by date (oldest → newest).
 */
export function sortWorkoutsByDateAsc(workouts: Workout[]): Workout[] {
  return [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Build a time-series dataset of training volume for charting.
 *
 * - Input can be in any order; we always sort oldest → newest so charts
 *   draw left-to-right in time.
 * - We return a *new* array (original workouts are never mutated).
 * - Each point has:
 *    - dateLabel: short, human-friendly label for the x-axis (e.g. "Nov 26")
 *    - volume: total workout volume (number) for the y-axis
 */
export function getVolumeSeries(workouts: Workout[]) {
  // 1) Create a sorted copy so we don't mutate the original array.
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 2) Map each workout into a chart datapoint.
  return sorted.map((w) => ({
    // Short date label for x-axis (e.g. "Nov 26")
    dateLabel: new Date(w.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),

    // Numeric volume for y-axis; Recharts/Chart.js can use this directly.
    volume: getTotalVolume(w),
  }));
}

/**
 * Normalize a date to the start of its ISO week (Monday, 00:00:00).
 * We use this as the grouping key for "weekly" stats.
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  // getDay(): 0 (Sun) - 6 (Sat)
  const day = d.getDay();
  // Convert to "days since Monday" -> 0 (Mon) - 6 (Sun)
  const daysSinceMonday = (day + 6) % 7;

  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysSinceMonday);
  return d;
}

/**
 * Build a *weekly* time-series of training volume for charting.
 *
 * - Workouts are grouped by their ISO week (starting Monday).
 * - For each week, we sum the total volume across all workouts.
 * - Result is sorted oldest → newest by week.
 *
 * Returned shape:
 *  [
 *    { weekStartISO: "2025-11-17", weekLabel: "Week of Nov 17", volume: 12345 },
 *    { weekStartISO: "2025-11-24", weekLabel: "Week of Nov 24", volume: 16780 },
 *    ...
 *  ]
 */
export function getWeeklyVolumeSeries(workouts: Workout[]) {
  // Map keyed by ISO week start date (YYYY-MM-DD)
  const weeklyMap = new Map<string, { weekStart: Date; totalVolume: number }>();

  for (const workout of workouts) {
    const workoutDate = new Date(workout.date);
    const weekStart = getWeekStart(workoutDate);
    const key = weekStart.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const current = weeklyMap.get(key) ?? {
      weekStart,
      totalVolume: 0,
    };

    current.totalVolume += getTotalVolume(workout);
    weeklyMap.set(key, current);
  }

  // Turn the map into a sorted array oldest → newest
  const weeklySeries = Array.from(weeklyMap.values()).sort(
    (a, b) => a.weekStart.getTime() - b.weekStart.getTime()
  );

  // Shape it for charts
  return weeklySeries.map((entry) => ({
    weekStartISO: entry.weekStart.toISOString().slice(0, 10),
    weekLabel: `Week of ${entry.weekStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`,
    volume: entry.totalVolume,
  }));
}
