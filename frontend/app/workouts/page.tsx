import Link from "next/link";
import { Workout } from "@/data/mockWorkouts";

const mockWorkouts = [
  { id: "1", date: "2025-11-01", label: "Upper Body" },
  { id: "2", date: "2025-11-03", label: "Lower Body" },
];

function getTotalSets(workout: Workout): number {
  return workout.exercises.reduce(
    (totalSets, exercise) => totalSets + exercise.sets.length,
    0
  );
}

function getTotalVolume(workout: Workout): number {
  let totalVolume = 0;

  for (const exercise of workout.exercises) {
    for (const set of exercise.sets) {
      const exerciseVolume = set.reps * set.weight;
      totalVolume += exerciseVolume;
    }
  }

  return totalVolume;
}

export default function WorkoutsPage() {
  return (
    <section className="space-y-6 text-foreground">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workout History
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse your previous training sessions. Using mock data for now.
        </p>
      </header>

      <ul className="space-y-2">
        {mockWorkouts.map((w) => (
          <li key={w.id}>
            <Link
              href={`/workouts/${w.id}`}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-card/70"
            >
              <span>{w.date}</span>
              <span className="text-muted-foreground">{w.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
