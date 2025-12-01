import type { Workout } from "@/types/workout";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

type WorkoutActionsMenuProps = {
  workout: Workout;
  isOpen: boolean;
  onToggle: () => void;
  onDuplicate: (workoutId: string) => void;
  onEdit: (workoutId: string) => void;
  onDelete: (workout: Workout) => void;
};

export function WorkoutActionsMenu({
  workout,
  isOpen,
  onToggle,
  onDuplicate,
  onEdit,
  onDelete,
}: WorkoutActionsMenuProps) {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onToggle}
        className="rounded-md px-2 py-1 text-lg leading-none text-muted-foreground hover:bg-card/80 hover:text-foreground"
        aria-label="Workout actions"
      >
        ⋯
      </button>

      {isOpen && (
        <AnimatedCard className="absolute right-0 mt-1 w-40 rounded-md border border-border bg-card/90 py-1 text-xs shadow-lg">
          <button
            type="button"
            onClick={() => onDuplicate(workout.id)}
            className="flex w-full items-center px-3 py-1.5 text-left hover:bg-card/70"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => onEdit(workout.id)}
            className="flex w-full items-center px-3 py-1.5 text-left hover:bg-card/70"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(workout)}
            className="flex w-full items-center px-3 py-1.5 text-left text-red-400 hover:bg-red-500/10"
          >
            Delete
          </button>
        </AnimatedCard>
      )}
    </div>
  );
}
