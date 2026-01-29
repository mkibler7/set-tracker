type ExercisesHeaderProps = {
  search: string;
  onSearchChange: (newSearch: string) => void;
  onAddExercise?: () => void;
  splitControl?: React.ReactNode;
};

export default function ExercisesHeader({
  search,
  onSearchChange,
  onAddExercise,
  splitControl,
}: ExercisesHeaderProps) {
  return (
    <header className="mt-6 space-y-4 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground text-center w-full">
        Exercises
      </h1>

      <div className="flex flex-col items-center gap-3 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-6">
        <p className="text-sm text-muted-foreground text-center lg:text-left">
          Browse and manage your exercise library. Click an exercise to view
          details and history.
        </p>

        {/* Controls */}
        <div className="w-full flex flex-col gap-3 lg:items-end">
          <button
            className="w-full sm:w-auto rounded-md bg-primary text-primary-foreground font-semibold
               h-10 px-4 text-sm sm:h-9 hover:opacity-90"
            onClick={onAddExercise}
          >
            + Add Exercise
          </button>

          {/* Mobile: full width stack. Desktop: right-aligned grouped row with intentional sizing */}
          <div className="w-full lg:max-w-[520px]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:gap-2">
              {/* Split: fixed width on desktop so it feels like a deliberate “selector” */}
              <div className="w-full lg:w-[160px] shrink-0">{splitControl}</div>

              {/* Search: grows to fill remaining space */}
              <div className="w-full lg:flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search exercises..."
                  className="h-10 w-full rounded-md border border-border bg-card/60 px-3 text-sm text-foreground
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
