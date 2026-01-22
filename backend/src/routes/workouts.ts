import { Router, type Request, type Response } from "express";
import toWorkoutDTO from "../dtos/workoutDto.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { apiLimiter } from "../middleware/rateLimiters.js";
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

router.use(apiLimiter);

// DEV TESTING ONLY — delete all workouts
router.delete(
  "/__dev__/all",
  requireAuth,
  async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (process.env.ENABLE_DEV_ROUTES !== "true") {
      return res.status(404).json({ message: "Not found" });
    }
    try {
      const result = await deleteAllWorkoutsDevOnly(req.user!.userId);
      res.json({
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: err instanceof Error ? err.message : String(err) });
    }
  },
);

// Get all workouts (protected)
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const workouts = await getWorkouts(req.user!.userId);
    res.json(workouts.map(toWorkoutDTO));
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get workout by ID
router.get(
  "/:id",
  requireAuth,
  async (req: Request<IdParams>, res: Response) => {
    try {
      const doc = await getWorkoutById(req.user!.userId, req.params.id);
      res.json(toWorkoutDTO(doc));
    } catch (err: any) {
      res
        .status(err?.status ?? 400)
        .json({ message: err instanceof Error ? err.message : String(err) });
    }
  },
);

// Create new workout (protected)
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const input = parseCreateWorkoutInput(req.body);
    const saved = await createWorkout(req.user!.userId, input);
    res.status(201).json(toWorkoutDTO(saved));
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Update workout by ID
router.put(
  "/:id",
  requireAuth,
  async (req: Request<IdParams>, res: Response) => {
    try {
      const input = parseUpdateWorkoutInput(req.body);
      const updated = await updateWorkout(
        req.user!.userId,
        req.params.id,
        input,
      );
      res.json(toWorkoutDTO(updated));
    } catch (err: any) {
      res.status(err?.status ?? 400).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },
);

// Delete workout by ID
router.delete(
  "/:id",
  requireAuth,
  async (req: Request<IdParams>, res: Response) => {
    try {
      const deleted = await deleteWorkout(req.user!.userId, req.params.id);
      res.json(deleted);
    } catch (err: any) {
      res.status(err?.status ?? 400).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },
);

export default router;
