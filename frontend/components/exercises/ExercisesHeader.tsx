import PageBackButton from "@/components/shared/PageBackButton";
import { add } from "date-fns";

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

      <div className="mb-5 flex items-center justify-between gap-2">
        <h1 className="text-2xl mb-1 font-semibold tracking-tight text-foreground">
          Exercises
        </h1>
        <button className="primary-button" onClick={onAddExercise}>
          + Add Exercise
        </button>
      </div>

      <div className="mt-1 mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Browse and manage your exercise library. Click an exercise to view
          details and history.
        </p>

        <div className="w-full max-w-xs">
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
  );
}
