import { isWithinInterval, parseISO, startOfWeek, subDays } from "date-fns";
import type { Workout } from "@/types/workout";

function countSets(workout: Workout): number {
  return (
    workout.exercises?.reduce((sum: number, ex: any) => {
      return sum + (ex.sets?.length ?? 0);
    }, 0) ?? 0
  );
}

export function computeDashboardStats(workouts: Workout[]) {
  const now = new Date();

  // Rolling last 7 days (inclusive: today + 6 prior days)
  const start7 = subDays(now, 6);

  const workoutsLast7 = workouts.filter((w) => {
    const d = parseISO(w.date);
    return isWithinInterval(d, { start: start7, end: now });
  });

  const workoutsLast7Days = workoutsLast7.length;
  const totalSetsLast7Days = workoutsLast7.reduce(
    (sum, w) => sum + countSets(w),
    0
  );

  return { workoutsLast7Days, totalSetsLast7Days };
}
