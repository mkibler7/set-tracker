"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkoutsAPI } from "@/lib/api/workouts";
import { ExerciseAPI } from "@/lib/api/exercises";
import type { Exercise } from "@/types/exercise";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";
import type { Workout, WorkoutExercise } from "@/types/workout";
import { formatWorkoutDate } from "@/lib/util/date";
import { exerciseVolume } from "@/lib/workouts/stats";
import PageBackButton from "@/components/shared/PageBackButton";
import WorkoutExerciseCard from "@/components/workouts/WorkoutExerciseCard";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [workout, setWorkout] = useState<Workout | undefined>(undefined);
  const [exerciseCatalog, setExerciseCatalog] = useState<Exercise[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Load exercise catalog
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setCatalogLoading(true);
        const list = await ExerciseAPI.list();
        if (!cancelled) setExerciseCatalog(list);
      } catch (e) {
        console.error("Failed to load exercise catalog:", e);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const catalogById = useMemo(() => {
    return Object.fromEntries(exerciseCatalog.map((e) => [e.id, e]));
  }, [exerciseCatalog]);

  // Load workout data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await WorkoutsAPI.get(id);
        if (!cancelled) setWorkout(data);
      } catch (err) {
        if (!cancelled) console.error("Failed to load workout:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleEdit = () => {
    if (!workout) return;
    router.push(`/dailylog?fromWorkout=${workout.id}`);
  };

  if (!workout) {
    return (
      <main className="flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <PageBackButton />
          <div className="rounded-lg border border-border bg-card/60 p-6 text-sm text-muted-foreground">
            Workout not found.
          </div>
        </div>
      </main>
    );
  }

  const exerciseCount = workout.exercises.length;

  const setCount = workout.exercises.reduce(
    (total, exercise) => total + (exercise.sets ? exercise.sets.length : 0),
    0
  );

  const totalVolume = workout.exercises.reduce(
    (total, ex) => total + exerciseVolume(ex),
    0
  );

  return (
    <main className="page">
      <header className="mb-6">
        <div className="flex items-center justify-between gap-2">
          <PageBackButton />
        </div>

        <p className="mb-2 text-sm tracking-tight text-muted-foreground">
          Completed workout:
        </p>

        <div className="flex items-center justify-between">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
            {workout.muscleGroups.join(" / ")}
          </h1>
          <button type="button" onClick={handleEdit} className="primary-button">
            Edit workout
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {formatWorkoutDate(workout.date)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-card/70 px-3 py-1 text-muted-foreground">
            {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
          </span>
          <span className="rounded-full bg-card/70 px-3 py-1 text-muted-foreground">
            {setCount} {setCount === 1 ? "set" : "sets"}
          </span>
          <span className="rounded-full bg-card/70 px-3 py-1 text-muted-foreground">
            {totalVolume.toLocaleString()} total volume
          </span>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto space-y-4 scroll pb-6">
        {workout.exercises.length > 0 ? (
          workout.exercises.map((exercise, index) => {
            const meta = catalogById[exercise.exerciseId];
            const muscleLabel = meta ? formatExerciseMuscleLabel(meta) : "";
            const volume = exerciseVolume(exercise as WorkoutExercise);

            return (
              <WorkoutExerciseCard
                key={exercise.exerciseId ?? index}
                exercise={exercise as WorkoutExercise}
                muscleLabel={muscleLabel}
                loadingMuscles={catalogLoading}
                fallbackName={meta?.name}
                volume={volume}
              />
            );
          })
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
            No exercises recorded for this workout.
          </div>
        )}
      </section>
    </main>
  );
}
