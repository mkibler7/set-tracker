import type { CurrentSessionExercise } from "@/types/exercise";

export default function CurrentSessionCard({
  session,
  workoutId,
}: {
  session: CurrentSessionExercise;
  workoutId: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-5 shadow-md">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
          Current Session
        </h2>
        {workoutId && (
          <p className="text-xs text-slate-400">
            Workout #{workoutId} (unsaved / mock for now)
          </p>
        )}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-xs text-slate-200">
          <thead className="border-b border-slate-700 text-slate-400">
            <tr>
              <th className="py-1 pr-4">Set</th>
              <th className="py-1 pr-4">Reps</th>
              <th className="py-1 pr-4">Weight</th>
              <th className="py-1 pr-4">RPE</th>
              <th className="py-1 pr-4">Tempo</th>
            </tr>
          </thead>
          <tbody>
            {session.sets.map((set) => (
              <tr
                key={set.id}
                className="border-b border-slate-800 last:border-0"
              >
                <td className="py-1 pr-4">#{set.setNumber}</td>
                <td className="py-1 pr-4">{set.reps}</td>
                <td className="py-1 pr-4">{set.weight} lb</td>
                <td className="py-1 pr-4">{set.rpe ?? "-"}</td>
                <td className="py-1 pr-4">{set.tempo ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
