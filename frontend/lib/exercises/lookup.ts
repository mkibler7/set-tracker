import type { Exercise } from "@/types/exercise";
import type { MuscleGroup } from "@reptracker/shared/muscles";

/**
 * Returns an Exercise definition from a catalog list, given an id.
 * Safely handles cases where the backend provides _id instead of id.
 */
export function getExerciseByIdFromList(
  catalog: Exercise[],
  exerciseId: string
): Exercise | undefined {
  if (!exerciseId) return undefined;

  return catalog.find((e: any) => (e.id ?? e._id) === exerciseId);
}

export function getExerciseMusclesByIdFromList(
  exercises: Exercise[],
  id: string
): { muscleGroups: MuscleGroup[] } {
  const ex = exercises.find((e) => e.id === id);
  if (!ex) return { muscleGroups: [] };
  return {
    muscleGroups: [ex.primaryMuscleGroup, ...(ex.secondaryMuscleGroups ?? [])],
  };
}
