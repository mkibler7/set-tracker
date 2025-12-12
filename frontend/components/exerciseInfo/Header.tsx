import type { Exercise } from "@/types/exercise";

type HeaderProps = {
  exercise: Exercise;
};

/**
 * Exercise detail header
 * - Name of the exercise
 * - Primary muscle (pill, highlighted)
 * - Secondary muscles (outlined pills)
 * - Optional description paragraph
 */
export default function Header({ exercise }: HeaderProps) {
  return (
    <section className="mb-5 max-w-3xl">
      {/* Exercise name */}
      <h1 className="text-2xl font-semibold text-slate-50 w-full text-center sm:text-left">
        {exercise.name}
      </h1>

      {/* Muscle group pills */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs justify-center sm:justify-start">
        <span className="rounded-full bg-primary px-3 py-1 text-foreground">
          {exercise.primaryMuscleGroup}
        </span>

        {exercise.secondaryMuscleGroups?.map((group) => (
          <span
            key={group}
            className="rounded-full border border-slate-700 px-3 py-1 text-slate-300"
          >
            {group}
          </span>
        ))}
      </div>

      {/* Optional description */}
      {exercise.description && (
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {exercise.description}
        </p>
      )}
    </section>
  );
}
