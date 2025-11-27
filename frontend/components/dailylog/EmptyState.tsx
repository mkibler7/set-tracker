import React from "react";

type EmptyStateProps = {
  onStart: () => void;
};

export default function EmptyState({ onStart }: EmptyStateProps) {
  return (
    <div className="mt-24 flex flex-col items-center justify-center">
      <p className="mb-3 text-sm text-muted-foreground">
        Ready to log today&apos;s session?
      </p>
      <button
        type="button"
        onClick={onStart}
        className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
      >
        Start Workout
      </button>
    </div>
  );
}
