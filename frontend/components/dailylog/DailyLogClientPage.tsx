"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";
import { useWorkoutSession } from "@/components/dailylog/useWorkoutSession";
import { MOCK_WORKOUTS, Workout } from "@/data/mockWorkouts";

type WorkoutStep = "empty" | "split" | "session";

const ALL_SPLIT_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Traps",
  "Biceps",
  "Triceps",
  "Calves",
  "Adductors",
  "Abductors",
  "Abs",
];

export default function DailyLogClientPage() {
  const {
    currentWorkout,
    stashedWorkout,
    stashCurrentWorkout,
    restoreStashedWorkout,
    startWorkout,
    endWorkout,
    updateSplit, // ✅ add this
  } = useWorkoutSession();

  const router = useRouter();
  const loadedFromWorkoutRef = useRef<string | null>(null);
  const closingHistoryRef = useRef(false);
  const searchParams = useSearchParams();
  const fromWorkoutId = searchParams.get("fromWorkout");

  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [isEditingSplit, setIsEditingSplit] = useState(false); // ✅ NEW

  // 1) If we arrive with ?fromWorkout=123, auto-load that workout
  useEffect(() => {
    // While we are closing an edit-history flow, ignore fromWorkout loads
    if (closingHistoryRef.current && fromWorkoutId) return;
    // If the param is cleared, allow future history-loads again.
    if (!fromWorkoutId) {
      loadedFromWorkoutRef.current = null;
      closingHistoryRef.current = false;
      return;
    }

    // Prevent re-loading the same history workout after startWorkout() updates store state.
    if (loadedFromWorkoutRef.current === fromWorkoutId) return;

    const workout: Workout | undefined = MOCK_WORKOUTS.find(
      (w) => w.id === fromWorkoutId
    );
    if (!workout) return;

    // Stash today's in-progress session so we can restore later
    if (currentWorkout && !stashedWorkout) {
      stashCurrentWorkout();
    }

    const groups = workout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setWorkoutDate(new Date(workout.date));
    setIsEditingSplit(false);
    setIsPickerOpen(false);

    startWorkout(workout.split, workout.date, workout.exercises);
    setStep("session");

    // Mark as loaded so we don't run again for this same id.
    loadedFromWorkoutRef.current = fromWorkoutId;
  }, [
    fromWorkoutId,
    startWorkout,
    currentWorkout,
    stashedWorkout,
    stashCurrentWorkout,
  ]);

  // 2) If there is already a current workout in the store, auto-resume it
  useEffect(() => {
    if (fromWorkoutId || !currentWorkout || step !== "empty") return;

    const groups = currentWorkout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setWorkoutDate(new Date(currentWorkout.date));
    setStep("session");
  }, [fromWorkoutId, currentWorkout, step]);

  const splitLabel =
    selectedMuscleGroups.length > 0
      ? selectedMuscleGroups.join(" / ")
      : "Start Workout";

  const headerTitle =
    step === "session"
      ? splitLabel
      : isEditingSplit
      ? "Edit Workout"
      : "Start Workout";

  const handleToggleMuscleGroup = (group: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleBeginSession = () => {
    if (selectedMuscleGroups.length === 0) return;

    const splitName = selectedMuscleGroups.join(" / ");

    // EDIT EXISTING SESSION (do NOT restart)
    if (isEditingSplit && currentWorkout) {
      updateSplit(splitName);
      setStep("session");
      setIsEditingSplit(false);
      return;
    }

    // START NEW SESSION
    const dateString = workoutDate.toISOString();
    startWorkout(splitName, dateString);
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

    const groups = currentWorkout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setIsEditingSplit(true);
    setStep("split");
  };

  const handleSaveWorkout = () => {
    const isEditingHistory = !!fromWorkoutId;

    // Ends whatever is currently loaded in the session view (today OR the history workout)
    endWorkout();

    setIsPickerOpen(false);
    setIsEditingSplit(false);

    if (isEditingHistory) {
      // Clear query param so refresh doesn't re-load the history workout
      closingHistoryRef.current = true;

      // Keep the current id “locked” until the query param is actually gone
      loadedFromWorkoutRef.current = fromWorkoutId;

      router.replace("/dailylog");

      // If we had a session before editing history, restore it
      if (stashedWorkout) {
        restoreStashedWorkout();

        const groups = stashedWorkout.split
          .split("/")
          .map((g) => g.trim())
          .filter(Boolean);

        setSelectedMuscleGroups(groups);
        setWorkoutDate(new Date(stashedWorkout.date));
        setStep("session");
        return;
      }

      // No stashed session → return to today's empty state
      setSelectedMuscleGroups([]);
      setWorkoutDate(new Date()); //  reset to current date
      setStep("empty");
      return;
    }

    // Normal save (ending today's session)
    setSelectedMuscleGroups([]);
    setWorkoutDate(new Date()); //  reset to current date
    setStep("empty");
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
            allGroups={ALL_SPLIT_GROUPS}
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
            />
          </div>
        )}
      </div>
    </main>
  );
}
