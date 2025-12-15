const mongoose = require("mongoose");

const WorkoutSetSchema = new mongoose.Schema(
  {
    reps: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
    },
    tempo: {
      type: String,
      required: false,
    },
    rpe: {
      type: Number,
      required: false,
      min: 0,
      max: 10,
    },
  },
  { _id: false }
);

const WorkoutExerciseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sets: { type: [WorkoutSetSchema], default: [] },
  },
  { _id: false }
);

const WorkoutSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    muscleGroups: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) =>
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "muscleGroups must be a non-empty array of non-empty strings",
      },
    },
    exercises: { type: [WorkoutExerciseSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", WorkoutSchema);
