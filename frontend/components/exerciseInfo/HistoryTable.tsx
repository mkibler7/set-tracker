import { exerciseVolume } from "@/lib/workouts/stats";
import type { ExerciseHistoryEntry } from "@/types/exercise";
import { format } from "date-fns";

type HistoryTableProps = {
  history: ExerciseHistoryEntry[];
};

/**
 * Compact history table for an exercise.
 * - One row per workout
 * - Date, top set, total volume, and notes
 */
export default function HistoryTable({ history }: HistoryTableProps) {
  const hasHistory = history.length > 0;

  return (
    <div className="rounded-2xl bg-slate-900/60 p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        History
      </h2>

      {!hasHistory ? (
        <p className="mt-3 text-sm text-slate-400">
          No history yet. Once you log sets for this exercise, they&apos;ll show
          up here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-200">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-1 pr-4">Date</th>
                <th className="py-1 pr-4">Top Set</th>
                <th className="py-1 pr-4">Total Volume</th>
                <th className="py-1 pr-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr
                  key={row.workoutId}
                  className="border-b border-slate-800 last:border-0"
                >
                  <td className="py-1 pr-4">
                    {format(new Date(row.workoutDate), "MMM d, yyyy")}
                  </td>

                  <td className="py-1 pr-4">
                    {row.sets.length > 0
                      ? `${row.sets[0].weight} x ${row.sets[0].reps}`
                      : "-"}
                  </td>

                  <td className="py-1 pr-4">
                    {exerciseVolume(row).toLocaleString()} lb
                  </td>

                  <td className="max-w-xs py-1 pr-4 truncate text-slate-400">
                    {row.notes ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
