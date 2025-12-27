import { Router, type Request, type Response } from "express";
import Exercise from "../models/Exercise.js";
import mongoose from "mongoose";

// Helpers
function toExerciseDTO(doc: any) {
  const obj = doc.toObject?.() ?? doc;
  return {
    id: String(obj._id),
    name: obj.name,
    primaryMuscleGroup: obj.primaryMuscleGroup,
    secondaryMuscleGroups: obj.secondaryMuscleGroups ?? [],
    description: obj.description,
  };
}

const router = Router();

// DEV TESTING ONLY — delete all exercises
router.delete("/__dev__/all", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await Exercise.deleteMany({});
    res.json({
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get all exercises
router.get("/", async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json(exercises.map(toExerciseDTO));
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get exercise by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Fast-fail invalid ObjectId formats
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const doc = await Exercise.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    return res.json(toExerciseDTO(doc));
  } catch (err) {
    return res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Create new exercise
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const primaryMuscleGroup =
      typeof body.primaryMuscleGroup === "string"
        ? body.primaryMuscleGroup.trim()
        : "";
    const secondaryMuscleGroups = Array.isArray(body.secondaryMuscleGroups)
      ? body.secondaryMuscleGroups
      : [];
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : undefined;

    if (!name || !primaryMuscleGroup) {
      return res
        .status(400)
        .json({ message: "name and primaryMuscleGroup are required" });
    }

    const newExercise = new Exercise({
      name,
      primaryMuscleGroup,
      secondaryMuscleGroups,
      description,
    });

    const saved = await newExercise.save();
    return res.status(201).json(toExerciseDTO(saved));
  } catch (err) {
    // Duplicate key (unique index) error handling (optional but helpful)
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as any).code === 11000
    ) {
      return res.status(409).json({
        message: "Exercise already exists (duplicate name or id).",
      });
    }

    return res
      .status(400)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
