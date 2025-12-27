import PageBackButton from "@/components/shared/PageBackButton";
import Header from "@/components/exerciseInfo/Header";
import ExerciseHistoryCard from "@/components/exerciseInfo/ExerciseHistoryCard";
import ActiveLogExerciseCard from "@/components/exerciseInfo/ActiveLogExerciseCard";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import { Exercise, ExerciseHistoryEntry } from "@/types/exercise";
import { formatWorkoutDate } from "@/lib/util/date";
import { ExerciseAPI } from "@/lib/api/exercises";
// import { apiServer } from "@/lib/api/apiServer";

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

  // Look up the exercise definition by id
  const exercise = await ExerciseAPI.get(id);

  // Build a flat "history per workout" list for this exercise
  const historyEntries: ExerciseHistoryEntry[] = MOCK_WORKOUTS.filter(
    (workout) => workout.exercises.some((ex) => ex.exerciseId === id)
  ).map((workout) => {
    // The specific exercise instance within this workout
    const target = workout.exercises.find((ex) => ex.exerciseId === id)!;

    const sets = target.sets.map((s, index) => ({
      setNumber: index + 1,
      weight: s.weight,
      reps: s.reps,
      tempo: s.tempo,
      rpe: s.rpe,
    }));

    const totalVolume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

    return {
      workoutId: workout.id,
      workoutDate: formatWorkoutDate(workout.date),
      workoutName: workout.muscleGroups.join(" / "),
      notes: target.notes,
      sets,
      totalVolume,
    };
  });

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
// Note: The above code assumes that the global workout store's WorkoutExercise
// structure includes an 'exerciseId' field to link back to the Exercise.
