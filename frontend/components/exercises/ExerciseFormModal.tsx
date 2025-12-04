"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ExerciseFormValues, MuscleGroup } from "@/types/exercise";
import { ALL_MUSCLE_GROUPS } from "@/types/exercise";

type ExerciseFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ExerciseFormValues) => void;
  muscleGroupOptions: MuscleGroup[];
};

const EMPTY_FORM: ExerciseFormValues = {
  name: "",
  primaryMuscleGroup: "Chest",
  secondaryMuscleGroups: [],
  description: "",
};

export default function ExerciseFormModal({
  isOpen,
  onClose,
  onSave,
}: ExerciseFormModalProps) {
  const [values, setValues] = useState<ExerciseFormValues>(EMPTY_FORM);

  if (!isOpen) return null;

  // generic helper to update a field
  const updateField = <K extends keyof ExerciseFormValues>(
    key: K,
    value: ExerciseFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // individual change handlers so TS is happy about element types
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateField("name", e.target.value);
  };

  const handlePrimaryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateField("primaryMuscleGroup", e.target.value as MuscleGroup);
  };

  const handleSecondaryChange = (group: MuscleGroup) => {
    setValues((prev) => {
      const alreadySelected = prev.secondaryMuscleGroups.includes(group);

      return {
        ...prev,
        secondaryMuscleGroups: alreadySelected
          ? prev.secondaryMuscleGroups.filter((g) => g !== group)
          : [...prev.secondaryMuscleGroups, group],
      };
    });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateField("description", e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // basic required validation: only name + primary
    if (!values.name.trim()) {
      // you can swap this for a nicer inline error
      alert("Please enter an exercise name.");
      return;
    }

    const cleaned: ExerciseFormValues = {
      name: values.name.trim(),
      primaryMuscleGroup: values.primaryMuscleGroup,
      secondaryMuscleGroups: values.secondaryMuscleGroups,
      description: values.description?.trim() || undefined,
    };

    onSave(cleaned);
    setValues(EMPTY_FORM);
  };

  const handleCancel = () => {
    setValues(EMPTY_FORM);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl bg-slate-950 p-6 shadow-xl border border-slate-800">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Add Exercise
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Exercise name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.name}
              onChange={handleNameChange}
              className="w-full rounded-md border border-border bg-slate-900 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Incline Barbell Bench Press"
            />
          </div>

          {/* Primary muscle group */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Primary muscle group<span className="text-red-500">*</span>
            </label>
            <select
              value={values.primaryMuscleGroup}
              onChange={handlePrimaryChange}
              className="w-full rounded-md border border-border bg-slate-900 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ALL_MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary muscle groups (multi-select as pills) */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Secondary muscle groups (optional)
            </label>

            <div className="flex flex-wrap gap-2 rounded-md bg-slate-850 px-3 py-2">
              {ALL_MUSCLE_GROUPS.map((group) => {
                const isSelected = values.secondaryMuscleGroups.includes(group);

                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => handleSecondaryChange(group)}
                    className={
                      "rounded-full border px-3 py-1 text-xs transition-colors " +
                      (isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card/50 text-muted-foreground hover:bg-card/80")
                    }
                    aria-pressed={isSelected}
                  >
                    {group}
                  </button>
                );
              })}
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Tap to toggle one or more muscle groups.
            </p>
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description (optional)
            </label>
            <textarea
              value={values.description ?? ""}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full rounded-md border border-border bg-slate-900 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Short description of how to perform the exercise."
            />
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110"
            >
              Save Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
