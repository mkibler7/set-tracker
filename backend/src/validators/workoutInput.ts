import type {
  CreateWorkoutInput,
  UpdateWorkoutInput,
  WorkoutExerciseInput,
  WorkoutSetInput,
} from "../services/workoutsService.js";

function badRequest(message: string) {
  return Object.assign(new Error(message), { status: 400 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toOptionalTrimmedString(value: unknown): string | undefined {
  const str = trimString(value);
  return str ? str : undefined;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  return Number(value);
}

function assert(condition: any, message: string): asserts condition {
  if (!condition) throw Object.assign(new Error(message), { status: 400 });
}

/**
 * Accepts either:
 * - "YYYY-MM-DD" (preferred for calendar-day semantics)
 * - any Date-parseable string (fallback)
 *
 * Normalizes "YYYY-MM-DD" to UTC noon to avoid timezone day-shift.
 */
function parseCalendarDate(
  value: unknown,
  required: boolean,
): Date | undefined {
  if (value === null || value === undefined) {
    if (required) throw badRequest("date is required and must be valid");
    return undefined;
  }

  // If client ever sends a Date object (unlikely over JSON), accept it.
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw badRequest("date must be valid");
    return value;
  }

  const raw = trimString(value);
  if (!raw) {
    if (required) throw badRequest("date is required and must be valid");
    return undefined;
  }

  // Preferred: YYYY-MM-DD from <input type="date">
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (m) {
    const [, y, mo, d] = m;
    const iso = `${y}-${mo}-${d}T12:00:00.000Z`; // UTC noon avoids day drift
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) throw badRequest("date must be valid");
    return dt;
  }

  // Fallback: allow ISO timestamps, etc.
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime()))
    throw badRequest(
      required ? "date is required and must be valid" : "date must be valid",
    );
  return dt;
}

function parseDateRequired(value: unknown): Date {
  const dt = parseCalendarDate(value, true);
  // dt will never be undefined when required=true
  return dt!;
}

function parseDateOptional(value: unknown): Date | undefined {
  return parseCalendarDate(value, false);
}

function parseMuscleGroupsRequired(value: unknown): string[] {
  assert(Array.isArray(value), "muscleGroups must be an array");
  const muscleGroups = value.map(trimString).filter(Boolean);
  assert(muscleGroups.length > 0, "muscleGroups must have at least one entry");
  return muscleGroups;
}

function parseMuscleGroupsOptional(value: unknown): string[] | undefined {
  if (value === null || value === undefined) return undefined;
  assert(Array.isArray(value), "muscleGroups must be an array");
  return value.map(trimString).filter(Boolean);
}

function parseSetsRequired(value: unknown): WorkoutSetInput[] {
  assert(Array.isArray(value), "exercise.sets must be an array");
  const sets = value.map((set) => {
    assert(isRecord(set), "Each set must be an object");

    const weight = toNumber(set.weight);
    const reps = toNumber(set.reps);

    assert(
      Number.isFinite(weight) && weight > 0,
      "set weight must be a positive number",
    );
    assert(
      Number.isFinite(reps) && reps > 0,
      "set reps must be a positive number",
    );

    const tempo = toOptionalTrimmedString(set.tempo);
    const rpe =
      set.rpe === null || set.rpe === undefined ? undefined : toNumber(set.rpe);

    if (rpe !== undefined) {
      assert(
        Number.isFinite(rpe) && rpe >= 1 && rpe <= 10,
        "set rpe must be between 1 and 10",
      );
    }
    return {
      weight,
      reps,
      ...(tempo ? { tempo } : {}),
      ...(rpe !== undefined ? { rpe } : {}),
    };
  });
  return sets;
}

function parseExercsisesRequired(value: unknown): WorkoutExerciseInput[] {
  assert(Array.isArray(value), "exercises must be an array");

  return value.map((exercise) => {
    assert(isRecord(exercise), "Each exercise must be an object");
    const id = trimString(exercise.id ?? exercise.exerciseId);
    assert(id.length > 0, "Each exercise must have a valid id");

    const notes = toOptionalTrimmedString(exercise.notes);
    const sets = parseSetsRequired(exercise.sets);

    return {
      id,
      ...(notes ? { notes } : {}),
      sets,
    };
  });
}

function parseExercisesOptional(
  value: unknown,
): WorkoutExerciseInput[] | undefined {
  if (value === null || value === undefined) return undefined;
  return parseExercsisesRequired(value);
}

/**
 * Parse and validate POST /workouts input.
 * Returns a strongly typed CreateWorkoutInput or throws {status:400}.
 */
export function parseCreateWorkoutInput(body: unknown): CreateWorkoutInput {
  assert(isRecord(body), "Invalid input");

  return {
    date: parseDateRequired(body.date),
    muscleGroups: parseMuscleGroupsRequired(body.muscleGroups),
    exercises: parseExercisesOptional(body.exercises),
  };
}

/**
 * Parse and validate PUT /workouts/:id input (patch semantics).
 * Only validates fields that are present.
 * Returns a typed UpdateWorkoutInput or throws {status:400}.
 */
export function parseUpdateWorkoutInput(body: unknown): UpdateWorkoutInput {
  assert(isRecord(body), "Invalid input");

  const date = parseDateOptional(body.date);
  const muscleGroups = parseMuscleGroupsOptional(body.muscleGroups);
  const exercises = parseExercisesOptional(body.exercises);

  const updated: UpdateWorkoutInput = {};
  if (date !== undefined) updated.date = date;
  if (muscleGroups !== undefined) updated.muscleGroups = muscleGroups;
  if (exercises !== undefined) updated.exercises = exercises;

  // require at least on field for update
  assert(
    Object.keys(updated).length > 0,
    "At least one field (date, muscleGroups, exercises) must be provided for update",
  );
  return updated;
}
