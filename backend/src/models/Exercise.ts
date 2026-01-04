import mongoose, { type InferSchemaType, Model } from "mongoose";
import {
  ALL_MUSCLE_GROUPS,
  type MuscleGroup,
} from "@reptracker/shared/muscles";

const ExerciseSchema = new mongoose.Schema({
  scope: {
    type: String,
    enum: ["global", "user"],
    default: "global",
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 80,
  },
  primaryMuscleGroup: {
    type: String,
    required: true,
    trim: true,
    enum: ALL_MUSCLE_GROUPS,
  },
  secondaryMuscleGroups: {
    type: [String],
    default: [],
    validate: {
      validator: (arr: unknown) => {
        if (arr == null) return true; // allow undefined/null to use default
        if (!Array.isArray(arr)) return false;
        // all valid muscle groups, no duplicates, and not the same as primary handled below
        const allValid = arr.every((string) =>
          ALL_MUSCLE_GROUPS.includes(string as MuscleGroup)
        );
        const uniqueCount = new Set(arr).size === arr.length;
        return allValid && uniqueCount;
      },
      message:
        "secondaryMuscleGroups must be unique and contain only allowed muscle groups",
    },
  },
  description: { type: String, trim: true, maxlength: 2000 },
});

// Unique for global: (scope, name) when scope === "global"
ExerciseSchema.index(
  { scope: 1, name: 1 },
  { unique: true, partialFilterExpression: { scope: "global" } }
);

// Unique for user: (userId, name) when scope === "user"
ExerciseSchema.index(
  { userId: 1, name: 1 },
  { unique: true, partialFilterExpression: { scope: "user" } }
);

type ExerciseDoc = InferSchemaType<typeof ExerciseSchema>;

const Exercise: Model<ExerciseDoc> =
  (mongoose.models.Exercise as Model<ExerciseDoc>) ||
  mongoose.model<ExerciseDoc>("Exercise", ExerciseSchema);

export default Exercise;
