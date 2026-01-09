"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageBackButton from "@/components/shared/PageBackButton";
import { StatTile } from "@/components/ui/StatTile";
import { PageSectionTitle } from "@/components/ui/PageSectionTitle";
import { WorkoutCard } from "@/components/dashboard/WorkoutCard";
import EmptyState from "@/components/shared/EmptyState";
import AreaGraphTrainingVolume from "@/components/charts/AreaGraphTrainingVolume";

import type { Workout } from "@/types/workout";
import {
  sortWorkoutsByDateDesc,
  getVolumeSeries,
  filterWorkoutsByRange,
  type TimeRange,
} from "@/lib/workouts/stats";
import { computeDashboardStats } from "@/lib/workouts/dashboardStats";
import { apiClient } from "@/lib/api/apiClient"; // use the SAME client fetch used elsewhere

export default function DashboardClient() {
  const userFirstName = "Michael"; // keep placeholder for now

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await apiClient<Workout[]>("/api/workouts");
        if (alive) setWorkouts(data);
      } catch {
        if (alive) setWorkouts([]);
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const range: TimeRange = "1M";

  const { workoutsLast7Days, totalSetsLast7Days } = useMemo(
    () => computeDashboardStats(workouts),
    [workouts]
  );

  const displayStats = useMemo(
    () => [
      {
        label: "Workouts (7 days)",
        value: workoutsLast7Days,
        helperText:
          workoutsLast7Days === 0
            ? "Log your first workout"
            : "Keep momentum going",
      },
      {
        label: "Total sets (7 days)",
        value: totalSetsLast7Days,
        helperText:
          totalSetsLast7Days === 0
            ? "Start tracking volume"
            : "Consistency compounds",
      },
    ],
    [workoutsLast7Days, totalSetsLast7Days]
  );

  const filteredWorkouts = useMemo(
    () => filterWorkoutsByRange(workouts, range),
    [workouts, range]
  );

  const volumeData = useMemo(
    () => getVolumeSeries(filteredWorkouts),
    [filteredWorkouts]
  );

  const recentWorkouts = useMemo(
    () => sortWorkoutsByDateDesc(workouts).slice(0, 5),
    [workouts]
  );

  return (
    <main className="page">
      <PageBackButton />

      {/* Header */}
      <section className="mt-8 flex flex-col items-center text-center justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full flex text-center justify-center items-center">
          <h1 className="text-2xl font-semibold text-primary w-60 sm:w-full">
            Welcome back, {userFirstName}!
          </h1>
        </div>
      </section>

      {/* Stat tiles */}
      <section className="mt-2">
        <PageSectionTitle
          title="This week at a glance"
          subtitle="High-level summary of your recent work."
        />

        <div className="my-4 flex justify-center border-t border-muted-foreground/20 pt-4">
          <StatTile
            className="w-40 sm:w-60 border-r-1 border-muted-foreground/20 pr-4"
            {...displayStats[0]}
            asCard={false}
          />
          <StatTile
            className="w-40 sm:w-60 pl-4"
            {...displayStats[1]}
            asCard={false}
          />
        </div>
      </section>

      {/* Training volume */}
      <section>
        <PageSectionTitle
          title="Training volume"
          subtitle="Charts and trends will live here."
        />

        {isLoading ? (
          <div className="mt-4">
            <EmptyState
              title="Loading..."
              description="Fetching your workouts."
            />
          </div>
        ) : volumeData.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No workouts yet"
              description="Log your first workout to see charts here."
              action={
                <Link href="/dailylog" className="text-primary hover:underline">
                  Start a workout
                </Link>
              }
            />
          </div>
        ) : (
          <Link href="/charts">
            <div className="mt-4 cursor-pointer">
              <AreaGraphTrainingVolume data={volumeData} />
            </div>
          </Link>
        )}
      </section>

      {/* Recent workouts */}
      <section className="pb-4">
        <PageSectionTitle
          title="Recent workouts"
          subtitle="Quick access to your latest sessions."
        />

        {isLoading ? (
          <div className="mt-4">
            <EmptyState
              title="Loading..."
              description="Fetching your recent sessions."
            />
          </div>
        ) : recentWorkouts.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No workouts yet"
              description="Log your first workout to see your recent sessions here."
              action={
                <Link href="/dailylog" className="text-primary hover:underline">
                  Go to Daily Log
                </Link>
              }
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>
    </main>
  );
}
