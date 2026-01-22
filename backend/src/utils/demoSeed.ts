import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function midDay(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(p: number) {
  return Math.random() < p;
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = randInt(0, copy.length - 1);
    out.push(copy.splice(i, 1)[0]!);
  }
  return out;
}

type ExercisePick = {
  _id: any;
  primaryMuscleGroup?: string;
};

function buildDemoWorkout(date: Date, picks: ExercisePick[]) {
  // 3–5 exercises per session
  const exerciseCount = Math.min(randInt(3, 5), picks.length);
  const chosen = sample(picks, exerciseCount);

  // Muscle groups: derive from chosen exercises where possible
  const mg = Array.from(
    new Set(
      chosen
        .map((e) =>
          e.primaryMuscleGroup ? String(e.primaryMuscleGroup) : null,
        )
        .filter((x): x is string => Boolean(x)),
    ),
  );

  const fallbackMG = ["Chest", "Back", "Legs", "Shoulders", "Arms"];
  const muscleGroups = mg.length ? mg.slice(0, 3) : sample(fallbackMG, 2);

  const exercises = chosen.map((e, idx) => {
    const exerciseId = String(e._id);

    const baseReps = randInt(6, 12);
    const baseWeight = randInt(85, 245);

    // 3–5 working sets, plus optional warmup
    const workingSets = randInt(3, 5);
    const sets: any[] = [];

    if (chance(0.65)) {
      sets.push({
        reps: randInt(8, 12),
        weight: Math.max(45, baseWeight - randInt(25, 45)),
        isWarmup: true,
      });
    }

    for (let s = 0; s < workingSets; s++) {
      const repsJitter = randInt(-2, 2);
      const weightJitter = randInt(-10, 15);

      sets.push({
        reps: Math.max(4, baseReps + repsJitter),
        weight: Math.max(45, baseWeight + weightJitter + s * randInt(0, 5)),
      });
    }

    return {
      id: exerciseId,
      notes: idx === 0 ? "Demo session" : "",
      sets,
    };
  });

  return { date: midDay(date), muscleGroups, exercises };
}

export async function ensureRollingDemoData(userId: string) {
  const WINDOW_DAYS = Number(process.env.DEMO_WINDOW_DAYS ?? "90");

  const today = startOfDay(new Date());
  const start = addDays(today, -(WINDOW_DAYS - 1)); // inclusive start
  const endExclusive = addDays(today, 1);

  // Existing workouts in the window
  const existing = await Workout.find({
    userId,
    date: { $gte: start, $lt: endExclusive },
  }).select("date");

  const have = new Set(existing.map((w) => dayKey(new Date(w.date))));

  // Pull some global exercises to reference
  const picks = (await Exercise.find({ scope: "global" })
    .limit(80)
    .select("_id primaryMuscleGroup")) as ExercisePick[];

  // Create missing days (with rest days)
  for (let i = 0; i < WINDOW_DAYS; i++) {
    const d = addDays(start, i);
    const k = dayKey(d);
    if (have.has(k)) continue;

    // ~15% rest days (rest day = no workout created)
    if (chance(0.15)) continue;

    const payload =
      picks.length > 0
        ? buildDemoWorkout(d, picks)
        : { date: midDay(d), muscleGroups: ["Chest"], exercises: [] };

    await Workout.create({
      userId,
      date: payload.date,
      muscleGroups: payload.muscleGroups,
      exercises: payload.exercises,
    });
  }

  // Prune anything older than the window (demo only)
  const cutoff = addDays(today, -WINDOW_DAYS);
  await Workout.deleteMany({ userId, date: { $lt: cutoff } });
}
