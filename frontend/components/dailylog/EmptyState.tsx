import React from "react";

type EmptyStateProps = {
  onStart: () => void;
};

export default function EmptyState({ onStart }: EmptyStateProps) {
  return (
    <div className="w-full max-w-md rounded-lg border border-dashed border-border bg-card/40 p-6 text-center">
      <p className="mb-3 text-sm text-muted-foreground">
        Ready to log today&apos;s session?
      </p>

      <button
        type="button"
        onClick={onStart}
        className="primary-button w-full sm:w-auto"
      >
        Start Workout
      </button>
    </div>
  );
}
