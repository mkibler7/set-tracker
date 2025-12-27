"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";
import { useWorkoutSession } from "@/components/dailylog/useWorkoutSession";
import { WorkoutsAPI } from "@/lib/api/workouts";
import { ExerciseAPI } from "@/lib/api/exercises";
import type { Exercise } from "@/types/exercise";
import {
  ALL_MUSCLE_GROUPS,
  type MuscleGroup,
} from "@reptracker/shared/muscles";
import { set } from "date-fns";

type WorkoutStep = "empty" | "split" | "session";

export default function DailyLogClientPage() {
  // Zustand workout session store
  // Use individual selectors to avoid unnecessary re-renders
  const currentWorkout = useWorkoutSession((state) => state.currentWorkout);
  const stashedWorkout = useWorkoutSession((state) => state.stashedWorkout);
  const startWorkout = useWorkoutSession((state) => state.startWorkout);
  const updateMuscleGroups = useWorkoutSession(
    (state) => state.updateMuscleGroups
  );
  const endWorkout = useWorkoutSession((state) => state.endWorkout);
  const stashCurrentWorkout = useWorkoutSession(
    (state) => state.stashCurrentWorkout
  );
  const restoreStashedWorkout = useWorkoutSession(
    (state) => state.restoreStashedWorkout
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromWorkoutId = searchParams.get("fromWorkout");

  const loadedFromWorkoutRef = useRef<string | null>(null);

  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    MuscleGroup[]
  >([]);
  const [workoutDate, setWorkoutDate] = useState(new Date());

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isEditingSplit, setIsEditingSplit] = useState(false);

  // Backend-loaded exercise catalog (used for ExercisePicker / adding to session)
  const [exerciseCatalog, setExerciseCatalog] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

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
        const workout = await WorkoutsAPI.get(fromWorkoutId);
        if (cancelled) return;

        // Stash today's in-progress session so we can restore later
        const {
          currentWorkout,
          stashedWorkout,
          stashCurrentWorkout,
          startWorkout,
        } = useWorkoutSession.getState();

        if (currentWorkout && !stashedWorkout) stashCurrentWorkout();
        startWorkout(workout.muscleGroups, workout.date, workout.exercises);
        setStep("session");
        setSelectedMuscleGroups(workout.muscleGroups);
        setWorkoutDate(new Date(workout.date));
        setIsEditingSplit(false);
        setIsPickerOpen(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load workout:", error);

        // If a bad id was given, clear the param to avoid loops
        loadedFromWorkoutRef.current = null;
        router.replace("/dailylog");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fromWorkoutId, router]);

  // 2) If there is already a current workout in the store, auto-resume it
  useEffect(() => {
    if (fromWorkoutId || !currentWorkout || step !== "empty") return;

    const groups = currentWorkout.muscleGroups;

    setSelectedMuscleGroups(groups);
    setWorkoutDate(new Date(currentWorkout.date));
    setStep("session");
  }, [fromWorkoutId, currentWorkout, step]);

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
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleBeginSession = () => {
    if (selectedMuscleGroups.length === 0) return;

    const splitName = selectedMuscleGroups.join(" / ");

    // EDIT EXISTING SESSION (do NOT restart)
    if (isEditingSplit && currentWorkout) {
      updateMuscleGroups(selectedMuscleGroups);
      setStep("session");
      setIsEditingSplit(false);
      return;
    }

    // START NEW SESSION
    const dateString = workoutDate.toISOString();
    startWorkout(selectedMuscleGroups, dateString);
    setStep("session");
  };

  const handleCancelSplit = () => {
    if (isEditingSplit && currentWorkout) {
      setStep("session");
      setIsEditingSplit(false);
      return;
    }

    setSelectedMuscleGroups([]);
    setStep("empty");
  };

  const handleEditSplit = () => {
    if (!currentWorkout) return;

    const groups = currentWorkout.muscleGroups;

    setSelectedMuscleGroups(groups);
    setIsEditingSplit(true);
    setStep("split");
  };

  const handleSaveWorkout = async () => {
    if (!currentWorkout) return;

    // Prevent multiple saves
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    // Check if we are editing an existing history workout
    const isEditingHistory = !!fromWorkoutId;

    // Normalize currentWorkout.exercises
    const catalogById = Object.fromEntries(
      exerciseCatalog.map((e) => [e.id, e])
    );
    const catalogByName = Object.fromEntries(
      exerciseCatalog.map((e) => [e.name.trim().toLowerCase(), e])
    );

    const payload = {
      date: currentWorkout.date,
      muscleGroups: currentWorkout.muscleGroups,
      exercises: currentWorkout.exercises,
    };

    try {
      if (isEditingHistory && fromWorkoutId) {
        // Update existing workout
        await WorkoutsAPI.update(fromWorkoutId, payload);
      } else {
        // Create new workout
        await WorkoutsAPI.create(payload);
      }

      endWorkout();
      setIsPickerOpen(false);
      setIsEditingSplit(false);

      if (isEditingHistory) {
        // Keep the current id “locked” until the query param is actually gone
        loadedFromWorkoutRef.current = fromWorkoutId;
        router.replace("/dailylog");

        if (stashedWorkout) {
          restoreStashedWorkout();

          setSelectedMuscleGroups(stashedWorkout.muscleGroups);
          setWorkoutDate(new Date(stashedWorkout.date));
          setStep("session");
          return;
        }

        // Otherwise reset UI to empty state
        setSelectedMuscleGroups([]);
        setWorkoutDate(new Date());
        setStep("empty");
        return;
      }

      // Normal save (ending today's session)
      setSelectedMuscleGroups([]);
      setWorkoutDate(new Date());
      setStep("empty");
    } catch (error) {
      console.error("Failed to save workout:", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving."
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
