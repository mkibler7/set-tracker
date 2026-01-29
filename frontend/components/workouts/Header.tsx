import Link from "next/link";

export function Header() {
  return (
    <header className="">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground w-full text-center">
        Workouts
      </h1>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="my-3 text-sm text-muted-foreground sm:max-w-sm">
          Browse your recent sessions, see what you hit, and jump back into a
          new workout.
        </p>

        <Link href="/dailylog" className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto rounded-md bg-primary text-primary-foreground 
          font-semibold h-10 px-4 text-sm sm:h-9 sm:px-4 sm:text-sm hover:opacity-90"
          >
            Start New Workout
          </button>
        </Link>
      </div>
    </header>
  );
}
