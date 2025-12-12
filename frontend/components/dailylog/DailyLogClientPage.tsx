"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
    startWorkout,
    endWorkout,
    updateSplit, // ✅ add this
  } = useWorkoutSession();

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
    if (!fromWorkoutId) return;

    const workout: Workout | undefined = MOCK_WORKOUTS.find(
      (w) => w.id === fromWorkoutId
    );
    if (!workout) return;

    const groups = workout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setWorkoutDate(new Date(workout.date));

    startWorkout(workout.split, workout.date, workout.exercises);
    setStep("session");
  }, [fromWorkoutId, startWorkout]);

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
    endWorkout();

    setSelectedMuscleGroups([]);
    setStep("empty");
    setIsPickerOpen(false);
    setIsEditingSplit(false);
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
