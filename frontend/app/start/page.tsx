export default function StartWorkoutPage() {
  const today = new Date().toLocaleDateString();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Start Workout</h1>
        <p className="text-sm text-slate-400">Today: {today}</p>
        <p className="text-xs text-slate-400">
          Select exercises and begin logging your sets. This is mock-only for
          now.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Current Session</h2>
          <p className="text-xs text-slate-400">
            Placeholder for selected exercises and their sets.
          </p>
        </div>

        <aside className="space-y-4 rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Exercise Picker</h2>
          <p className="text-xs text-slate-400">
            Placeholder for a modal/drawer or list to choose exercises.
          </p>
        </aside>
      </div>
    </section>
  );
}
