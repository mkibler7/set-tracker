import type { Exercise, MuscleGroup } from "@/types/exercise";
import { MOCK_EXERCISES } from "@/data/mockExercises";

// Build once at module load
const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  MOCK_EXERCISES.map((e) => [e.id, e])
);

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_BY_ID[id];
}

export function getExerciseMusclesById(id: string): {
  muscleGroups: MuscleGroup[];
} {
  if (!(id in EXERCISE_BY_ID)) {
    console.error(`Exercise with id ${id} not found.`);
    return { muscleGroups: [] };
  }
  const exercise = EXERCISE_BY_ID[id];
  const muscleGroups: MuscleGroup[] = [exercise.primaryMuscleGroup];
  if (exercise.secondaryMuscleGroups) {
    muscleGroups.push(...exercise.secondaryMuscleGroups);
  }

  return { muscleGroups };
}
