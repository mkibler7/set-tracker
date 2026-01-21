"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import { WorkoutsAPI } from "@/lib/api/workouts";
import { ExerciseAPI } from "@/lib/api/exercises";
import type { Exercise } from "@/types/exercise";
import {
  ALL_MUSCLE_GROUPS,
  type MuscleGroup,
} from "@reptracker/shared/muscles";

type WorkoutStep = "empty" | "split" | "session";

export default function DailyLogClientPage() {
  // Zustand workout session store
  // Use individual selectors to avoid unnecessary re-renders
  const sessionDraft = useWorkoutStore((s) => s.sessionDraft);
  const editDraft = useWorkoutStore((s) => s.editDraft);

  const startSession = useWorkoutStore((s) => s.startSession);
  const updateSessionMeta = useWorkoutStore((s) => s.updateSessionMeta);
  const resetSession = useWorkoutStore((s) => s.resetSession);

  const canReplaceEditDraft = useWorkoutStore((s) => s.canReplaceEditDraft);
  const startEdit = useWorkoutStore((s) => s.startEdit);
  const resetEditDraft = useWorkoutStore((s) => s.resetEditDraft);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromWorkoutId = searchParams.get("fromWorkout");

  const isEditingHistory = !!fromWorkoutId;
  const activeDraft = isEditingHistory ? editDraft : sessionDraft;

  const loadedFromWorkoutRef = useRef<string | null>(null);

  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    MuscleGroup[]
  >([]);
  const [workoutDate, setWorkoutDate] = useState(new Date());

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isEditingSplit, setIsEditingSplit] = useState(false);

  // Backend-loaded exercise catalog (used for ExercisePicker / adding to session)
  const [exerciseCatalog, setExerciseCatalog] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  function toYYYYMMDDUTC(value: string | Date) {
    const d = value instanceof Date ? value : new Date(value);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function fromYYYYMMDDToUTCNoon(yyyyMmDd: string) {
    // store as UTC noon to avoid day-shift
    return new Date(`${yyyyMmDd}T12:00:00.000Z`);
  }

  // Load exercise catalog once (client-side)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setExercisesLoading(true);
        setExercisesError(null);
        const list = await ExerciseAPI.list();
        if (!cancelled) setExerciseCatalog(list);
      } catch (err) {
        if (!cancelled) setExercisesError("Failed to load exercises.");
      } finally {
        if (!cancelled) setExercisesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 1) If we arrive with ?fromWorkout=123, auto-load that workout
  useEffect(() => {
    if (!fromWorkoutId) return;

    let cancelled = false;

    (async () => {
      try {
        const gate = canReplaceEditDraft(fromWorkoutId);
        if (!gate.ok && gate.reason === "dirty") {
          const discard = window.confirm(
            "You have unsaved changes from another edit. Discard them and edit this workout instead?",
          );
          if (!discard) {
            router.replace("/workouts");
            return;
          }
          resetEditDraft();
        }

        const workout = await WorkoutsAPI.get(fromWorkoutId);

        if (cancelled) return;

        startEdit({
          id: workout.id,
          date: workout.date,
          muscleGroups: workout.muscleGroups,
          exercises: workout.exercises,
        });

        setStep("session");
        setSelectedMuscleGroups(workout.muscleGroups);
        setWorkoutDate(new Date(workout.date));
        setIsEditingSplit(false);
        setIsPickerOpen(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load workout:", error);
        router.replace("/dailylog");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fromWorkoutId, canReplaceEditDraft, resetEditDraft, startEdit, router]);

  // 2) If there is already a current workout in the store, auto-resume it
  useEffect(() => {
    if (fromWorkoutId || !sessionDraft || step !== "empty") return;

    setSelectedMuscleGroups(sessionDraft.muscleGroups);
    setWorkoutDate(new Date(sessionDraft.date));
    setStep("session");
  }, [fromWorkoutId, sessionDraft, step]);

  const splitLabel =
    (selectedMuscleGroups?.length ?? 0) > 0
      ? selectedMuscleGroups.join(" / ")
      : "Start Workout";

  const headerTitle =
    step === "session"
      ? splitLabel
      : isEditingSplit
        ? "Edit Workout"
        : "Start Workout";

  const handleToggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );
  };

  const handleBeginSession = () => {
    if (selectedMuscleGroups.length === 0) return;

    // Editing the split of the currently open draft (session OR edit)
    if (isEditingSplit && activeDraft) {
      if (isEditingHistory) {
        useWorkoutStore.getState().updateEditMeta({
          muscleGroups: selectedMuscleGroups,
          date: workoutDate.toISOString(),
        });
      } else {
        updateSessionMeta({
          muscleGroups: selectedMuscleGroups,
          date: workoutDate.toISOString(),
        });
      }

      setStep("session");
      setIsEditingSplit(false);
      return;
    }

    // Starting a NEW session draft
    if (!isEditingHistory) {
      startSession(selectedMuscleGroups, workoutDate.toISOString());
      setStep("session");
      return;
    }

    // If we’re editing history and not in "edit split" mode, do nothing here.
    // Edit draft is created by the fromWorkout effect.
  };

  const handleCancelSplit = () => {
    // If user was editing split for an existing draft, just return to session view
    if (isEditingSplit && activeDraft) {
      setStep("session");
      setIsEditingSplit(false);
      return;
    }

    // Otherwise we were starting a brand new session and want to exit back to empty
    setSelectedMuscleGroups([]);
    setWorkoutDate(new Date());
    setStep("empty");
  };

  const handleEditSplit = () => {
    if (!activeDraft) return;

    setSelectedMuscleGroups(activeDraft.muscleGroups);
    setWorkoutDate(new Date(activeDraft.date));
    setIsEditingSplit(true);
    setStep("split");
  };

  const handleSaveWorkout = async () => {
    if (!activeDraft) return;

    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      date: activeDraft.date,
      muscleGroups: activeDraft.muscleGroups,
      exercises: activeDraft.exercises,
    };

    try {
      if (isEditingHistory && fromWorkoutId) {
        await WorkoutsAPI.update(fromWorkoutId, payload);

        // Clear edit mode + draft
        resetEditDraft();
        setIsPickerOpen(false);
        setIsEditingSplit(false);

        router.replace("/dailylog");

        // If a session draft exists, show it; otherwise empty
        if (sessionDraft) {
          setSelectedMuscleGroups(sessionDraft.muscleGroups);
          setWorkoutDate(new Date(sessionDraft.date));
          setStep("session");
        } else {
          setSelectedMuscleGroups([]);
          setWorkoutDate(new Date());
          setStep("empty");
        }

        return;
      }

      // Normal session save -> create new workout
      await WorkoutsAPI.create(payload);

      resetSession();
      setIsPickerOpen(false);
      setIsEditingSplit(false);

      setSelectedMuscleGroups([]);
      setWorkoutDate(new Date());
      setStep("empty");
    } catch (error) {
      console.error("Failed to save workout:", error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save workout.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="page">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <Header
          title={headerTitle}
          date={workoutDate}
          isSession={step === "session"}
          onEditSplit={step === "session" ? handleEditSplit : undefined}
          onAddExercise={
            step === "session" ? () => setIsPickerOpen(true) : undefined
          }
          canEditDate={isEditingHistory && step === "session"}
          onCommitDate={(ymd) => {
            if (!isEditingHistory) return;

            const next = fromYYYYMMDDToUTCNoon(ymd);
            setWorkoutDate(next);

            // Persist into edit draft so Save Workout uses it
            useWorkoutStore.getState().updateEditMeta({
              date: next.toISOString(),
            });
          }}
        />

        {step === "empty" && (
          <div className="flex flex-1 items-center justify-center pb-10 sm:pb-16 lg:pb-20">
            <EmptyState onStart={() => setStep("split")} />
          </div>
        )}

        {step === "split" && (
          <SplitSelector
            allGroups={ALL_MUSCLE_GROUPS}
            selected={selectedMuscleGroups}
            onToggleGroup={handleToggleMuscleGroup}
            onCancel={handleCancelSplit}
            onBegin={handleBeginSession}
            primaryLabel={isEditingSplit ? "Save changes" : "Begin Session"}
          />
        )}

        {step === "session" && (
          <div className="flex-1 flex flex-col overflow-hidden scroll">
            <SessionView
              mode={isEditingHistory ? "edit" : "session"}
              selectedMuscleGroups={selectedMuscleGroups}
              fromWorkoutId={fromWorkoutId}
              isPickerOpen={isPickerOpen}
              onClosePicker={() => setIsPickerOpen(false)}
              onOpenPicker={() => setIsPickerOpen(true)}
              onSaveWorkout={handleSaveWorkout}
              exerciseCatalog={exerciseCatalog}
              exercisesCatalogLoading={exercisesLoading}
            />
          </div>
        )}
      </div>
    </main>
  );
}
