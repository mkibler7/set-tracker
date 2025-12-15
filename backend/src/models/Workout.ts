import mongoose, { type InferSchemaType, type Model } from "mongoose";

const WorkoutSetSchema = new mongoose.Schema(
  {
    reps: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    volume: { type: Number, required: true, min: 0 },
    tempo: { type: String },
    rpe: { type: Number, min: 0, max: 10 },
  },
  { _id: false }
);

const WorkoutExerciseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    sets: { type: [WorkoutSetSchema], default: [] },
  },
  { _id: false }
);

const WorkoutSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now, required: true },
    primaryMuscleGroup: { type: String, required: true, trim: true },
    secondaryMuscleGroups: {
      type: [String],
      validate: {
        validator: (arr: unknown) =>
          Array.isArray(arr) &&
          arr.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "secondaryMuscleGroups must be an array of non-empty strings",
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
