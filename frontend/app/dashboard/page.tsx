export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Overview of your training, recent workouts, and highlights.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Today&apos;s Workout</h2>
          <p className="text-xs text-slate-400">
            Placeholder for today&apos;s planned session.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Recent Workouts</h2>
          <p className="text-xs text-slate-400">
            Placeholder list of last few workouts.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Highlights</h2>
          <p className="text-xs text-slate-400">
            Placeholder for PRs, volume trends, etc.
          </p>
        </div>
      </div>
    </section>
  );
}
