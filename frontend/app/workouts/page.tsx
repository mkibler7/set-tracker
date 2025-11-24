import Link from "next/link";

const mockWorkouts = [
  { id: "1", date: "2025-11-01", label: "Upper Body" },
  { id: "2", date: "2025-11-03", label: "Lower Body" },
];

export default function WorkoutsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workout History
        </h1>
        <p className="text-sm text-slate-400">
          Browse your previous training sessions. Using mock data for now.
        </p>
      </header>

      <ul className="space-y-2">
        {mockWorkouts.map((w) => (
          <li key={w.id}>
            <Link
              href={`/workouts/${w.id}`}
              className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3 text-sm hover:border-emerald-500"
            >
              <span>{w.date}</span>
              <span className="text-slate-400">{w.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
