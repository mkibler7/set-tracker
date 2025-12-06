import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { PageSectionTitle } from "@/components/ui/PageSectionTitle";
import { Button } from "@/components/ui/Button";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import { WorkoutCard } from "@/components/dashboard/WorkoutCard";
import Link from "next/link";
import PageBackButton from "@/components/shared/PageBackButton";
import { sortWorkoutsByDateDesc } from "@/lib/workouts/stats";

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
    label: "Most Recent PR",
    value: "315 x 3",
    helperText: "Logged 2 days ago",
  },
];

export default async function DashboardPage() {
  // Later this will call the backend; for now it's all mock data.
  const userFirstName = "Michael"; // TODO: replace with real user data

  const workouts = MOCK_WORKOUTS; // TODO: replace MOCK_WORKOUTS with API data once backend is wired up
  const recentWorkouts = sortWorkoutsByDateDesc(workouts).slice(0, 5);

  return (
    <main className="page">
      {/* Header */}
      <PageBackButton />
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {userFirstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s a snapshot of your recent training.
          </p>
        </div>
        <Link href="/dailylog">
          <Button
            variant="primary"
            className="whitespace-nowrap"
            // Later: onClick → router.push("/start")
          >
            Start Workout
          </Button>
        </Link>
      </section>

      {/* Stat tiles */}
      <section>
        <PageSectionTitle
          title="This week at a glance"
          subtitle="High-level summary of your recent work."
        />

        <div className="grid gap-4 sm:grid-cols-3 text-center">
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
        <Link href="/dashboard/charts">
          {/* TODO: Replace with Recharts/Chart.js chart (Day 13) */}
          <Card className="h-52 flex cursor-pointer items-center justify-center text-sm text-muted-foreground hover:border-primary/60 hover:bg-card/60">
            Volume-over-time chart placeholder
          </Card>
        </Link>
      </section>

      {/* Recent workouts */}
      <section className="pb-4">
        <PageSectionTitle
          title="Recent workouts"
          subtitle="Quick access to your latest sessions."
        />

        <div className="flex flex-col gap-3">
          {recentWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
        {workouts.length > 5 && (
          <p className="mt-3 text-sm text-muted-foreground text-center">
            <Link href="/workouts">View All Workouts</Link>
          </p>
        )}
      </section>
    </main>
  );
}
