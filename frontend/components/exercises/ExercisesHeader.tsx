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
      <header className="mt-6 space-y-4 lg:max-w-2xl lg:mx-auto">
        {/* Row 1: Title + CTA */}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-center w-full text-centersm:text-left">
          Exercises
        </h1>

        {/* Mobile: stacked/centered. Desktop: two-column. */}
        <div className="flex flex-col items-center gap-3 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-6">
          {/* Description */}
          <p className="text-sm text-muted-foreground text-center lg:text-left">
            Browse and manage your exercise library. Click an exercise to view
            details and history.
          </p>

          {/* Controls: right column, right-aligned */}
          <div className="w-full flex flex-col gap-3 lg:items-end">
            <button
              className="primary-button w-full lg:w-auto"
              onClick={onAddExercise}
            >
              + Add Exercise
            </button>

            <div className="w-full lg:w-[320px]">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search exercises..."
                className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
