type ExerciseDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExerciseDetailsPage({
  params,
}: ExerciseDetailsPageProps) {
  const { id } = await params;

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Exercise Details
        </h1>
        <p className="text-sm text-slate-400">Exercise ID: {id} (mock data)</p>
      </header>

      <div className="space-y-3">
        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Overview</h2>
          <p className="text-xs text-slate-400">
            Placeholder for name, primary muscle group, and description.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Usage Notes</h2>
          <p className="text-xs text-slate-400">
            Placeholder for cues, video links, and progression notes.
          </p>
        </div>
      </div>
    </section>
  );
}
