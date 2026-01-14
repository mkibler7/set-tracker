"use client";

import type { WorkoutExercise } from "@/types/workout";

type WorkoutExerciseCardProps = {
  exercise: WorkoutExercise;
  muscleLabel?: string;
  volume?: number;
  loadingMuscles?: boolean;
  fallbackName?: string;
};

export default function WorkoutExerciseCard({
  exercise,
  muscleLabel,
  volume = 0,
  loadingMuscles = false,
  fallbackName,
}: WorkoutExerciseCardProps) {
  const displayName =
    (exercise.exerciseName && exercise.exerciseName.trim()) ||
    (fallbackName && fallbackName.trim()) ||
    "Unknown exercise";

  return (
    <div className="rounded-lg border border-border bg-card/70 p-4 text-sm shadow-sm mr-2">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            {displayName}
          </h2>

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {muscleLabel || (loadingMuscles ? "Loading muscles..." : "—")}
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          {volume.toLocaleString()} volume
        </span>
      </div>

      {exercise.sets && exercise.sets.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
              <tr className="border-b border-border/60">
                <th className="px-3 py-2 text-left font-medium">Set</th>
                <th className="px-3 py-2 text-left font-medium">Weight</th>
                <th className="px-3 py-2 text-left font-medium">Reps</th>
                {exercise.sets.some((s: any) => s.tempo) && (
                  <th className="px-3 py-2 text-left font-medium">Tempo</th>
                )}
                {exercise.sets.some((s: any) => s.rpe) && (
                  <th className="px-3 py-2 text-left font-medium">RPE</th>
                )}
              </tr>
            </thead>

            <tbody>
              {exercise.sets.map((set: any, idx: number) => (
                <tr
                  key={set.id ?? idx}
                  className="border-b border-border/40 last:border-0 hover:bg-card/80"
                >
                  <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
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

      {exercise.notes && (
        <p className="mt-3 text-xs text-muted-foreground">{exercise.notes}</p>
      )}
    </div>
  );
}
