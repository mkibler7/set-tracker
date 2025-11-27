"use client";

import React, { useState } from "react";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";

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

export default function DailyLogPage() {
  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );
  const [workoutDate] = useState(new Date());

  const splitLabel =
    selectedMuscleGroups.length > 0
      ? selectedMuscleGroups.join(" / ")
      : "Start Workout";

  const headerTitle = step === "session" ? splitLabel : "Start Workout";

  const handleToggleMuscleGroup = (group: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleBeginSession = () => {
    if (selectedMuscleGroups.length === 0) return;
    setStep("session");
  };

  return (
    <main className="flex-1 h-full flex flex-col px-4 py-2 sm:px-6 lg:px-8">
      <Header
        title={headerTitle}
        date={workoutDate}
        isSession={step === "session"}
        onEditSplit={step === "session" ? () => setStep("split") : undefined}
      />

      {step === "empty" && <EmptyState onStart={() => setStep("split")} />}

      {step === "split" && (
        <SplitSelector
          allGroups={ALL_SPLIT_GROUPS}
          selected={selectedMuscleGroups}
          onToggleGroup={handleToggleMuscleGroup}
          onCancel={() => {
            setSelectedMuscleGroups([]);
            setStep("empty");
          }}
          onBegin={handleBeginSession}
        />
      )}

      {step === "session" && (
        <div className="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 lg:px-8 scroll">
          <SessionView selectedMuscleGroups={selectedMuscleGroups} />
        </div>
      )}
    </main>
  );
}
