import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkoutExercise, WorkoutSet } from "@/types/workout";
import type { MuscleGroup } from "@reptracker/shared/muscles";
import type { SetFormValues } from "@/components/dailylog/SetForm";

type DraftKind = "session" | "edit";

export type WorkoutDraft = {
  kind: DraftKind;

  /** Local identifier for the draft itself (not the DB id). */
  draftId: string;

  /**
   * When editing an existing workout, this is the DB workout id.
   * When logging a new workout, this starts as null and becomes the created id.
   */
  workoutId: string | null;

  /** Used to detect “editing a different workout” and prompt accordingly */
  sourceWorkoutId: string | null;

  date: string;
  muscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];

  dirty: boolean;
  updatedAt: number;
};

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return Date.now();
}

function makeEmptySessionDraft(
  muscleGroups: MuscleGroup[] = [],
  date: string = new Date().toISOString(),
  exercises: WorkoutExercise[] = []
): WorkoutDraft {
  return {
    kind: "session",
    draftId: makeId(),
    workoutId: null,
    sourceWorkoutId: null,
    date,
    muscleGroups,
    exercises,
    dirty: false,
    updatedAt: now(),
  };
}

function makeEditDraftFromWorkout(workout: {
  id: string;
  date: string;
  muscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];
}): WorkoutDraft {
  return {
    kind: "edit",
    draftId: makeId(),
    workoutId: workout.id,
    sourceWorkoutId: workout.id,
    date: workout.date,
    muscleGroups: workout.muscleGroups ?? [],
    exercises: workout.exercises ?? [],
    dirty: false,
    updatedAt: now(),
  };
}

type WorkoutState = {
  sessionDraft: WorkoutDraft | null;
  editDraft: WorkoutDraft | null;

  // ---- Session ----
  startSession: (
    muscleGroups: MuscleGroup[],
    date: string,
    exercises?: WorkoutExercise[]
  ) => void;

  updateSessionMeta: (updates: {
    date?: string;
    muscleGroups?: MuscleGroup[];
  }) => void;

  setSessionWorkoutId: (workoutId: string) => void;

  upsertSessionExercise: (exercise: WorkoutExercise) => void;
  removeSessionExercise: (exerciseId: string) => void;
  updateSessionExerciseNotes: (exerciseId: string, notes: string) => void;

  addSessionSet: (exerciseId: string, values: SetFormValues) => void;
  updateSessionSet: (
    exerciseId: string,
    setId: string,
    values: SetFormValues
  ) => void;
  deleteSessionSet: (exerciseId: string, setId: string) => void;

  markSessionSaved: () => void;
  resetSession: () => void;

  // ---- Edit ----
  canReplaceEditDraft: (nextWorkoutId: string) => {
    ok: boolean;
    reason?: "dirty";
  };

  startEdit: (workout: {
    id: string;
    date: string;
    muscleGroups: MuscleGroup[];
    exercises: WorkoutExercise[];
  }) => void;

  updateEditMeta: (updates: {
    date?: string;
    muscleGroups?: MuscleGroup[];
  }) => void;

  upsertEditExercise: (exercise: WorkoutExercise) => void;
  removeEditExercise: (exerciseId: string) => void;
  updateEditExerciseNotes: (exerciseId: string, notes: string) => void;

  addEditSet: (exerciseId: string, values: SetFormValues) => void;
  updateEditSet: (
    exerciseId: string,
    setId: string,
    values: SetFormValues
  ) => void;
  deleteEditSet: (exerciseId: string, setId: string) => void;

  markEditSaved: () => void;
  resetEditDraft: () => void;

  // helpful for AuthBootstrap / logout
  resetAllDrafts: () => void;
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => {
      const updateDraft = (
        key: "sessionDraft" | "editDraft",
        updater: (d: WorkoutDraft) => WorkoutDraft
      ) => {
        set((state) => {
          const draft = state[key];
          if (!draft) return state;
          return { [key]: updater(draft) } as Pick<WorkoutState, typeof key>;
        });
      };

      const upsertExercise = (list: WorkoutExercise[], ex: WorkoutExercise) => {
        const exists = list.some((e) => e.exerciseId === ex.exerciseId);
        return exists
          ? list.map((e) => (e.exerciseId === ex.exerciseId ? ex : e))
          : [...list, ex];
      };

      const makeSet = (values: SetFormValues): WorkoutSet => ({
        id: makeId(),
        reps: values.reps ?? 0,
        weight: values.weight ?? 0,
        tempo: values.tempo,
        rpe: values.rpe,
        isWarmup: values.isWarmup ?? false,
      });

      return {
        sessionDraft: null,
        editDraft: null,

        // ---- Session ----
        startSession: (muscleGroups, date, exercises = []) =>
          set(() => ({
            sessionDraft: makeEmptySessionDraft(muscleGroups, date, exercises),
          })),

        updateSessionMeta: (updates) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            date: updates.date ?? d.date,
            muscleGroups: updates.muscleGroups ?? d.muscleGroups,
            dirty: true,
            updatedAt: now(),
          })),

        setSessionWorkoutId: (workoutId) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            workoutId,
            updatedAt: now(),
          })),

        upsertSessionExercise: (exercise) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            exercises: upsertExercise(d.exercises, exercise),
            dirty: true,
            updatedAt: now(),
          })),

        removeSessionExercise: (exerciseId) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            exercises: d.exercises.filter((e) => e.exerciseId !== exerciseId),
            dirty: true,
            updatedAt: now(),
          })),

        updateSessionExerciseNotes: (exerciseId, notes) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId ? { ...e, notes } : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        addSessionSet: (exerciseId, values) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId
                ? { ...e, sets: [...e.sets, makeSet(values)] }
                : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        updateSessionSet: (exerciseId, setId, values) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId
                ? {
                    ...e,
                    sets: e.sets.map((s) =>
                      s.id === setId
                        ? {
                            ...s,
                            reps: values.reps ?? s.reps,
                            weight: values.weight ?? s.weight,
                            tempo: values.tempo ?? s.tempo,
                            rpe: values.rpe ?? s.rpe,
                            isWarmup: values.isWarmup ?? s.isWarmup,
                          }
                        : s
                    ),
                  }
                : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        deleteSessionSet: (exerciseId, setId) =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId
                ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
                : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        markSessionSaved: () =>
          updateDraft("sessionDraft", (d) => ({
            ...d,
            dirty: false,
            updatedAt: now(),
          })),

        resetSession: () => set(() => ({ sessionDraft: null })),

        // ---- Edit ----
        canReplaceEditDraft: (nextWorkoutId) => {
          const ed = get().editDraft;
          if (!ed) return { ok: true };
          if (ed.sourceWorkoutId === nextWorkoutId) return { ok: true };
          if (ed.dirty) return { ok: false, reason: "dirty" };
          return { ok: true };
        },

        startEdit: (workout) =>
          set(() => ({
            editDraft: makeEditDraftFromWorkout(workout),
          })),

        updateEditMeta: (updates) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            date: updates.date ?? d.date,
            muscleGroups: updates.muscleGroups ?? d.muscleGroups,
            dirty: true,
            updatedAt: now(),
          })),

        upsertEditExercise: (exercise) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            exercises: upsertExercise(d.exercises, exercise),
            dirty: true,
            updatedAt: now(),
          })),

        removeEditExercise: (exerciseId) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            exercises: d.exercises.filter((e) => e.exerciseId !== exerciseId),
            dirty: true,
            updatedAt: now(),
          })),

        updateEditExerciseNotes: (exerciseId, notes) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId ? { ...e, notes } : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        addEditSet: (exerciseId, values) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId
                ? { ...e, sets: [...e.sets, makeSet(values)] }
                : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        updateEditSet: (exerciseId, setId, values) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId
                ? {
                    ...e,
                    sets: e.sets.map((s) =>
                      s.id === setId
                        ? {
                            ...s,
                            reps: values.reps ?? s.reps,
                            weight: values.weight ?? s.weight,
                            tempo: values.tempo ?? s.tempo,
                            rpe: values.rpe ?? s.rpe,
                            isWarmup: values.isWarmup ?? s.isWarmup,
                          }
                        : s
                    ),
                  }
                : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        deleteEditSet: (exerciseId, setId) =>
          updateDraft("editDraft", (d) => ({
            ...d,
            exercises: d.exercises.map((e) =>
              e.exerciseId === exerciseId
                ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
                : e
            ),
            dirty: true,
            updatedAt: now(),
          })),

        markEditSaved: () =>
          updateDraft("editDraft", (d) => ({
            ...d,
            dirty: false,
            updatedAt: now(),
          })),

        resetEditDraft: () => set(() => ({ editDraft: null })),

        resetAllDrafts: () =>
          set(() => ({ sessionDraft: null, editDraft: null })),
      };
    },
    {
      name: "reptracker-workout-drafts",
      version: 1,
      partialize: (state) => ({
        sessionDraft: state.sessionDraft,
        editDraft: state.editDraft,
      }),
    }
  )
);
