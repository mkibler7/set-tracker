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
  "Calves",
  "Adductors",
  "Abductors",
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

export interface ExerciseHistorySet {
  setNumber: number;
  weight: number;
  reps: number;
  tempo?: string;
  rpe?: number;
}

export interface ExerciseHistoryEntry {
  workoutId: string;
  workoutDate: string; // ISO string
  workoutName: string;
  totalVolume: number;
  notes?: string;
  sets: ExerciseHistorySet[];
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
