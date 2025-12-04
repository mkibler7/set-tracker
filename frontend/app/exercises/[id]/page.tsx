"use client";

import { useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import type { CurrentSessionExercise } from "@/types/exercise";
import { MOCK_EXERCISES } from "@/data/mockExercises";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import DetailHeader from "@/components/exercises/DetailHeader";
import CurrentSessionCard from "@/components/exercises/CurrentSessionCard";
import HistoryTable from "@/components/exercises/HistoryTable";
import type { ExerciseHistoryEntry } from "@/types/exercise";
import { formatWorkoutDate } from "@/lib/util/date";
import PageBackButton from "@/components/shared/PageBackButton";

export default function ExerciseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const from = searchParams.get("from");

  const exercisesInWorkout = useWorkoutStore((s) => s.exercises);
  const currentWorkoutId = useWorkoutStore((s) => s.currentWorkoutId);

  const exercise = useMemo(() => MOCK_EXERCISES.find((e) => e.id === id), [id]);

  const history = useMemo<ExerciseHistoryEntry[]>(() => {
    return MOCK_WORKOUTS.flatMap((workout) => {
      // find this exercise inside the workout
      const exercise = workout.exercises.find((e) => e.id === id);
      if (!exercise) return [];

      const sets = exercise.sets ?? [];

      // total volume = sum(weight * reps)
      const totalVolume = sets.reduce((sum, s) => {
        const weight = s.weight ?? 0;
        const reps = s.reps ?? 0;
        return sum + weight * reps;
      }, 0);

      // “top set” = heaviest set in that workout
      const topSet =
        sets.reduce<{ weight: number; reps: number } | null>((best, s) => {
          if (s.weight == null || s.reps == null) return best;
          if (!best || s.weight > best.weight) {
            return { weight: s.weight, reps: s.reps };
          }
          return best;
        }, null) ?? null;

      return [
        {
          workoutId: workout.id,
          workoutDate: formatWorkoutDate(workout.date), // adjust if your field is named differently
          topSet,
          totalVolume,
          notes: exercise.notes,
        },
      ];
    });
  }, [id]);

  // 🔍 pull current-session data from the global workout store
  const currentSession: CurrentSessionExercise | null =
    from === "dailylog"
      ? (() => {
          // ⬇️ adjust this matcher to however your WorkoutExercise links to the Exercise
          const match = exercisesInWorkout.find(
            (e: any) => e.exerciseId === id || e.id === id
          );
          if (!match) return null;

          return {
            exerciseId: id,
            exerciseName: (match as any).name ?? exercise?.name ?? "",
            sets: (match as any).sets ?? [],
          };
        })()
      : null;

  if (!exercise) {
    return (
      <main className="flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
        <PageBackButton />
        <p className="text-slate-200">Exercise not found.</p>
      </main>
    );
  }

  return (
    <main className="flex h-full px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
        <DetailHeader
          name={exercise.name}
          primary={exercise.primaryMuscleGroup}
          secondary={exercise.secondaryMuscleGroups}
        />

        {/* Only show this block when navigated from Daily Log */}
        {currentSession && (
          <section className="mt-4">
            <CurrentSessionCard
              session={currentSession}
              workoutId={currentWorkoutId}
            />
          </section>
        )}

        {/* description + tips + history same as we outlined earlier */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* ... description / tips cards ... */}
        </section>

        <section className="mt-8">
          <HistoryTable history={history} />
        </section>
      </div>
    </main>
  );
}
// Note: The above code assumes that the global workout store's WorkoutExercise
// structure includes an 'exerciseId' field to link back to the Exercise.
// Adjust the matching logic as necessary based on your actual data structures.
