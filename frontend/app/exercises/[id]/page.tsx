import PageBackButton from "@/components/shared/PageBackButton";
import Header from "@/components/exerciseInfo/Header";
import ExerciseHistoryCard from "@/components/exerciseInfo/ExerciseHistoryCard";
import ActiveLogExerciseCard from "@/components/exerciseInfo/ActiveLogExerciseCard";
import { ExerciseHistoryEntry } from "@/types/exercise";
import { formatWorkoutDate } from "@/lib/util/date";
import { ExerciseAPI } from "@/lib/api/exercises";
import { WorkoutsAPI } from "@/lib/api/workouts"; // server-safe? if it's apiClient, use apiServer instead
import type { Workout } from "@/types/workout";

import { WorkoutHistoryAPI } from "@/lib/api/workoutHistory";
import { apiServer } from "@/lib/api/apiServer";

type PageProps = {
  // Next.js 16 passes these as Promises in server components
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fromDailyLog?: string }>;
};

/**
 * ExerciseDetailPage
 *
 * - Shows an exercise header (name, muscles, description)
 * - When navigated from Daily Log (?fromDailyLog=true), also shows
 *   the *live* log card for this exercise (ActiveLogExerciseCard)
 * - Below that, shows historical performance cards for this exercise
 */
export default async function ExerciseDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  // Did the user come here from the Daily Log page?
  const fromDailyLog = query.fromDailyLog === "true";

  // Exercise definition
  const exercise = await ExerciseAPI.get(id);

  // If the id doesn't match any exercise, show a simple not-found state
  if (!exercise) {
    return (
      <main className="page">
        <div className="mx-auto w-full max-w-4xl">
          <PageBackButton />
          <p>Exercise not found.</p>
        </div>
      </main>
    );
  }

  // Workout history for this exercise
  const allWorkouts = await apiServer<Workout[]>("/api/workouts"); // server component -> use apiServer
  const historyRaw = allWorkouts
    .filter((w) => w.exercises.some((ex) => ex.exerciseId === exercise.id))
    .map((w) => {
      const ex = w.exercises.find((x) => x.exerciseId === exercise.id)!;
      return {
        workoutId: w.id,
        workoutDate: w.date,
        workoutName: w.muscleGroups.join(" / "),
        notes: ex.notes,
        sets: ex.sets.map((s, idx) => ({
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
          tempo: s.tempo,
          rpe: s.rpe,
        })),
      };
    });

  // Format dates + compute totalVolume on server
  const historyEntries: ExerciseHistoryEntry[] = historyRaw.map((entry) => {
    const totalVolume = entry.sets.reduce(
      (sum, s) => sum + s.weight * s.reps,
      0
    );
    return {
      ...entry,
      workoutDate: formatWorkoutDate(entry.workoutDate),
      totalVolume,
    };
  });

  return (
    <main className="page">
      <div className="mb-6">
        <PageBackButton />
      </div>

      {/* Header: title + muscle groups + description */}
      <Header exercise={exercise} />

      {/* Live log view when this page is opened from Daily Log */}
      {fromDailyLog && (
        <div className="mt-4 mb-4">
          <ActiveLogExerciseCard exerciseId={exercise.id} />
        </div>
      )}

      {/* Historical workouts that include this exercise */}
      <h2 className="mb-4 text-lg font-semibold">History</h2>
      <section className="mt-2 overflow-y-auto scroll">
        <div className="mr-3 space-y-4">
          {historyEntries.map((entry) => (
            <ExerciseHistoryCard key={entry.workoutId} entry={entry} />
          ))}
        </div>
      </section>
    </main>
  );
}
