// import type { Exercise } from "@/types/exercise";
// import type { WorkoutExercise } from "@/types/workout";
// import { MOCK_EXERCISES } from "./mockExercises";
// import type { Workout } from "@/types/workout";

// export type WorkoutSet = {
//   reps: number;
//   weight: number;
//   volume: number;
//   tempo?: string;
//   rpe?: number;
// };

// // export type Workout = {
// //   id: string;
// //   date: string;
// //   muscleGroups: string[];
// //   exercises: WorkoutExercise[];
// // };

// function findExercise(id: Exercise["id"]): Exercise {
//   const exercise = MOCK_EXERCISES.find((e) => e.id === id);
//   if (!exercise) {
//     throw new Error(`Unknown exercise id: ${id}`);
//   }
//   return exercise;
// }

// export const MOCK_WORKOUTS: Workout[] = [
//   {
//     id: "2b5a1b7f-9b1d-4ed6-9c24-f5b65f8447a1",
//     date: "2025-12-10T00:00:00.000Z",
//     muscleGroups: ["Chest", "Triceps"],
//     exercises: [
//       {
//         exerciseId: "bench-press",
//         exerciseName: "Bench Press",
//         sets: [
//           {
//             id: "b6c9c8f2-42a8-4b1a-8f0a-5b2b8e6f7e31",
//             reps: 10,
//             weight: 95,
//             isWarmup: true,
//           },
//           {
//             id: "0de29e2e-2a4a-4f1a-8d7a-7b7bdf7c2e1a",
//             reps: 8,
//             weight: 155,
//             isWarmup: false,
//           },
//           {
//             id: "6c2412b2-4af4-4c43-b7f4-4045a4e1c9f6",
//             reps: 8,
//             weight: 155,
//             isWarmup: false,
//           },
//           {
//             id: "63ff8b27-8d6c-4a8a-a5a9-2b3ad6b0c49e",
//             reps: 7,
//             weight: 160,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "tricep-pushdown",
//         exerciseName: "Tricep Pushdown",
//         sets: [
//           {
//             id: "28b41c6c-85aa-4a5a-bf45-d2a0a4f0d1b9",
//             reps: 12,
//             weight: 70,
//             isWarmup: false,
//           },
//           {
//             id: "c80b2d4e-0b0b-4b09-9c2b-2f4fe1c7f8b2",
//             reps: 12,
//             weight: 70,
//             isWarmup: false,
//           },
//           {
//             id: "a0c6e2a0-7a3b-4b2c-9c8f-8f5a3b0e1f2d",
//             reps: 11,
//             weight: 75,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "d2a64b62-79b4-4e34-b0a8-8f1e6a7c0c12",
//     date: "2025-12-08T00:00:00.000Z",
//     muscleGroups: ["Back", "Biceps"],
//     exercises: [
//       {
//         exerciseId: "lat-pulldown",
//         exerciseName: "Lat Pulldown",
//         sets: [
//           {
//             id: "d1f3d6d1-4c19-4b8e-88b7-7f7d6d4f0a11",
//             reps: 12,
//             weight: 90,
//             isWarmup: true,
//           },
//           {
//             id: "9d5b1f0c-7f7a-4a2c-8b9b-9b3f1a0c2d3e",
//             reps: 10,
//             weight: 130,
//             isWarmup: false,
//           },
//           {
//             id: "3a0c2d3e-9b3f-4a2c-8b9b-9d5b1f0c7f7a",
//             reps: 10,
//             weight: 130,
//             isWarmup: false,
//           },
//           {
//             id: "a7c0c12d-2a64-4b62-79b4-4e34b0a88f1e",
//             reps: 9,
//             weight: 135,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "barbell-curl",
//         exerciseName: "Barbell Curl",
//         sets: [
//           {
//             id: "6b0c49e6-3ff8-4b27-8d6c-4a8aa5a92b3a",
//             reps: 10,
//             weight: 65,
//             isWarmup: false,
//           },
//           {
//             id: "2e1a0de2-9e2a-4f1a-8d7a-7b7bdf7c2e1a",
//             reps: 10,
//             weight: 65,
//             isWarmup: false,
//           },
//           {
//             id: "4c43b7f4-6c24-12b2-4af4-4045a4e1c9f6",
//             reps: 9,
//             weight: 70,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "4f1a2b3c-5d6e-4f70-8a9b-0c1d2e3f4a5b",
//     date: "2025-12-06T00:00:00.000Z",
//     muscleGroups: ["Quads", "Glutes"],
//     exercises: [
//       {
//         exerciseId: "squat",
//         exerciseName: "Back Squat",
//         sets: [
//           {
//             id: "f7e31b6c-9c8f-42a8-4b1a-8f0a5b2b8e6f",
//             reps: 8,
//             weight: 135,
//             isWarmup: true,
//           },
//           {
//             id: "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
//             reps: 6,
//             weight: 225,
//             isWarmup: false,
//           },
//           {
//             id: "5f4e3d2c-1b0a-9f8e-7d6c-5b4a3c2d1e0f",
//             reps: 6,
//             weight: 225,
//             isWarmup: false,
//           },
//           {
//             id: "0f1e2d3c-4b5a-6978-8f9e-a0b1c2d3e4f5",
//             reps: 5,
//             weight: 235,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "leg-press",
//         exerciseName: "Leg Press",
//         sets: [
//           {
//             id: "aa1b2c3d-4e5f-4678-9a0b-1c2d3e4f5a6b",
//             reps: 12,
//             weight: 270,
//             isWarmup: false,
//           },
//           {
//             id: "bb2c3d4e-5f6a-4789-0b1c-2d3e4f5a6b7c",
//             reps: 12,
//             weight: 270,
//             isWarmup: false,
//           },
//           {
//             id: "cc3d4e5f-6a7b-4890-1c2d-3e4f5a6b7c8d",
//             reps: 11,
//             weight: 280,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d",
//     date: "2025-12-04T00:00:00.000Z",
//     muscleGroups: ["Shoulders", "Triceps"],
//     exercises: [
//       {
//         exerciseId: "overhead-press",
//         exerciseName: "Overhead Press",
//         sets: [
//           {
//             id: "d4f0a11d-1f3d-4c19-4b8e-88b77f7d6d4f",
//             reps: 10,
//             weight: 55,
//             isWarmup: true,
//           },
//           {
//             id: "f0d1b928-b41c-6c85-aa4a-5abf45d2a0a4",
//             reps: 8,
//             weight: 95,
//             isWarmup: false,
//           },
//           {
//             id: "f8b2c80b-2d4e-0b0b-4b09-9c2b2f4fe1c7",
//             reps: 8,
//             weight: 95,
//             isWarmup: false,
//           },
//           {
//             id: "1f2da0c6-e2a0-7a3b-4b2c-9c8f8f5a3b0e",
//             reps: 7,
//             weight: 100,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "lateral-raise",
//         exerciseName: "Lateral Raise",
//         sets: [
//           {
//             id: "2b3a6b0c-49e6-3ff8-4b27-8d6c4a8aa5a9",
//             reps: 15,
//             weight: 20,
//             isWarmup: false,
//           },
//           {
//             id: "7c2e1a0d-e29e-2a4a-4f1a-8d7a7b7bdf7c",
//             reps: 15,
//             weight: 20,
//             isWarmup: false,
//           },
//           {
//             id: "e1c9f64c-43b7-f46c-2412-b24af44045a4",
//             reps: 14,
//             weight: 25,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "0c12d2a6-4b62-79b4-4e34-b0a88f1e6a7c",
//     date: "2025-12-02T00:00:00.000Z",
//     muscleGroups: ["Hamstrings", "Glutes"],
//     exercises: [
//       {
//         exerciseId: "romanian-deadlift",
//         exerciseName: "Romanian Deadlift",
//         sets: [
//           {
//             id: "4e5f0a1b-2c3d-4e5f-8a9b-0c1d2e3f4a5b",
//             reps: 8,
//             weight: 95,
//             isWarmup: true,
//           },
//           {
//             id: "6b7c8d9e-0f1a-4b5c-8d9e-0f1a2b3c4d5e",
//             reps: 8,
//             weight: 185,
//             isWarmup: false,
//           },
//           {
//             id: "5e4d3c2b-1a0f-9e8d-7c6b-5a4b3c2d1e0f",
//             reps: 8,
//             weight: 185,
//             isWarmup: false,
//           },
//           {
//             id: "12345678-90ab-4cde-8f01-234567890abc",
//             reps: 7,
//             weight: 195,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "leg-curl",
//         exerciseName: "Leg Curl",
//         sets: [
//           {
//             id: "23456789-0abc-4def-9012-34567890abcd",
//             reps: 12,
//             weight: 90,
//             isWarmup: false,
//           },
//           {
//             id: "34567890-abcd-4ef0-9123-4567890abcde",
//             reps: 12,
//             weight: 90,
//             isWarmup: false,
//           },
//           {
//             id: "4567890a-bcde-4f01-a234-567890abcdef",
//             reps: 11,
//             weight: 95,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "7f7a9d5b-1f0c-4a2c-8b9b-9b3f1a0c2d3e",
//     date: "2025-11-29T00:00:00.000Z",
//     muscleGroups: ["Back", "Traps"],
//     exercises: [
//       {
//         exerciseId: "barbell-row",
//         exerciseName: "Barbell Row",
//         sets: [
//           {
//             id: "567890ab-cdef-4a12-b345-67890abcdef1",
//             reps: 10,
//             weight: 95,
//             isWarmup: true,
//           },
//           {
//             id: "67890abc-def1-4b23-c456-7890abcdef12",
//             reps: 8,
//             weight: 155,
//             isWarmup: false,
//           },
//           {
//             id: "7890abcd-ef12-4c34-d567-890abcdef123",
//             reps: 8,
//             weight: 155,
//             isWarmup: false,
//           },
//           {
//             id: "890abcde-f123-4d45-e678-90abcdef1234",
//             reps: 7,
//             weight: 160,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "3ff84b27-8d6c-4a8a-a5a9-2b3ad6b0c49e",
//     date: "2025-11-26T00:00:00.000Z",
//     muscleGroups: ["Chest", "Shoulders"],
//     exercises: [
//       {
//         exerciseId: "dumbbell-bench-press",
//         exerciseName: "Dumbbell Bench Press",
//         sets: [
//           {
//             id: "cdef1234-5678-4a90-bcde-f1234567890a",
//             reps: 12,
//             weight: 45,
//             isWarmup: true,
//           },
//           {
//             id: "def12345-6789-4b01-cdef-1234567890ab",
//             reps: 10,
//             weight: 70,
//             isWarmup: false,
//           },
//           {
//             id: "ef123456-7890-4c12-def1-234567890abc",
//             reps: 10,
//             weight: 70,
//             isWarmup: false,
//           },
//           {
//             id: "f1234567-890a-4d23-ef12-34567890abcd",
//             reps: 9,
//             weight: 75,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "lateral-raise",
//         exerciseName: "Lateral Raise",
//         sets: [
//           {
//             id: "01234567-89ab-4e34-f012-34567890abcd",
//             reps: 15,
//             weight: 20,
//             isWarmup: false,
//           },
//           {
//             id: "11234567-89ab-4e34-f012-34567890abcd",
//             reps: 15,
//             weight: 20,
//             isWarmup: false,
//           },
//           {
//             id: "21234567-89ab-4e34-f012-34567890abcd",
//             reps: 14,
//             weight: 25,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "6c2412b2-4af4-4c43-b7f4-4045a4e1c9f6",
//     date: "2025-11-22T00:00:00.000Z",
//     muscleGroups: ["Quads", "Calves"],
//     exercises: [
//       {
//         exerciseId: "leg-press",
//         exerciseName: "Leg Press",
//         sets: [
//           {
//             id: "31234567-89ab-4e34-f012-34567890abcd",
//             reps: 12,
//             weight: 180,
//             isWarmup: true,
//           },
//           {
//             id: "41234567-89ab-4e34-f012-34567890abcd",
//             reps: 12,
//             weight: 270,
//             isWarmup: false,
//           },
//           {
//             id: "51234567-89ab-4e34-f012-34567890abcd",
//             reps: 12,
//             weight: 270,
//             isWarmup: false,
//           },
//           {
//             id: "61234567-89ab-4e34-f012-34567890abcd",
//             reps: 11,
//             weight: 280,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "calf-raise",
//         exerciseName: "Calf Raise",
//         sets: [
//           {
//             id: "71234567-89ab-4e34-f012-34567890abcd",
//             reps: 15,
//             weight: 110,
//             isWarmup: false,
//           },
//           {
//             id: "81234567-89ab-4e34-f012-34567890abcd",
//             reps: 15,
//             weight: 110,
//             isWarmup: false,
//           },
//           {
//             id: "91234567-89ab-4e34-f012-34567890abcd",
//             reps: 14,
//             weight: 120,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "0de29e2e-2a4a-4f1a-8d7a-7b7bdf7c2e1a",
//     date: "2025-11-18T00:00:00.000Z",
//     muscleGroups: ["Back", "Biceps"],
//     exercises: [
//       {
//         exerciseId: "pull-up",
//         exerciseName: "Pull Up",
//         sets: [
//           {
//             id: "a1234567-89ab-4e34-f012-34567890abcd",
//             reps: 8,
//             weight: 0,
//             isWarmup: false,
//           },
//           {
//             id: "b1234567-89ab-4e34-f012-34567890abcd",
//             reps: 7,
//             weight: 0,
//             isWarmup: false,
//           },
//           {
//             id: "c1234567-89ab-4e34-f012-34567890abcd",
//             reps: 6,
//             weight: 0,
//             isWarmup: false,
//           },
//         ],
//       },
//       {
//         exerciseId: "barbell-curl",
//         exerciseName: "Barbell Curl",
//         sets: [
//           {
//             id: "d1234567-89ab-4e34-f012-34567890abcd",
//             reps: 10,
//             weight: 65,
//             isWarmup: false,
//           },
//           {
//             id: "e1234567-89ab-4e34-f012-34567890abcd",
//             reps: 10,
//             weight: 65,
//             isWarmup: false,
//           },
//           {
//             id: "f1234567-89ab-4e34-f012-34567890abcd",
//             reps: 9,
//             weight: 70,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },

//   {
//     id: "9d22f669-c2ef-45ea-93cf-408c0ad803af",
//     date: "2025-11-14T00:00:00.000Z",
//     muscleGroups: ["Abs"],
//     exercises: [
//       {
//         exerciseId: "hanging-leg-raise",
//         exerciseName: "Hanging Leg Raise",
//         sets: [
//           {
//             id: "0a0b0c0d-1111-4e34-f012-34567890abcd",
//             reps: 12,
//             weight: 0,
//             isWarmup: false,
//           },
//           {
//             id: "1a1b1c1d-2222-4e34-f012-34567890abcd",
//             reps: 12,
//             weight: 0,
//             isWarmup: false,
//           },
//           {
//             id: "2a2b2c2d-3333-4e34-f012-34567890abcd",
//             reps: 10,
//             weight: 0,
//             isWarmup: false,
//           },
//         ],
//       },
//     ],
//     createdAt: "2025-12-17T23:25:10.569Z",
//     updatedAt: "2025-12-17T23:25:10.569Z",
//   },
// ];
