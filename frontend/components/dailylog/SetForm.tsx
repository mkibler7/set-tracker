"use client";

import React, { useState } from "react";

export type SetFormValues = {
  reps: number;
  weight: number;
  volume?: number;
  rpe?: number;
  tempo?: string;
  notes?: string;
};

type SetFormProps = {
  initialValues?: SetFormValues;
  submitLabel?: string;
  onSave: (values: SetFormValues) => void;
  onCancel?: () => void;
};

export default function SetForm({
  initialValues,
  submitLabel = "Save",
  onSave,
  onCancel,
}: SetFormProps) {
  const [reps, setReps] = useState<string>(
    initialValues?.reps !== undefined ? String(initialValues.reps) : ""
  );
  const [weight, setWeight] = useState<string>(
    initialValues?.weight !== undefined ? String(initialValues.weight) : ""
  );
  const [rpe, setRpe] = useState<string>(
    initialValues?.rpe !== undefined ? String(initialValues.rpe) : ""
  );
  const [tempo, setTempo] = useState<string>(initialValues?.tempo ?? "");
  // const [notes, setNotes] = useState<string>(initialValues?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const repsNum = Number(reps);
    const weightNum = Number(weight);
    const rpeNum = rpe ? Number(rpe) : undefined;

    if (!Number.isFinite(repsNum) || repsNum <= 0) return;
    if (!Number.isFinite(weightNum) || weightNum < 0) return;
    if (rpe && (!Number.isFinite(rpeNum) || rpeNum! < 1 || rpeNum! > 10))
      return;

    const tempoClean = tempo.trim();

    onSave({
      reps: repsNum,
      weight: weightNum,
      volume: repsNum * weightNum,
      rpe: rpeNum,
      tempo: tempo || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-xs text-foreground">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Reps</label>
          <input
            type="number"
            min={1}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">
            Weight (lb)
          </label>
          <input
            type="number"
            min={0}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">
            RPE (1-10)
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground">Tempo</label>
          <input
            type="text"
            placeholder="e.g. 4-2-1-2"
            value={tempo}
            onChange={(e) => {
              e.currentTarget.setCustomValidity("");
              setTempo(e.target.value);
            }}
            pattern="[0-9]+-[0-9]+-[0-9]+-[0-9]+"
            onInvalid={(e) => {
              const value = e.currentTarget.value.trim();
              if (value !== "") {
                e.currentTarget.setCustomValidity(
                  "Tempo must be in the format X-X-X-X (e.g., 4-2-1-2) or left empty."
                );
              } else {
                e.currentTarget.setCustomValidity("");
              }
            }}
            className="form-input"
          />
        </div>
      </div>

      {/* <div className="flex flex-col gap-1">
        <label className="text-[11px] text-muted-foreground">Notes</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClassName}
          placeholder="e.g., felt heavy, tweak stance next time"
        />
      </div> */}

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:bg-slate-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/80"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
