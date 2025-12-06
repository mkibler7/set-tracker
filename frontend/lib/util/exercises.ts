import type { Exercise, MuscleGroup } from "@/types/exercise";

/** Format primary + secondary muscle groups into a single label. */
export function formatMuscleGroups(
  primary: string,
  secondary?: string[]
): string {
  if (!secondary || secondary.length === 0) return primary;
  return [primary, ...secondary].join(" / ");
}

/** Convenience overload if you already have the Exercise object. */
export function formatExerciseMuscleLabel(exercise: Exercise): string {
  return formatMuscleGroups(
    exercise.primaryMuscleGroup,
    exercise.secondaryMuscleGroups
  );
}
