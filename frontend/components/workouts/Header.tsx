import Link from "next/link";

export function Header() {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Workouts
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          Browse your recent sessions, see what you hit, and jump back into a
          new workout.
        </p>
      </div>

      <Link href="/dailylog" className="w-full sm:w-auto">
        <button className="w-full sm:w-auto rounded-md bg-primary primary-button">
          Start New Workout
        </button>
      </Link>
    </header>
  );
}
