import { Router, type Request, type Response } from "express";
import Workout from "../models/Workout.js";

// Helpers
function toWorkoutDTO(doc: any) {
  const obj = doc.toObject?.() ?? doc;
  return {
    id: String(obj._id),
    date: obj.date instanceof Date ? obj.date.toISOString() : obj.date,
    muscleGroups: obj.muscleGroups ?? [],
    exercises: obj.exercises ?? [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

function canonicalizeMuscleGroup(value: string) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const router = Router();

// DEV TESTING ONLY — delete all workouts
router.delete("/__dev__/all", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await Workout.deleteMany({});
    res.json({
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get all workouts
router.get("/", async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts.map(toWorkoutDTO));
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get workout by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Workout.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(toWorkoutDTO(doc));
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
});

// Create new workout
router.post("/", async (req: Request, res: Response) => {
  try {
    const { date, muscleGroups, exercises } = req.body;

    const normalized = (Array.isArray(muscleGroups) ? muscleGroups : [])
      .map((s) => canonicalizeMuscleGroup(String(s)))
      .filter((s): s is string => Boolean(s))
      .filter((s) => s.length <= 30);

    // de-dupe muscleGroups
    const uniqueMuscleGroups = Array.from(new Set(normalized));

    const payload: any = {
      muscleGroups: uniqueMuscleGroups,
      exercises: Array.isArray(exercises) ? exercises : [],
    };

    if (date) {
      const d = new Date(date);
      if (!Number.isNaN(d.getTime())) payload.date = d;
    }

    const newWorkout = await Workout.create(payload);
    res.status(201).json(toWorkoutDTO(newWorkout));
  } catch (err) {
    res
      .status(400)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
