import PageBackButton from "@/components/shared/PageBackButton";

type ExercisesHeaderProps = {
  search: string;
  onSearchChange: (newSearch: string) => void;
  onAddExercise?: () => void;
};

export default function ExercisesHeader({
  search,
  onSearchChange,
  onAddExercise,
}: ExercisesHeaderProps) {
  return (
    <div>
      <PageBackButton />

      <header className="mt-6 space-y-4">
        {/* Row 1: Title + CTA */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-center sm:text-left">
            Exercises
          </h1>

          <button
            className="primary-button w-full sm:w-auto"
            onClick={onAddExercise}
          >
            + Add Exercise
          </button>
        </div>

        {/* Row 2: Description + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left sm:max-w-xl">
            Browse and manage your exercise library. Click an exercise to view
            details and history.
          </p>

          <div className="w-full max-w-xs mx-auto sm:mx-0">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search exercises..."
              className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        </div>
      </header>
    </div>
  );
}
