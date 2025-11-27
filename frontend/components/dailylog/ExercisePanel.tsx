import { JSX, useState } from "react";
import type { WorkoutExercise } from "@/types/workout";

type ExercisePanelProps = {
  exercise: WorkoutExercise;
  onNotesChange?: (notes: string) => void;
};

export default function ExercisePanel({
  exercise,
  onNotesChange,
}: ExercisePanelProps): JSX.Element {
  const [notes, setNotes] = useState(exercise.notes ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter (without Shift) = commit + blur (no new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };
  return (
    <textarea
      className="form-input w-full"
      value={notes}
      onChange={(e) => {
        const value = e.target.value;
        setNotes(value);
        onNotesChange?.(value);
      }}
      onKeyDown={handleKeyDown}
      placeholder="Notes for this exercise (e.g., felt heavy, tweak stance next time)"
    />
  );
}
