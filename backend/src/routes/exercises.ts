import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createExercise,
  deleteAllExercisesDevOnly,
  getExercises,
  getExerciseById,
  getExerciseHistory,
} from "../services/exercisesService.js";
import toExerciseDTO from "../dtos/exerciseDto.js";

type IdParams = { id: string };

const router = Router();

// DEV TESTING ONLY — delete all exercises
router.delete("/__dev__/all", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await deleteAllExercisesDevOnly();
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
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const exercises = await getExercises(req.user!.userId);
    res.json(exercises.map(toExerciseDTO));
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : String(err) });
  }
});

// Get exercise by ID
router.get(
  "/:id",
  requireAuth,
  async (req: Request<IdParams>, res: Response) => {
    try {
      const doc = await getExerciseById(req.user!.userId, req.params.id);
      res.json(toExerciseDTO(doc));
    } catch (err: any) {
      res
        .status(err?.status ?? 500)
        .json({ message: err instanceof Error ? err.message : String(err) });
    }
  },
);

// Get exercise history by ID
router.get(
  "/history/exercise/:id",
  requireAuth,
  async (req: Request<IdParams>, res: Response) => {
    try {
      const entries = await getExerciseHistory(req.user!.userId, req.params.id);
      res.json(entries);
    } catch (err: any) {
      res
        .status(err?.status ?? 500)
        .json({ message: err instanceof Error ? err.message : String(err) });
    }
  },
);

// Create new exercise
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const saved = await createExercise(req.user!.userId, req.body ?? {});
    res.status(201).json(toExerciseDTO(saved));
  } catch (err: any) {
    res.status(err?.status ?? 400).json({
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
