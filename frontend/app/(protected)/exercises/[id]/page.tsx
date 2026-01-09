import PageBackButton from "@/components/shared/PageBackButton";
import Header from "@/components/exerciseInfo/Header";
import ExerciseHistoryCard from "@/components/exerciseInfo/ExerciseHistoryCard";
import ActiveLogExerciseCard from "@/components/exerciseInfo/ActiveLogExerciseCard";
import type { Exercise, ExerciseHistoryEntry } from "@/types/exercise";
import { formatWorkoutDate } from "@/lib/util/date";
import type { Workout } from "@/types/workout";
import { apiServer, ApiServerError } from "@/lib/api/apiServer";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fromDailyLog?: string }>;
};

// Mongo normalization for server fetch
type ExerciseFromApi = Omit<Exercise, "id"> & {
  _id: string;
  id?: string;
};

function normalizeExercise(e: ExerciseFromApi): Exercise {
  return { ...e, id: e.id ?? e._id };
}

export default async function ExerciseDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const fromDailyLog = query.fromDailyLog === "true";

  let exercise: Exercise | null = null;
  let allWorkouts: Workout[] = [];

  try {
    const [exerciseRaw, workouts] = await Promise.all([
      apiServer<ExerciseFromApi>(`/api/exercises/${id}`),
      apiServer<Workout[]>(`/api/workouts`),
    ]);

    exercise = normalizeExercise(exerciseRaw);
    allWorkouts = workouts;
  } catch (e) {
    // If the exercise endpoint returns 404, show “not found”
    if (e instanceof ApiServerError && e.status === 404) {
      exercise = null;
    } else {
      // For other errors (401, 500), rethrow so you see it during dev
      throw e;
    }
  }

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

  const historyRaw = allWorkouts
    .filter((w) => w.exercises.some((ex) => ex.exerciseId === exercise!.id))
    .map((w) => {
      const ex = w.exercises.find((x) => x.exerciseId === exercise!.id)!;
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

      <Header exercise={exercise} />

      {fromDailyLog && (
        <div className="mt-4 mb-4">
          <ActiveLogExerciseCard exerciseId={exercise.id} />
        </div>
      )}

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
