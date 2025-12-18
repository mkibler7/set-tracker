"use client";

import { useRouter } from "next/navigation";
import type { ExerciseHistoryEntry } from "@/types/exercise";
import { exerciseVolume } from "@/lib/workouts/stats";

type ExerciseHistoryCardProps = {
  entry: ExerciseHistoryEntry;
};

/**
 * ExerciseHistoryCard
 *
 * Shows one workout that included this exercise:
 * - Workout name + date
 * - Total volume
 * - Table of sets (weight / reps / tempo / RPE)
 * - "View workout" button that links to the full workout detail page
 */
export default function ExerciseHistoryCard({
  entry,
}: ExerciseHistoryCardProps) {
  const router = useRouter();

  const handleViewWorkout = () => {
    router.push(`/workouts/${entry.workoutId}`);
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-6 sm:py-4">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className=" mb-1 flex gap-1 items-center">
            <p className="text-sm font-semibold text-foreground">
              {entry.workoutName}
            </p>
            <p className="text-xs font-light">• {entry.workoutDate}</p>
          </div>
          <h3 className="text-xs text-muted-foreground">
            {exerciseVolume(entry).toLocaleString()} volume
          </h3>
        </div>

        <button
          type="button"
          className="text-xs text-emerald-400 hover:underline"
          onClick={handleViewWorkout}
        >
          View workout
        </button>
      </header>

      {/* Sets table */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-xs text-slate-300">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="py-1 text-left">Set</th>
              <th className="py-1 text-right">Weight</th>
              <th className="py-1 text-right">Reps</th>
              <th className="py-1 text-right">Tempo</th>
              <th className="py-1 text-right">RPE</th>
            </tr>
          </thead>
          <tbody>
            {entry.sets.map((set) => (
              <tr key={set.setNumber} className="border-b border-slate-900">
                <td className="py-1">{set.setNumber}</td>
                <td className="py-1 text-right">{set.weight}</td>
                <td className="py-1 text-right">{set.reps}</td>
                <td className="py-1 text-right">{set.tempo ?? "-"}</td>
                <td className="py-1 text-right">{set.rpe ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional workout notes */}
      {entry.notes && (
        <p className="mt-2 text-xs text-slate-400">{entry.notes}</p>
      )}
    </article>
  );
}
