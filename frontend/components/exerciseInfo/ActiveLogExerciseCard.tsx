"use client";

import { useWorkoutSession } from "@/components/dailylog/useWorkoutSession";
import ExerciseCard from "@/components/dailylog/ExerciseCard";

type ActiveLogExerciseCardProps = {
  exerciseId: string;
};

/**
 * ActiveLogExerciseCard
 *
 * Bridges the exercise detail page with the current Daily Log session.
 * - Looks up this exercise inside the global `currentWorkout` session
 * - If found, reuses the same `ExerciseCard` UI used on the Daily Log page
 * - Wires all the handlers (add/update/delete sets, notes, remove)
 */
export default function ActiveLogExerciseCard({
  exerciseId,
}: ActiveLogExerciseCardProps) {
  const {
    currentWorkout,
    addSet,
    updateExerciseNotes,
    updateSet,
    deleteSet,
    removeExercise,
  } = useWorkoutSession();

  // No active workout → nothing to render
  if (!currentWorkout) return null;

  // Find this exercise within the active session
  const sessionExercise = currentWorkout.exercises.find(
    (exercise) => exercise.exerciseId === exerciseId
  );

  // The user may view an exercise that isn't part of the current workout
  if (!sessionExercise) return null;

  return (
    <ExerciseCard
      exercise={sessionExercise}
      onAddSet={(newSet) => addSet(exerciseId, newSet)}
      onUpdateSet={(setId, patch) => updateSet(exerciseId, setId, patch)}
      onDeleteSet={(setId) => deleteSet(exerciseId, setId)}
      onNotesChange={(notes) => updateExerciseNotes(exerciseId, notes)}
      onRemove={() => removeExercise(exerciseId)}
    />
  );
}
