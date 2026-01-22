import { z } from "zod";
import { ALL_MUSCLE_GROUPS } from "@reptracker/shared/muscles";

// z.enum needs a tuple type, but ALL_MUSCLE_GROUPS is readonly.
// This is a TS workaround.
const MuscleGroupEnum = z.enum(
  ALL_MUSCLE_GROUPS as unknown as [string, ...string[]],
);

export const CreateExerciseSchema = z
  .object({
    name: z.string().trim().min(3).max(80),
    primaryMuscleGroup: MuscleGroupEnum,
    secondaryMuscleGroups: z.array(MuscleGroupEnum).max(20).optional(),
    description: z.string().trim().max(2000).optional(),
  })
  .strict();

export type CreateExerciseInputValidated = z.infer<typeof CreateExerciseSchema>;
