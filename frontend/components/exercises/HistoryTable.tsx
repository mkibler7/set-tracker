import type { ExerciseHistoryEntry } from "@/types/exercise";
import { format } from "date-fns";

export default function HistoryTable({
  history,
}: {
  history: ExerciseHistoryEntry[];
}) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        History
      </h2>

      {history.length === 0 ? (
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
              {history.map((row) => {
                const topSet = row.sets[0];

                return (
                  <tr
                    key={row.workoutId}
                    className="border-b border-slate-800 last:border-0"
                  >
                    <td className="py-1 pr-4">
                      {format(new Date(row.workoutDate), "MMM d, yyyy")}
                    </td>
                    <td className="py-1 pr-4">
                      {topSet ? `${topSet.weight} x ${topSet.reps}` : "-"}
                    </td>
                    <td className="py-1 pr-4">
                      {row.totalVolume.toLocaleString()} lb
                    </td>
                    <td className="py-1 pr-4 max-w-xs truncate text-slate-400">
                      {row.notes ?? ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
