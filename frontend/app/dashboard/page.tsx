"use client";

import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { PageSectionTitle } from "@/components/ui/PageSectionTitle";
import { Button } from "@/components/ui/Button";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import { WorkoutCard } from "@/components/dashboard/WorkoutCard";
import Link from "next/link";
import PageBackButton from "@/components/shared/PageBackButton";
import {
  sortWorkoutsByDateDesc,
  getVolumeSeries,
  filterWorkoutsByRange,
  type TimeRange,
} from "@/lib/workouts/stats";
import { get } from "http";
import AreaGraphTrainingVolume from "@/components/charts/AreaGraphTrainingVolume";

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

export default function DashboardPage() {
  // Later this will call the backend; for now it's all mock data.
  const userFirstName = "Michael"; // TODO: replace with real user data

  const range: TimeRange = "1M";
  const filteredWorkouts = filterWorkoutsByRange(MOCK_WORKOUTS, range);
  const volumeData = getVolumeSeries(filteredWorkouts);

  const workouts = MOCK_WORKOUTS; // TODO: replace MOCK_WORKOUTS with API data once backend is wired up
  const recentWorkouts = sortWorkoutsByDateDesc(workouts).slice(0, 5);

  return (
    <main className="page">
      {/* Header */}
      <PageBackButton />
      <section className="mt-8 flex flex-col items-center text-center justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full flex text-center justify-center items-center">
          <h1 className="text-2xl font-semibold text-primary w-60 sm:w-full">
            Welcome back, {userFirstName}!
          </h1>
          {/* <p className="mt-1 text-sm text-muted-foreground">
            Here's a snapshot of your recent training.
          </p> */}
        </div>
        {/* <Link href="/dailylog">
          <Button variant="primary" className="whitespace-nowrap">
            Start Workout
          </Button>
        </Link> */}
      </section>

      {/* Stat tiles */}
      <section className="mt-2">
        <PageSectionTitle
          title="This week at a glance"
          subtitle="High-level summary of your recent work."
        />
        {/* top row */}
        <div className="mt-4 flex justify-center border-t border-muted-foreground/20 pt-4">
          <StatTile
            className="w-40 sm:w-60 border-r-1 border-muted-foreground/20 pr-4"
            {...mockStats[0]}
            asCard={false}
          />
          <StatTile
            className="w-40 sm:w-60 pl-4"
            {...mockStats[1]}
            asCard={false}
          />
        </div>

        {/* divider + PR */}
        <div className="mt-4 border-t border-slate-800 pt-4">
          <StatTile className="mb-2" {...mockStats[2]} asCard={false} />
        </div>
      </section>

      {/* Small embedded chart on the dashboard */}
      <section>
        <PageSectionTitle
          title="Training volume"
          subtitle="Charts and trends will live here."
        />

        <Link href="/charts">
          <div className="mt-4 cursor-pointer">
            <AreaGraphTrainingVolume data={volumeData} />
          </div>
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
          <p className="mt-3 text-sm text-muted-foreground text-center hover:text-primary">
            <Link href="/workouts">View All Workouts</Link>
          </p>
        )}
      </section>
    </main>
  );
}
