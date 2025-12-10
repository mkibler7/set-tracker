"use client";

type Props = {
  //   range: TimeRange;
  //   onChange: (range: TimeRange) => void;
};

export function TrainingVolumeHeader({}: Props) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Training volume
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Visualize how your total volume changes over time.
        </p>
      </div>
    </header>
  );
}
