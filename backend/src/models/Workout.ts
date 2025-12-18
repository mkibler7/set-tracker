import mongoose, { type InferSchemaType, type Model } from "mongoose";
import crypto from "crypto";

const WorkoutSetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      default: () => crypto.randomUUID(),
    },
    reps: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    tempo: { type: String },
    rpe: { type: Number, min: 0, max: 10 },
    isWarmup: { type: Boolean, default: false },
  },
  { _id: false }
);

const WorkoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: { type: String, required: true, trim: true },
    exerciseName: { type: String, required: true, trim: true },
    sets: { type: [WorkoutSetSchema], default: [] },
    notes: { type: String },
  },
  { _id: false }
);

const WorkoutSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now, required: true },
    muscleGroups: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: unknown) =>
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "muscleGroups must be an array of non-empty strings",
      },
    },
    exercises: { type: [WorkoutExerciseSchema], default: [] },
  },
  { timestamps: true }
);

export type WorkoutDoc = InferSchemaType<typeof WorkoutSchema>;

const Workout: Model<WorkoutDoc> =
  (mongoose.models.Workout as Model<WorkoutDoc>) ||
  mongoose.model<WorkoutDoc>("Workout", WorkoutSchema);

export default Workout;
