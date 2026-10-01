export default function MuscleAnalyticsPage({
  params,
}: {
  params: { muscle: string };
}) {
  const muscle = params.muscle.replace("-", " ");
  const label = muscle.charAt(0).toUpperCase() + muscle.slice(1);

  return (
    <main className="page">
      <h1 className="text-2xl font-semibold text-foreground mb-2">{label}</h1>

      <p className="text-sm text-muted-foreground mb-6">
        Future analytics for {label} will appear here — volume trends, PRs,
        exercise history, strength balance, and more.
      </p>

      <div className="rounded-xl border border-border bg-card/50 p-6 text-center text-muted-foreground">
        Muscle analytics coming soon.
      </div>
    </main>
  );
}
