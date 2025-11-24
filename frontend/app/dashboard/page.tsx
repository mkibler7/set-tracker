import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { PageSectionTitle } from "@/components/ui/PageSectionTitle";
import { Button } from "@/components/ui/Button";
import {
  WorkoutCard,
  type DashboardWorkout,
} from "@/components/dashboard/WorkoutCard";

const mockStats = [
  {
    label: "Workouts this week",
    value: 4,
    helperText: "Goal: 5 sessions",
  },
  {
    label: "Total sets (7 days)",
    value: 62,
    helperText: "Keep volume consistent",
  },
  {
    label: "Top squat",
    value: "315 x 3",
    helperText: "Logged 2 days ago",
  },
];

const mockRecentWorkouts: DashboardWorkout[] = [
  {
    id: "w1",
    date: "Sun, Nov 23",
    name: "Push - Chest/Shoulders",
    totalSets: 18,
    totalVolume: 12450,
  },
  {
    id: "w2",
    date: "Fri, Nov 21",
    name: "Pull - Back/Biceps",
    totalSets: 16,
    totalVolume: 11120,
  },
  {
    id: "w3",
    date: "Wed, Nov 19",
    name: "Legs - Squat Focus",
    totalSets: 20,
    totalVolume: 15680,
  },
];

export default async function DashboardPage() {
  // Later this will call the backend; for now it's all mock data.
  const userFirstName = "Michael"; // TODO: replace with real user data

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      {/* Header */}
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-300">
            Welcome back, {userFirstName}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Here&apos;s a snapshot of your recent training.
          </p>
        </div>

        <Button
          variant="primary"
          className="whitespace-nowrap"
          // Later: onClick → router.push("/start")
        >
          Start Workout
        </Button>
      </section>

      {/* Stat tiles */}
      <section>
        <PageSectionTitle
          title="This week at a glance"
          subtitle="High-level summary of your recent work."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {mockStats.map((stat) => (
            <StatTile key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Chart placeholder */}
      <section>
        <PageSectionTitle
          title="Training volume"
          subtitle="Charts and trends will live here."
        />
        <Card className="h-52 flex items-center justify-center text-sm text-slate-500">
          {/* TODO: Replace with Recharts/Chart.js chart (Day 13) */}
          Volume-over-time chart placeholder
        </Card>
      </section>

      {/* Recent workouts */}
      <section className="pb-4">
        <PageSectionTitle
          title="Recent workouts"
          subtitle="Quick access to your latest sessions."
        />

        <div className="flex flex-col gap-3">
          {mockRecentWorkouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      </section>
    </main>
  );
}
