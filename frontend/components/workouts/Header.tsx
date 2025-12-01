import Link from "next/link";

export function Header() {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Workouts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse your recent sessions, see what you hit, and jump back into a
          new workout.
        </p>
      </div>

      <Link href="/dailylog">
        <button className="rounded-md bg-primary primary-button">
          Start New Workout
        </button>
      </Link>
    </header>
  );
}
