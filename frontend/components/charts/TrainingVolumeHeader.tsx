"use client";

export function TrainingVolumeHeader() {
  return (
    <header className="flex flex-col items-center text-center gap-2">
      <h1 className="text-2xl font-semibold text-foreground">
        Training volume
      </h1>
      <p className="text-sm text-muted-foreground">
        Visualize how your total volume changes over time.
      </p>
    </header>
  );
}
