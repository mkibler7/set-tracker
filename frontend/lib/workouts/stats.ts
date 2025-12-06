import type { Workout, WorkoutExercise } from "@/types/workout";

/**
 * Returns the number of exercises in a workout.
 */
export function getExerciseCount(workout: Workout): number {
  return workout.exercises.length;
}

/**
 * Returns the total number of sets across all exercises in a workout.
 */
export function getSetCount(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
}

/**
 * Returns the total training volume for a workout.
 *
 */
export function getTotalVolume(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.volume;
  }, 0);
}

/**
 * Returns the total volume for a specific exercise within a workout.
 */
export function exerciseVolume(exercise: WorkoutExercise): number {
  if (typeof (exercise as any).volume === "number") {
    return (exercise as any).volume;
  }
  if (!exercise.sets) return 0;

  return exercise.sets.reduce((total: number, set: any) => {
    if (typeof set.volume === "number") return total + set.volume;
    const weight = set.weight ?? 0;
    const reps = set.reps ?? 0;
    return total + weight * reps;
  }, 0);
}

/**
 * Returns a new array of workouts sorted by date (newest → oldest).
 */
export function sortWorkoutsByDateDesc(workouts: Workout[]): Workout[] {
  return [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Returns a new array of workouts sorted by date (oldest → newest).
 */
export function sortWorkoutsByDateAsc(workouts: Workout[]): Workout[] {
  return [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
