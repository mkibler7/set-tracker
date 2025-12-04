// export default ALL_MUSCLE_GROUPS;
export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Quads"
  | "Hamstrings"
  | "Glutes"
  | "Traps"
  | "Biceps"
  | "Triceps"
  | "Calves"
  | "Adductors"
  | "Abductors"
  | "Abs";

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  "Abs",
  "Back",
  "Biceps",
  "Chest",
  "Glutes",
  "Hamstrings",
  "Quads",
  "Shoulders",
  "Traps",
  "Triceps",
];

export type ExerciseFormValues = {
  name: string;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups: MuscleGroup[];
  description?: string;
};

export interface Exercise {
  id: string;
  name: string;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
  description?: string;
}

export interface ExerciseHistoryEntry {
  workoutId: string;
  workoutDate: string; // ISO string
  topSet: { weight: number; reps: number } | null;
  totalVolume: number; // e.g. sum(weight * reps)
  notes?: string;
}

export interface CurrentSessionExerciseSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number;
  tempo?: string;
  notes?: string;
}

export interface CurrentSessionExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CurrentSessionExerciseSet[];
}
