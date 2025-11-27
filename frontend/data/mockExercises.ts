import type { Exercise } from "@/types/exercise";

export const MOCK_EXERCISES: Exercise[] = [
  { id: "bench-press", name: "Barbell Bench Press", muscleGroup: ["Chest"] },
  {
    id: "incline-bb-press",
    name: "Incline Barbell Bench Press",
    muscleGroup: ["Chest"],
  },
  {
    id: "back-squat",
    name: "Barbell Squat",
    muscleGroup: ["Quads", "Hamstrings"],
  },
  {
    id: "deadlift",
    name: "Barbell Deadlift",
    muscleGroup: ["Back", "Hamstrings", "Traps"],
  },
  {
    id: "overhead-press",
    name: "Barbell Overhead Press",
    muscleGroup: ["Shoulders"],
  },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: ["Back"] },
  {
    id: "lat-pulldown-standard",
    name: "Lat Pulldown(Standard Grip)",
    muscleGroup: ["Back"],
  },
  {
    id: "lat-pulldown-wide",
    name: "Lat Pulldown(Wide Grip)",
    muscleGroup: ["Back"],
  },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: ["Arms"] },
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: ["Arms"] },
  { id: "leg-press", name: "Leg Press", muscleGroup: ["Legs"] },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: ["Legs"] },
  {
    id: "incline-db-press",
    name: "Incline Dumbbell Press",
    muscleGroup: ["Chest"],
  },
  {
    id: "incline-machine-press",
    name: "Incline Machine Press",
    muscleGroup: ["Chest"],
  },
  {
    id: "decline-machine-press",
    name: "Decline Machine Press",
    muscleGroup: ["Chest"],
  },
  { id: "machine-fly", name: "Machine Chest Fly", muscleGroup: ["Chest"] },
  {
    id: "incline-db-fly",
    name: "Incline Dumbbell Fly",
    muscleGroup: ["Chest"],
  },
  {
    id: "decline-db-fly",
    name: "Decline Dumbbell Fly",
    muscleGroup: ["Chest"],
  },
  { id: "peck-deck", name: "Peck Deck Fly", muscleGroup: ["Chest"] },
  { id: "push-up", name: "Push Up", muscleGroup: ["Chest"] },
  { id: "dip", name: "Chest Dip", muscleGroup: ["Chest"] },
  {
    id: "flat-db-fly",
    name: "Flat Bench Dumbbell Fly",
    muscleGroup: ["Chest"],
  },
  { id: "cable-fly", name: "Cable Fly", muscleGroup: ["Chest"] },
  {
    id: "decline-cable-fly",
    name: "Decline Cable Fly",
    muscleGroup: ["Chest"],
  },
  {
    id: "incline-cable-fly",
    name: "Incline Cable Fly",
    muscleGroup: ["Chest"],
  },
];
