import { Router, type Request, type Response } from "express";
import toWorkoutDTO from "../dtos/workoutDto.js";

import {
  createWorkout,
  deleteAllWorkoutsDevOnly,
  deleteWorkout,
  getWorkoutById,
  getWorkouts,
  updateWorkout,
} from "../services/workoutsService.js";
import {
  parseCreateWorkoutInput,
  parseUpdateWorkoutInput,
} from "../validators/workoutInput.js";

type IdParams = {
  id: string;
};

const router = Router();

// DEV TESTING ONLY — delete all workouts
router.delete("/__dev__/all", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await deleteAllWorkoutsDevOnly();
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
    const workouts = await getWorkouts();
    res.json(workouts.map(toWorkoutDTO));
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get workout by ID
router.get("/:id", async (req: Request<IdParams>, res: Response) => {
  try {
    const doc = await getWorkoutById(req.params.id);
    res.json(toWorkoutDTO(doc));
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
});

// Create new workout
router.post("/", async (req: Request, res: Response) => {
  try {
    const input = parseCreateWorkoutInput(req.body);
    const saved = await createWorkout(input);
    res.status(201).json(toWorkoutDTO(saved));
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Update workout by ID
router.put("/:id", async (req: Request<IdParams>, res: Response) => {
  try {
    const input = parseUpdateWorkoutInput(req.body);
    const updated = await updateWorkout(req.params.id, input);
    res.json(toWorkoutDTO(updated));
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Delete workout by ID
router.delete("/:id", async (req: Request<IdParams>, res: Response) => {
  try {
    const deleted = await deleteWorkout(req.params.id);
    res.json(deleted);
  } catch (err) {
    res
      .status(400)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
