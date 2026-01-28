"use client";

import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import ExerciseCard from "@/components/dailylog/ExerciseCard";

type ActiveLogExerciseCardProps = {
  exerciseId: string;
};

/**
 * ActiveLogExerciseCard
 *
 * Bridges the exercise detail page with the current "active draft".
 * Option A:
 * - sessionDraft = in-progress daily log workout
 * - editDraft    = editing a historical workout
 *
 * We consider the "active" one:
 *   editDraft if present, else sessionDraft.
 */
export default function ActiveLogExerciseCard({
  exerciseId,
}: ActiveLogExerciseCardProps) {
  // Choose active draft (edit wins if present)
  const activeDraft = useWorkoutStore(
    (session) => session.editDraft ?? session.sessionDraft,
  );

  // Session handlers
  const addSessionSet = useWorkoutStore((session) => session.addSessionSet);
  const updateSessionSet = useWorkoutStore(
    (session) => session.updateSessionSet,
  );
  const deleteSessionSet = useWorkoutStore(
    (session) => session.deleteSessionSet,
  );
  const updateSessionExerciseNotes = useWorkoutStore(
    (session) => session.updateSessionExerciseNotes,
  );
  const removeSessionExercise = useWorkoutStore(
    (session) => session.removeSessionExercise,
  );

  // Edit handlers
  const addEditSet = useWorkoutStore((session) => session.addEditSet);
  const updateEditSet = useWorkoutStore((session) => session.updateEditSet);
  const deleteEditSet = useWorkoutStore((session) => session.deleteEditSet);
  const updateEditExerciseNotes = useWorkoutStore(
    (session) => session.updateEditExerciseNotes,
  );
  const removeEditExercise = useWorkoutStore(
    (session) => session.removeEditExercise,
  );

  // No active draft → nothing to render
  if (!activeDraft) return null;

  // Find this exercise within the active draft
  const sessionExercise = activeDraft.exercises.find(
    (exercise) => exercise.exerciseId === exerciseId,
  );

  // The user may view an exercise that isn't part of the current draft
  if (!sessionExercise) return null;

  const isEdit = activeDraft.kind === "edit";

  return (
    <ExerciseCard
      exercise={sessionExercise}
      isExpanded={true}
      onToggleExpanded={() => {}}
      onAddSet={(values) =>
        isEdit
          ? addEditSet(exerciseId, values)
          : addSessionSet(exerciseId, values)
      }
      onUpdateSet={(setId, values) =>
        isEdit
          ? updateEditSet(exerciseId, setId, values)
          : updateSessionSet(exerciseId, setId, values)
      }
      onDeleteSet={(setId) =>
        isEdit
          ? deleteEditSet(exerciseId, setId)
          : deleteSessionSet(exerciseId, setId)
      }
      onNotesChange={(notes) =>
        isEdit
          ? updateEditExerciseNotes(exerciseId, notes)
          : updateSessionExerciseNotes(exerciseId, notes)
      }
      onRemove={() =>
        isEdit
          ? removeEditExercise(exerciseId)
          : removeSessionExercise(exerciseId)
      }
    />
  );
}
