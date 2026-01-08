"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import { apiClient } from "@/lib/api/apiClient";

export default function AuthBootstrap() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const auth = useAuthStore.getState();
      const workouts = useWorkoutStore.getState();

      // If we already have a user in store (persisted), we can still optionally
      // verify it later; but for now, don’t block UI.
      if (auth.user) return;

      // 1) Try /me first (works if at cookie exists)
      const me = await apiClient<{
        id: string;
        email: string;
        displayName?: string;
      }>("/auth/me").catch(() => null);

      if (me) {
        auth.setUser({
          ...me,
          displayName: me.displayName ?? "",
        });
        return;
      }

      // 2) If /me failed, try refresh (uses rt cookie, sets at cookie)
      const refreshed = await apiClient<{ ok?: boolean; accessToken?: string }>(
        "/auth/refresh",
        { method: "POST" }
      ).catch(() => null);

      if (!refreshed) {
        // Hard logout client state
        auth.clear();
        workouts.resetWorkout();
        return;
      }

      // 3) Try /me again after refresh
      const me2 = await apiClient<{
        id: string;
        email: string;
        displayName?: string;
      }>("/auth/me").catch(() => null);

      if (me2) {
        auth.setUser({
          ...me2,
          displayName: me2.displayName ?? "",
        });
        return;
      }

      // If still no auth, clear
      auth.clear();
      workouts.resetWorkout();
    })();
  }, []);

  return null;
}
