import { Router, type Request, type Response } from "express";
import Workout from "../models/Workout.js";

const router = Router();

// Example
router.get("/", async (_req: Request, res: Response) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

router.post("/", async (_req: Request, res: Response) => {
  function canonicalizeMuscleGroup(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) return null;

    return trimmed
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  try {
    const { date, primaryMuscleGroup, secondaryMuscleGroups, exercises } =
      _req.body;
    const normalizedPrimary = String(primaryMuscleGroup ?? "").trim();
    if (!normalizedPrimary || normalizedPrimary.length > 30) {
      return res.status(400).json({
        message:
          "primaryMuscleGroup is required and must be at most 30 characters",
      });
    }

    const normalizedSecondary = (
      Array.isArray(secondaryMuscleGroups) ? secondaryMuscleGroups : []
    )
      .map((s) => String(s).trim())
      .filter(Boolean) // remove empty strings
      .filter((s) => s.length <= 30) // enforce max length
      .filter((s) => s !== normalizedPrimary); // remove duplicates of primary

    // de-dupe secondaryMuscleGroups
    const uniqueSecondary = Array.from(new Set(normalizedSecondary));

    const newWorkout = await Workout.create({
      date: new Date(date),
      primaryMuscleGroup: normalizedPrimary,
      secondaryMuscleGroups: uniqueSecondary,
      exercises: Array.isArray(exercises) ? exercises : [],
    });
    res.status(201).json(newWorkout);
  } catch (err) {
    res
      .status(400)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

export default router;

// const express = require("express");
// const router = express.Router();
// const Workout = require("../models/Workout");

// // GET /api/workouts - Get all workouts in descending order by date
// router.get("/", async (req, res) => {
//   try {
//     const workouts = await Workout.find().sort({ date: -1 });
//     res.json(workouts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST /api/workouts - Create a new workout
// router.post("/", async (req, res) => {
//   function canonicalizeMuscleGroup(value: string) {
//     const trimmed = value?.trim();
//     if (!trimmed) return null;

//     return trimmed
//       .toLowerCase()
//       .split(/\s+/)
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   }

//   try {
//     const { date, primaryMuscleGroup, secondaryMuscleGroups, exercises } =
//       req.body;
//     const normalizedPrimary = String(primaryMuscleGroup ?? "").trim();
//     if (!normalizedPrimary || normalizedPrimary.length > 30) {
//       return res.status(400).json({
//         message:
//           "primaryMuscleGroup is required and must be at most 30 characters",
//       });
//     }

//     const normalizedSecondary = (
//       Array.isArray(secondaryMuscleGroups) ? secondaryMuscleGroups : []
//     )
//       .map((s) => String(s).trim())
//       .filter(Boolean) // remove empty strings
//       .filter((s) => s.length <= 30) // enforce max length
//       .filter((s) => s !== normalizedPrimary); // remove duplicates of primary

//     // de-dupe secondaryMuscleGroups
//     const uniqueSecondary = Array.from(new Set(normalizedSecondary));

//     const newWorkout = await Workout.create({
//       date: new Date(date),
//       primaryMuscleGroup: normalizedPrimary,
//       secondaryMuscleGroups: uniqueSecondary,
//       exercises: Array.isArray(exercises) ? exercises : [],
//     });
//     res.status(201).json(newWorkout);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;
