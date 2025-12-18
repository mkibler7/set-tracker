import type { WorkoutSession, WorkoutExercise } from "@/types/workout";
import type { MuscleGroup } from "@/types/exercise";

export type CreateWorkoutPayload = {
  date?: string;
  muscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];
};

export function buildCreateWorkoutPayload(
  session: WorkoutSession
): CreateWorkoutPayload {
  return {
    date: session.date,
    muscleGroups: session.muscleGroups,
    exercises: session.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      notes: ex.notes,
      sets: ex.sets.map((s) => ({
        id: s.id,
        reps: s.reps,
        weight: s.weight,
        rpe: s.rpe,
        tempo: s.tempo,
        isWarmup: s.isWarmup,
      })),
    })),
  };
}
