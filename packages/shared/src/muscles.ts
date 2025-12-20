export const ALL_MUSCLE_GROUPS = [
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
] as const;

export type MuscleGroup = (typeof ALL_MUSCLE_GROUPS)[number];
