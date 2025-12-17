import { Router, type Request, type Response } from "express";
import Workout from "../models/Workout.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { from, to, days } = req.query as {
      from?: string;
      to?: string;
      days?: string;
    };

    // Build Mongo filter only if params are provided
    const filter: Record<string, unknown> = {};

    // Helper: parse "YYYY-MM-DD" safely
    const parseDate = (value: string): Date | null => {
      // Expect YYYY-MM-DD to avoid timezone surprises
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
      const d = new Date(`${value}T00:00:00.000Z`);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    // days=7 convenience (takes precedence if provided and valid)
    const daysNum = days ? Number(days) : NaN;
    if (Number.isFinite(daysNum) && daysNum > 0) {
      const end = new Date(); // now
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - Math.floor(daysNum));
      filter.date = { $gte: start, $lte: end };
    } else {
      const start = from ? parseDate(from) : null;
      const endStart = to ? parseDate(to) : null;

      if (from && !start) {
        return res.status(400).json({
          message: "Invalid 'from' date. Use format YYYY-MM-DD.",
        });
      }
      if (to && !endStart) {
        return res.status(400).json({
          message: "Invalid 'to' date. Use format YYYY-MM-DD.",
        });
      }

      // If "to" is provided, make it inclusive through the end of that day
      if (start || endStart) {
        const range: Record<string, Date> = {};
        if (start) range.$gte = start;

        if (endStart) {
          const endInclusive = new Date(endStart);
          endInclusive.setUTCDate(endInclusive.getUTCDate() + 1);
          range.$lt = endInclusive; // exclusive upper bound (next day midnight)
        }

        filter.date = range;
      }
    }

    const workouts = await Workout.find(filter).sort({ date: -1 });
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

// DEV ONLY: delete all workouts
router.delete("/__dev__/all", async (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Not allowed" });
  }

  const result = await Workout.deleteMany({});
  return res.json({ ok: true, deletedCount: result.deletedCount });
});

export default router;
