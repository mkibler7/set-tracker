import { notFound } from "next/navigation";

type WorkoutDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutDetailsPage({
  params,
}: WorkoutDetailsPageProps) {
  const { id } = await params;

  //   // For now, just mock an existing workout if id === "1"
  //   if (!id) {
  //     notFound();
  //   }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workout Details
        </h1>
        <p className="text-sm text-slate-400">Workout ID: {id} (mock data)</p>
      </header>

      <div className="space-y-3">
        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Summary</h2>
          <p className="text-xs text-slate-400">
            Placeholder for date, notes, total volume, etc.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 p-4">
          <h2 className="text-sm font-medium">Exercises &amp; Sets</h2>
          <p className="text-xs text-slate-400">
            Placeholder for exercise-list and set-table.
          </p>
        </div>
      </div>
    </section>
  );
}
