import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { apiLimiter } from "../middleware/rateLimiters.js";
import { CreateExerciseSchema } from "../validators/exercises.js";
import {
  createExercise,
  deleteAllExercisesDevOnly,
  getExercises,
  getExerciseById,
  getExerciseHistory,
} from "../services/exercisesService.js";
import toExerciseDTO from "../dtos/exerciseDto.js";
import { sendError } from "../utils/httpErrors.js";

type IdParams = { id: string };

const router = Router();

router.use(apiLimiter);

// DEV TESTING ONLY — delete the current user's custom exercises
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
      const result = await deleteAllExercisesDevOnly(req.user!.userId);
      res.json({
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      sendError(res, err);
    }
  },
);

// Get all exercises
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const exercises = await getExercises(req.user!.userId);
    res.json(exercises.map(toExerciseDTO));
  } catch (err) {
    sendError(res, err);
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
    } catch (err) {
      sendError(res, err);
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
    } catch (err) {
      sendError(res, err);
    }
  },
);

// Create new exercise
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const input = CreateExerciseSchema.parse(req.body ?? {});
    const saved = await createExercise(req.user!.userId, input);
    res.status(201).json(toExerciseDTO(saved));
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Invalid exercise input", issues: err.issues });
    }
    sendError(res, err);
  }
});

export default router;
