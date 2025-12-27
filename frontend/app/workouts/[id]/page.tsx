"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// import { MOCK_WORKOUTS } from "@/data/mockWorkouts"; // TODO: replace MOCK_WORKOUTS with API data once backend is wired up
import { WorkoutsAPI } from "@/lib/api/workouts";
import type { Workout, WorkoutExercise } from "@/types/workout";
import { formatWorkoutDate } from "@/lib/util/date";
import { exerciseVolume } from "@/lib/workouts/stats";
import PageBackButton from "@/components/shared/PageBackButton";
import { getExerciseMusclesById } from "@/lib/exercises";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [workout, setWorkout] = useState<Workout | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkout() {
      try {
        const data = await WorkoutsAPI.get(id);
        if (cancelled) return;
        setWorkout(data);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load workout:", err);
      }
    }

    loadWorkout();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Safe edit handler – does nothing if workout isn't loaded
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
      {/* Header */}
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

        {/* Summary chips */}
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

      {/* Exercises + sets */}
      <section className="flex-1 overflow-y-auto space-y-4 scroll pb-6">
        {workout.exercises.length > 0 ? (
          workout.exercises.map((exercise, index) => {
            const { muscleGroups } = getExerciseMusclesById(
              exercise.exerciseId
            );

            const exVolume = exerciseVolume(exercise as WorkoutExercise);

            return (
              <div
                key={exercise.exerciseId || index}
                className="rounded-lg border border-border bg-card/70 p-4 text-sm shadow-sm mr-2"
              >
                {/* Top row: name + volume */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="mb-2 text-sm font-semibold text-foreground">
                      {exercise.exerciseName}
                    </h2>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {muscleGroups.join(" / ")}
                    </p>
                  </div>

                  {/* top-right volume display */}
                  <span className="text-xs text-muted-foreground">
                    {exVolume.toLocaleString()} volume
                  </span>
                </div>

                {/* Sets table */}
                {exercise.sets && exercise.sets.length > 0 && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                        <tr className="border-b border-border/60">
                          <th className="px-3 py-2 text-left font-medium">
                            Set
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Weight
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Reps
                          </th>
                          {exercise.sets.some((s: any) => s.tempo) && (
                            <th className="px-3 py-2 text-left font-medium">
                              Tempo
                            </th>
                          )}
                          {exercise.sets.some((s: any) => s.rpe) && (
                            <th className="px-3 py-2 text-left font-medium">
                              RPE
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.sets.map((set: any, index: number) => (
                          <tr
                            key={set.id ?? index}
                            className="border-b border-border/40 last:border-0 hover:bg-card/80"
                          >
                            <td className="px-3 py-2 text-muted-foreground">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2">{set.weight ?? "--"}</td>
                            <td className="px-3 py-2">{set.reps ?? "--"}</td>
                            {exercise.sets.some((s: any) => s.tempo) && (
                              <td className="px-3 py-2">{set.tempo ?? "--"}</td>
                            )}
                            {exercise.sets.some((s: any) => s.rpe) && (
                              <td className="px-3 py-2">{set.rpe ?? "--"}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Notes */}
                {exercise.notes && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {exercise.notes}
                  </p>
                )}
              </div>
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
