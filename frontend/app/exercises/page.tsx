import Link from "next/link";

const mockExercises = [
  { id: "bench-press", name: "Bench Press", muscleGroup: "Chest" },
  { id: "squat", name: "Back Squat", muscleGroup: "Quads/Glutes" },
];

export default function ExercisesPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Exercises</h1>
        <p className="text-sm text-muted-foreground">
          Browse and manage your exercise library. Mock-only for now.
        </p>
      </header>

      <ul className="space-y-2">
        {mockExercises.map((ex) => (
          <li key={ex.id}>
            <Link
              href={`/exercises/${ex.id}`}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-card/70"
            >
              <span>{ex.name}</span>
              <span className="text-xs text-muted-foreground">
                {ex.muscleGroup}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
