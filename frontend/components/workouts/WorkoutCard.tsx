import { Workout } from "@/types/workout";
import { AnimatedCard } from "../ui/AnimatedCard";
import { formatWorkoutDate } from "@/lib/util/date";
import Link from "next/link";
import { WorkoutActionsMenu } from "./WorkoutActionsMenu";
import {
  getExerciseCount,
  getSetCount,
  getTotalVolume,
} from "@/lib/workouts/stats";

type WorkoutCardProps = {
  workout: Workout;
  index: number;
  activeMenuId: string | null;
  setActiveMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDuplicate: (workoutId: string) => void;
  handleEdit: (workoutId: string) => void;
  handleDeleteClick: (workout: Workout) => void;
};

export function WorkoutCard({
  workout,
  index,
  activeMenuId,
  setActiveMenuId,
  handleDuplicate,
  handleEdit,
  handleDeleteClick,
}: WorkoutCardProps) {
  const exerciseCount = getExerciseCount(workout);
  const setCount = getSetCount(workout);
  const totalVolume = getTotalVolume(workout);

  const isMenuOpen = activeMenuId === workout.id;

  return (
    <div
      className={`relative ${isMenuOpen ? "z-20" : ""}`}
      onMouseEnter={() =>
        setActiveMenuId((current) =>
          current && current !== workout.id ? null : current
        )
      }
    >
      <AnimatedCard
        key={workout.id}
        index={index}
        className="relative flex flex-col rounded-lg border border-border bg-card/70 p-4 text-sm shadow-sm transition-colors hover:bg-card/90"
      >
        {/* Top: name + date */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1">
              {workout.split}
            </h2>
            <p className="text-xs text-muted-foreground">
              {formatWorkoutDate(workout.date)}
            </p>
          </div>
        </div>

        {/* Summary line */}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"} •{" "}
            {setCount} {setCount === 1 ? "set" : "sets"}
          </span>
          <span>{totalVolume.toLocaleString()} volume</span>
        </div>

        {/* Footer actions */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <Link
            href={`/workouts/${workout.id}`}
            className="text-emerald-400 hover:text-emerald-300"
          >
            View details →
          </Link>

          <WorkoutActionsMenu
            workout={workout}
            isOpen={activeMenuId === workout.id}
            onToggle={() =>
              setActiveMenuId((current) =>
                current === workout.id ? null : workout.id
              )
            }
            onDuplicate={handleDuplicate}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </AnimatedCard>
    </div>
  );
}
